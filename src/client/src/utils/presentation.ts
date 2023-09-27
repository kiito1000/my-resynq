import {
  Answers,
  LocalParticipant,
  LocalPresentationStatus,
  LocalProject,
  LocalQuestion,
  LocalStatusAccept,
  LocalStatusCalculate,
  LocalStatusCheck,
  LocalStatusRank,
  ParticipantMap,
  SlidePage,
  UserRecord,
} from "@/firebase/db";
import { Dayjs } from "dayjs";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";
import mapValues from "lodash.mapvalues";
import orderBy from "lodash.orderby";
import uniq from "lodash.uniq";

export const createSlidePages = (project: LocalProject): SlidePage[] =>
  [
    { type: "start" as const },
    ...project.slide.questions.map((question, i) => ({
      type: "question" as const,
      question: { ...question, index: i + 1 },
    })),
    {
      type: "rank" as const,
      ranking: [],
    },
    {
      type: "end" as const,
    },
  ].map((page, i) => ({ ...page, index: i + 1 }));

export const createAnswers = (participants: ParticipantMap): Answers => {
  const answers = Object.entries(participants).flatMap(
    ([userId, participant]) =>
      Object.entries(participant.answers ?? {}).flatMap(
        ([questionId, choiceIds = []]) =>
          choiceIds.map((choiceId) => ({
            userId,
            choiceId,
            questionId,
          }))
      )
  );
  return mapValues(groupBy(answers, "questionId"), (depth1) => ({
    answeredUsers: uniq(depth1.map(({ userId }) => userId)),
    choices: mapValues(groupBy(depth1, "choiceId"), (depth2) =>
      depth2.map((answer) => answer.userId)
    ),
  }));
};

export const createRanking = (
  questions: LocalQuestion[],
  participants: ParticipantMap
) => {
  const questionMap = keyBy(questions, "id");
  const calculatePoints = (answers: LocalParticipant["answers"]): number => {
    return Object.entries(answers).filter(([questionId, choiceIds]) => {
      const corrects =
        questionMap[questionId]?.choices
          .filter((choice) => choice.isCorrect)
          .map((choice) => choice.id) ?? [];
      return corrects.includes(choiceIds[0]);
    }).length;
  };
  const partialRecords = Object.entries(participants).map(
    ([userId, { joinDate, displayName, iconUrl, answers }]) => ({
      joinDate,
      userId,
      displayName,
      iconUrl,
      points: answers != null ? calculatePoints(answers) : 0,
    })
  );
  // ポイントが多い人が上位 (同点の場合参加日時が早い人がより上)
  const records = orderBy(
    partialRecords,
    ["points", "joinDate"],
    ["desc", "asc"]
  ).reduce<UserRecord[]>((prev, { joinDate: _, ...current }, i) => {
    const prevRecord = prev[prev.length - 1];
    if (prevRecord == null) {
      return [...prev, { ...current, rank: 1 }];
    }
    const rank = prevRecord.points === current.points ? prevRecord.rank : i + 1;
    return [...prev, { ...current, rank }];
  }, []);

  return records;
};

const createStatusAccept = (
  question: LocalQuestion,
  startDate: Dayjs
): LocalStatusAccept => {
  return {
    type: "accept",
    startDate,
    question: {
      id: question.id,
      title: question.title,
      choices: question.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
      })),
    },
  };
};

const createStatusAcceptFromStatus = (
  status: LocalStatusCalculate
): LocalStatusAccept => {
  return {
    type: "accept",
    startDate: status.startDate,
    question: {
      ...status.question,
      choices: status.question.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
      })),
    },
  };
};

const createStatusCalculate = (
  status: LocalStatusAccept | LocalStatusCheck,
  participants: ParticipantMap
): LocalStatusCalculate => {
  const { question } = status;
  const answers = createAnswers(participants);
  const answerCount = answers[question.id]?.answeredUsers.length ?? 0;
  const choices = question.choices.map((choice) => {
    const selectedCount = answers[question.id]?.choices[choice.id]?.length ?? 0;
    return {
      id: choice.id,
      label: choice.label,
      selectedRate: answerCount === 0 ? 0 : selectedCount / answerCount,
    };
  });

  return {
    type: "calculate",
    startDate: status.startDate,
    question: { ...question, choices },
  };
};

