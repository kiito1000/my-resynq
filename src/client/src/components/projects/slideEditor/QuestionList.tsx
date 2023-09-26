import { LocalProject } from "@/firebase/db";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import { Button, Card, CardProps, Divider, Typography } from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { strings } from "@strings";
import React, { FC, useCallback } from "react";
import { useQuestionListItems } from "./hooks/useQuestionListItems";
import { QuestionTable } from "./QuestionTable";

const maxQuestions = 15;

export type QuestionListProps = CardProps & {
  project: LocalProject;
};

export const QuestionList: FC<QuestionListProps> = ({
  project,
  sx,
  ...props
}) => {
  const dispatch = useAppDispatch();

  const items = useQuestionListItems(project);
  const addQuestion = useCallback(() => {
    dispatch(({ slideEditor }) => slideEditor.addQuestion());
  }, [dispatch]);

  return (
    <Card
      elevation={0}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          border: 1,
          borderColor: "border.main",
          borderRadius: 1,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Typography
        variant="h3"
        sx={{ marginTop: 2, marginBottom: 4, marginLeft: 3 }}
      >
        {strings.project.questionList}
      </Typography>
      <QuestionTable items={items} />
      <Button
        disabled={items.length >= maxQuestions}
        color="inherit"
        disableElevation
        startIcon={<AddIcon />}
        onClick={addQuestion}
        sx={{
          height: 54,
          borderRadius: 0,
        }}
      >
        {strings.project.addQuestion}
      </Button>
      <Divider />
    </Card>
  );
};
