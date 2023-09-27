import { LocalParticipant, SlidePage } from "@/firebase/db";
import { Stack } from "@mui/material";
import { strings } from "@strings";
import { FC, useMemo } from "react";
import {
  QuestionChoiceTable,
  QuestionChoiceTableItem,
} from "./QuestionChoiceTable";
import { QuestionStatus } from "./QuestionStatus";
import { SlidePageItemTemplate } from "./SlidePageItemTemplate";

type UserId = string;

export type SlideQuestionPageItemProps = {
  page: Extract<SlidePage, { type: "question" }>;
  answers: {
    [choiceId: string]: UserId[];
  };
  participants: LocalParticipant[];
};

export const SlideQuestionPageItem: FC<SlideQuestionPageItemProps> = ({
  page,
  answers,
  participants,
}) => {
  const answeredUsers = useMemo(
    () =>
      participants.filter(
        (participant) => page.question.id in participant.answers
      ).length,
    [page.question.id, participants]
  );
  const joinedUsers = participants.length;
  const choiceTableItems: QuestionChoiceTableItem[] = useMemo(() => {
    return page.question.choices.map((choice) => {
      const users = answers[choice.id] ?? [];
      return {
        ...choice,
        selectedRate: answeredUsers === 0 ? 0 : users.length / answeredUsers,
        selectedCount: users.length,
      };
    });
  }, [answeredUsers, answers, page.question.choices]);

  return (
    <SlidePageItemTemplate
      title={strings.presenter.pageTitles.question(
        page.question.title,
        page.question.index
      )}
      page={page}
    >
      <Stack direction="row" spacing={5} sx={{ mx: 4, my: 3 }}>
        <QuestionChoiceTable items={choiceTableItems} />
        <QuestionStatus
          status={page.status}
          answeredUsers={answeredUsers}
          joinedUsers={joinedUsers}
        />
      </Stack>
    </SlidePageItemTemplate>
  );
};
