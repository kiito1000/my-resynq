import AddIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Table, TableBody, TableHead } from "@mui/material";
import { strings } from "@strings";
import React, { FC, useCallback, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { BeforeDragParams, List, OnChangeMeta } from "react-movable";
import { v4 as uuid } from "uuid";
import { QuestionChoiceTableHeader } from "./QuestionChoiceTableHeader";
import { FormInputs, QuestionChoiceTableRow } from "./QuestionChoiceTableRow";

const maxChoices = 6;

export type QuestionChoiceTableProps = FormInputs & {
  onChange: SubmitHandler<FormInputs>;
};

export const QuestionChoiceTable: FC<QuestionChoiceTableProps> = ({
  choices,
  onChange,
}) => {
  const { control, getValues } = useForm<FormInputs>({
    defaultValues: { choices },
  });
  const { fields, move, append, remove } = useFieldArray({
    control,
    name: "choices",
    keyName: "choiceId",
  });

  const [widths, setWidths] = useState<string[]>([]);
  const beforeDrag = useCallback(({ elements, index }: BeforeDragParams) => {
    const cells = Array.from(elements[index].children);
    const widths = cells.map((cell) => window.getComputedStyle(cell).width);
    setWidths(widths);
  }, []);
  const handleChange = useCallback(() => {
    onChange(getValues());
  }, [getValues, onChange]);
  const handleSort = useCallback(
    ({ oldIndex, newIndex }: OnChangeMeta) => {
      move(oldIndex, newIndex);
      handleChange();
    },
    [handleChange, move]
  );
  const handleAdd = useCallback(() => {
    append({
      id: uuid(),
      label: "",
      isCorrect: false,
    });
    handleChange();
  }, [append, handleChange]);
  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
      handleChange();
    },
    [handleChange, remove]
  );

  return (
    <form onChange={handleChange}>
      <List
        lockVertically
        values={fields}
        onChange={handleSort}
        beforeDrag={beforeDrag}
        renderList={({ children, props }) => (
          <Table aria-label="question table">
            <TableHead>
              <QuestionChoiceTableHeader />
            </TableHead>
            <TableBody {...props}>{children}</TableBody>
          </Table>
        )}
        renderItem={(params) => (
          <QuestionChoiceTableRow
            {...params}
            key={params.value.id}
            control={control}
            cellWidths={widths}
            onRemove={handleRemove}
          />
        )}
      />
      <Box
        sx={{
          my: 1,
          mr: "58px", // 50 + 8
          ml: "108px", // 100 + 8
        }}
      >
        <Button
          disabled={fields.length >= maxChoices}
          onClick={handleAdd}
          color="inherit"
          disableElevation
          startIcon={<AddIcon />}
          sx={{
            width: 1.0,
            height: 46.75,
            fontSize: 16,
            border: 1,
            borderStyle: "dashed",
            borderColor: "border.main",
            borderRadius: 1,
            backgroundColor: "#F4F5F6",
          }}
        >
          {strings.project.addChoice}
        </Button>
      </Box>
    </form>
  );
};
