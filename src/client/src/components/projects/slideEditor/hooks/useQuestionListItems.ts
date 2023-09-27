import { LocalProject } from "@/firebase/db";
import { useMemo } from "react";
import { QuestionTableItem } from "../QuestionTableRow";

export const useQuestionListItems = (
  project: LocalProject
): QuestionTableItem[] => {
  return useMemo(
    () =>
      project.slide.questions.map((question) => ({
        questionId: question.id,
        title: question.title,
        choiceCount: question.choices.length,
      })),
    [project.slide.questions]
  );
};
