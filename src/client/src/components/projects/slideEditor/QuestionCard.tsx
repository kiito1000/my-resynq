import { LocalQuestion } from "@/firebase/db";
import { Input } from "@components/Input";
import { Box, Card, FormControl, InputLabel } from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { strings } from "@strings";
import { FC, useCallback, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  QuestionChoiceTable,
  QuestionChoiceTableProps,
} from "./QuestionChoiceTable";
import { QuestionCardScrollContext } from "./contexts/QuestionCardScrollContext";

export type QuestionCardProps = {
  className?: string;
  question: LocalQuestion;
};

export const QuestionCard: FC<QuestionCardProps> = ({
  className,
  question,
}) => {
  const dispatch = useAppDispatch();
  const { createQuestionId } = useContext(QuestionCardScrollContext);

  const { register, setValue, getValues } = useForm<LocalQuestion>({
    defaultValues: { ...question },
  });
  const titleInputElementRef = useRef<HTMLInputElement>();
  const handleChange = useCallback(() => {
    const question = getValues();
    dispatch(({ slideEditor }) => slideEditor.editQuestion({ question }));
  }, [dispatch, getValues]);
  const handleChangeTable: QuestionChoiceTableProps["onChange"] = useCallback(
    (values) => {
      setValue("choices", values.choices);
      handleChange();
    },
    [handleChange, setValue]
  );

  return (
    <Card
      id={createQuestionId?.(question.id)}
      className={className}
      elevation={0}
      sx={{
        border: 1,
        borderColor: (theme) => theme.palette.border.main,
        borderRadius: 1,
        p: 4,
      }}
    >
      <form onChange={handleChange}>
        <FormControl
          sx={{
            width: 1.0,
          }}
          variant="standard"
        >
          <InputLabel
            sx={{
              fontSize: "default",
              transform: "none",
              color: "text.primary",
            }}
            shrink
            focused={false}
            disableAnimation
            htmlFor="title-input"
          >
            {strings.project.questionTitle}
          </InputLabel>
          <Input
            inputRef={titleInputElementRef}
            sx={{
              "label + &": {
                marginTop: 4,
              },
            }}
            id="title-input"
            {...register("title")}
          />
        </FormControl>
      </form>
      <Box sx={{ mt: 2 }}>
        <QuestionChoiceTable
          choices={question.choices}
          onChange={handleChangeTable}
        />
      </Box>
    </Card>
  );
};
