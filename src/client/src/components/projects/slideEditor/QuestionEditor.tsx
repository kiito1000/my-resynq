import { Box, BoxProps, styled } from "@mui/material";
import { FC, useContext, useEffect } from "react";
import { QuestionCard, QuestionCardProps } from "./QuestionCard";
import { QuestionCardScrollContext } from "./contexts/QuestionCardScrollContext";
import { useAppSelector } from "@redux/hooks/useAppSelector";

const StyledQuestionCard = styled(QuestionCard)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export type QuestionEditorProps = BoxProps & {
  questions: QuestionCardProps["question"][];
};

export const QuestionEditor: FC<QuestionEditorProps> = ({
  questions,
  sx,
  ...props
}) => {
  const { scrollTo } = useContext(QuestionCardScrollContext);
  const selectedQuestionId = useAppSelector(
    (state) => state.slideEditor.selectedQuestionId
  );

  useEffect(() => {
    if (selectedQuestionId) {
      scrollTo?.(selectedQuestionId);
    }
  }, [scrollTo, selectedQuestionId]);

  return (
    <Box
      sx={[
        { display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {questions.map((question) => (
        <StyledQuestionCard key={question.id} question={question} />
      ))}
    </Box>
  );
};