const createStatusCheckFromStatus = (
  status: LocalStatusCalculate,
  question: LocalQuestion
): LocalStatusCheck => {
  const choices = status.question.choices.map((statusChoice) => ({
    ...statusChoice,
    isCorrect:
      question.choices.find((choice) => choice.id === statusChoice.id)
        ?.isCorrect ?? false,
  }));

  return {
    type: "check",
    startDate: status.startDate,
    question: { ...status.question, choices },
  };
};

const createStatusCheck = (
  question: LocalQuestion,
  participants: ParticipantMap,
  startDate: Dayjs
): LocalStatusCheck => {
  const answers = Object.entries(participants).flatMap(
    ([userId, participant]) =>
      (participant.answers?.[question.id] ?? []).map((choiceId) => ({
        userId,
        choiceId,
      }))
  );
  const answerCount = answers.length;
  const choiceMap = groupBy(answers, "choiceId");
  const choices = question.choices.map((choice) => {
    const selectedCount = choiceMap[choice.id]?.length ?? 0;
    return {
      ...choice,
      selectedRate: answerCount === 0 ? 0 : selectedCount / answerCount,
    };
  });

  return {
    type: "check",
    startDate,
    question: {
      id: question.id,
      title: question.title,
      choices,
    },
  };
};

const createStatusRank = (
  questions: LocalQuestion[],
  participants: ParticipantMap
): LocalStatusRank => {
  const records = createRanking(questions, participants);
  return {
    type: "rank",
    records,
  };
};

export type StatusErrorReason =
  | "NoQuestions"
  | "QuestionNotFound"
  | "OutOfRange";

export type StatusError = {
  type: "error";
  reason: StatusErrorReason;
};

export const getNextStatus = (
  status: Exclude<LocalPresentationStatus, { type: "blank" }>,
  project: LocalProject,
  participants: ParticipantMap,
  date: Dayjs
): LocalPresentationStatus | StatusError => {
  switch (status.type) {
    case "start": {
      const question = project.slide.questions[0];
      if (question == null) {
        return { type: "error", reason: "NoQuestions" };
      }
      return createStatusAccept(question, date);
    }
    case "accept": {
      return createStatusCalculate(status, participants);
    }
    case "calculate": {
      const question = project.slide.questions.find(
        (question) => question.id === status.question.id
      );
      if (question == null) {
        return {
          type: "error",
          reason: "QuestionNotFound",
        };
      }
      return createStatusCheckFromStatus(status, question);
    }
    case "check": {
      const questionIndex = project.slide.questions.findIndex(
        (question) => question.id === status.question.id
      );
      if (questionIndex === -1) {
        return createStatusRank(project.slide.questions, participants);
      }

      const question = project.slide.questions[questionIndex + 1];
      if (question == null) {
        return createStatusRank(project.slide.questions, participants);
      }

      return createStatusAccept(question, date);
    }
    case "rank": {
      return { type: "end" };
    }
    case "end": {
      return { type: "error", reason: "OutOfRange" };
    }
  }
};

export const getPreviousStatus = (
  status: Exclude<LocalPresentationStatus, { type: "blank" }>,
  project: LocalProject,
  participants: ParticipantMap,
  date: Dayjs
): LocalPresentationStatus | StatusError => {
  switch (status.type) {
    case "start": {
      return { type: "error", reason: "OutOfRange" };
    }
    case "accept": {
      const questionIndex = project.slide.questions.findIndex(
        (question) => question.id === status.question.id
      );
      if (questionIndex === -1) {
        return {
          type: "error",
          reason: "QuestionNotFound",
        };
      }

      const question = project.slide.questions[questionIndex - 1];
      if (question == null) {
        return { type: "start" };
      }

      return createStatusCheck(question, participants, date);
    }
    case "calculate": {
      return createStatusAcceptFromStatus(status);
    }
    case "check": {
      return createStatusCalculate(status, participants);
    }
    case "rank": {
      const question =
        project.slide.questions[project.slide.questions.length - 1];
      if (question == null) {
        return { type: "error", reason: "NoQuestions" };
      }
      return createStatusCheck(question, participants, date);
    }
    case "end": {
      return createStatusRank(project.slide.questions, participants);
    }
  }
};
