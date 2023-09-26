import { Choice } from "@/firebase/db";
import { Input } from "@components/Input";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
  IconButton,
  styled,
  TableCell,
  TableRow,
  Checkbox,
} from "@mui/material";
import { themes } from "@styles/theme";
import React, { FC, useCallback } from "react";
import { Control, Controller } from "react-hook-form";
import { RenderItemParams } from "react-movable";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: 18,
  borderBottom: "none",
}));

export type FormInputs = {
  choices: Choice[];
};

export type QuestionChoiceTableRowProps = RenderItemParams<Choice> & {
  control: Control<FormInputs>;
  onRemove: (index: number) => void;
  cellWidths: string[];
};

export const QuestionChoiceTableRow: FC<QuestionChoiceTableRowProps> = ({
  isDragged,
  index,
  props,
  control,
  cellWidths,
  onRemove,
}) => {
  const handleRemove = useCallback(() => {
    if (index != null) {
      onRemove(index);
    }
  }, [index, onRemove]);

  return (
    <TableRow
      {...props}
      tabIndex={-1}
      {...(isDragged && {
        component: "div", // escape from warning: "validateDOMNesting"
        sx: {
          display: "flex",
          alignItems: "center",
          backgroundColor: "primary.light",
        },
      })}
    >
      <StyledTableCell
        {...(isDragged && {
          component: "div",
          sx: { width: cellWidths[0] },
        })}
      >
        <IconButton
          data-movable-handle
          size="large"
          aria-label="drag"
          sx={{
            padding: 0,
            cursor: isDragged ? "grab" : "grabbing",
            color: "text.secondary",
          }}
        >
          <DragHandleIcon fontSize="inherit" />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell
        {...(isDragged && {
          component: "div",
          sx: {
            width: cellWidths[1],
            display: "flex",
            justifyContent: "flex-end",
          },
        })}
      >
        {index != null && (
          <Controller
            control={control}
            name={`choices.${index}.isCorrect` as const}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                sx={{
                  padding: 0,
                  "& .MuiSvgIcon-root": { fontSize: 40 },
                  color: themes.slide.default.palette.choices[index]?.main,
                  "&.Mui-checked": {
                    color: themes.slide.default.palette.choices[index]?.main,
                  },
                }}
              />
            )}
          />
        )}
      </StyledTableCell>
      <StyledTableCell
        {...(isDragged && {
          component: "div",
          sx: { width: cellWidths[2] },
        })}
      >
        {index != null && (
          <Controller
            control={control}
            name={`choices.${index}.label` as const}
            render={({ field }) => <Input {...field} sx={{ width: 1.0 }} />}
          />
        )}
      </StyledTableCell>
      <StyledTableCell
        {...(isDragged && {
          component: "div",
          sx: { width: cellWidths[3] },
        })}
      >
        <IconButton
          sx={{ padding: 0, color: "text.secondary" }}
          size="large"
          aria-label="delete"
          onClick={handleRemove}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </StyledTableCell>
    </TableRow>
  );
};
