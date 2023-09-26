import { FC, ReactNode, createContext, useCallback } from "react";

export type QuestionCardScrollContext = {
  createQuestionId?: (questionId: string) => string;
  scrollTo?: (questionId: string) => void;
};

export const QuestionCardScrollContext =
  createContext<QuestionCardScrollContext>({});

export const QuestionCardScrollContextProvider: FC<{
  scrollOffset: number;
  children: ReactNode;
}> = ({ scrollOffset, children }) => {
  const scrollElement = useCallback(
    (element: HTMLElement) => {
      const parent = element.parentElement;
      if (parent == null) return;

      const offsetPosition =
        element.offsetTop - scrollOffset - parent.offsetTop;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    },
    [scrollOffset]
  );

  const createQuestionId = useCallback(
    (questionId: string) => `question-${questionId}`,
    []
  );

  const scrollTo = useCallback(
    (questionId: string) => {
      const id = createQuestionId(questionId);
      const element = document.getElementById(id);
      if (element != null) {
        scrollElement(element);
      }
    },
    [createQuestionId, scrollElement]
  );

  return (
    <QuestionCardScrollContext.Provider value={{ createQuestionId, scrollTo }}>
      {children}
    </QuestionCardScrollContext.Provider>
  );
};
