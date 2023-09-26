import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { FC, useCallback, useState } from "react";
import { BeforeDragParams, List, OnChangeMeta, arrayMove } from "react-movable";
import { QuestionTableHeader } from "./QuestionTableHeader";
import { QuestionTableItem, QuestionTableRow } from "./QuestionTableRow";

export type QuestionTableProps = {
  items: QuestionTableItem[];
};

export const QuestionTable: FC<QuestionTableProps> = ({ items }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(
    (state) => state.slideEditor.selectedQuestionId
  );
  const [widths, setWidths] = useState<string[]>([]);

  const beforeDrag = useCallback(({ elements, index }: BeforeDragParams) => {
    const cells = Array.from(elements[index].children);
    const widths = cells.map((cell) => window.getComputedStyle(cell).width);
    setWidths(widths);
  }, []);
  const handleChange = useCallback(
    ({ oldIndex, newIndex }: OnChangeMeta) => {
      const questionIds = arrayMove(items, oldIndex, newIndex).map(
        (item) => item.questionId
      );
      dispatch(({ slideEditor }) => slideEditor.sortQuestions({ questionIds }));
    },
    [dispatch, items]
  );
  const handleClick = useCallback(
    (questionId: string) => {
      dispatch(({ slideEditor }) => slideEditor.selectQuestion(questionId));
    },
    [dispatch]
  );
  const handleRemove = useCallback(
    (index: number) => {
      const questionId = items[index]?.questionId;
      if (questionId != null) {
        dispatch(({ slideEditor }) =>
          slideEditor.removeQuestion({ questionId })
        );
      }
    },
    [dispatch, items]
  );

  return (
    <Box sx={{ overflow: "hidden" }}>
      <TableContainer sx={{ height: "100%" }}>
        <List
          lockVertically
          values={items}
          onChange={handleChange}
          beforeDrag={beforeDrag}
          renderList={({ children, props }) => (
            <Table
              stickyHeader
              aria-label="question table"
              sx={{ tableLayout: "fixed" }}
            >
              <TableHead>
                <QuestionTableHeader />
              </TableHead>
              <TableBody {...props}>{children}</TableBody>
            </Table>
          )}
          renderItem={(params) => (
            <QuestionTableRow
              {...params}
              key={params.value.questionId}
              cellWidths={widths}
              isItemSelected={selected === params.value.questionId}
              onClick={handleClick}
              onRemove={handleRemove}
            />
          )}
        />
      </TableContainer>
    </Box>
  );
};
