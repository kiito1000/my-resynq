import {
  LocalParticipant,
  LocalPresentation,
  LocalPresentationStatus,
  LocalProject,
  Participant,
  Presentation,
  PresentationStatus,
  Project,
} from "@/firebase/db";
import dayjs from "dayjs";

export const convertToLocalProject = (
  projectId: string,
  input: Project
): LocalProject => {
  return {
    ...input,
    id: projectId,
    createDate: dayjs.unix(input.createDate),
    holdDate: input.holdDate != null ? dayjs.unix(input.holdDate) : undefined,
    slide: {
      questions:
        input.slide?.questions?.map((question) => ({
          ...question,
          choices: question.choices ?? [],
        })) ?? [],
    },
  };
};

export const convertToLocalPresentationStatus = (
  input: PresentationStatus
): LocalPresentationStatus => {
  switch (input.type) {
    case "accept": {
      return {
        ...input,
        startDate: dayjs.unix(input.startDate),
        question: {
          ...input.question,
          choices: input.question.choices ?? [],
        },
      };
    }
    case "calculate": {
      return {
        ...input,
        startDate: dayjs.unix(input.startDate),
        question: {
          ...input.question,
          choices: input.question.choices ?? [],
        },
      };
    }
    case "check": {
      return {
        ...input,
        startDate: dayjs.unix(input.startDate),
        question: {
          ...input.question,
          choices: input.question.choices ?? [],
        },
      };
    }
    case "rank": {
      return {
        ...input,
        records: input.records ?? [],
      };
    }
    default:
      return input;
  }
};

export const convertToPresentationStatus = (
  input: Exclude<LocalPresentationStatus, { type: "blank" }>
): PresentationStatus => {
  switch (input.type) {
    case "accept":
    case "calculate":
    case "check":
      return { ...input, startDate: input.startDate.unix() };
    default:
      return input;
  }
};

export const convertToLocalPresentation = (
  presentationId: string,
  input: Presentation
): LocalPresentation => {
  return {
    id: presentationId,
    ownerUserId: input.ownerUserId,
    projectId: input.projectId,
    startDate:
      input.startDate != null ? dayjs.unix(input.startDate) : undefined,
    endDate: input.endDate != null ? dayjs.unix(input.endDate) : undefined,
    name: input.name,
    hashtag: input.hashtag,
    participants: input.participants,
    ranking: input.ranking ?? [],
  };
};

export const convertToLocalParticipant = (
  userId: string,
  input: Participant
): LocalParticipant => {
  return {
    ...input,
    id: userId,
    joinDate: dayjs.unix(input.joinDate),
    answers: input.answers ?? {},
  };
};
