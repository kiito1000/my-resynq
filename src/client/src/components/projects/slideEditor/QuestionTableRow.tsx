import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { IconButton, styled, TableCell, TableRow } from "@mui/material";
import React, { FC, useCallback, useEffect, useRef } from "react";
import { RenderItemParams } from "react-movable";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.MuiTableRow-hover:hover": {
    backgroundColor: theme.palette.action.coloredHover,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: 18,
}));

const NoWrapTableCell = styled(StyledTableCell)({
  overflowX: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export type QuestionTableItem = {
  questionId: string;
  title: string;
  choiceCount: number;
};

export type QuestionTableRowProps = RenderItemParams<QuestionTableItem> & {
  cellWidths: string[];
  isItemSelected: boolean;
  onClick: (questionId: string) => void;
  onRemove: (index: number) => void;
};

type DefaultQuestionTableRowProps = Omit<
  RenderItemParams<QuestionTableItem>,
  "isDragged"
> & {
  isItemSelected: boolean;
  onClick: (questionId: string) => void;
  onRemove: (index: number) => void;
};

type DraggingQuestionTableRowProps = Omit<
  RenderItemParams<QuestionTableItem>,
  "isDragged"
> & {
  cellWidths: string[];
};

const DefaultQuestionTableRow: FC<DefaultQuestionTableRowProps> = ({
  value,
  index,
  props,
  isItemSelected,
  onClick,
  onRemove,
}) => {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const handleRemove = useCallback(() => {
    if (index != null) {
      onRemove(index);
    }
  }, [index, onRemove]);
  const handleClick = useCallback(() => {
    onClick(value.questionId);
  }, [onClick, value.questionId]);

  useEffect(() => {
    if (isItemSelected) {
      // Note: It does not work on Chromium
      // cf. https://bugs.chromium.org/p/chromium/issues/detail?id=833617
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [isItemSelected]);

  return (
    <StyledTableRow
      {...props}
      ref={ref}
      tabIndex={-1}
      hover
      selected={isItemSelected}
      onClick={handleClick}
    >
      <StyledTableCell>
        <IconButton
          data-movable-handle
          size="small"
          aria-label="drag"
          sx={{ cursor: "grab", color: "text.secondary" }}
        >
          <DragHandleIcon />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell>{index != null ? index + 1 : ""}</StyledTableCell>
      <NoWrapTableCell
        sx={{
          fontSize: 20,
        }}
      >
        {value.title}
      </NoWrapTableCell>
      <StyledTableCell>{value.choiceCount}</StyledTableCell>
      <StyledTableCell sx={{ padding: 1 }}>
        <IconButton
          size="small"
          aria-label="delete"
          onClick={handleRemove}
          sx={{ color: "text.secondary" }}
        >
          <DeleteIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

const DraggingQuestionTableRow: FC<DraggingQuestionTableRowProps> = ({
  value,
  index,
  props,
  cellWidths,
}) => {
  return (
    <StyledTableRow
      {...props}
      as="div" // escape from warning: "validateDOMNesting"
      tabIndex={-1}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "primary.light",
      }}
    >
      <StyledTableCell component="div" sx={{ width: cellWidths[0] }}>
        <IconButton
          data-movable-handle
          size="small"
          aria-label="drag"
          sx={{ cursor: "grabbing", color: "text.secondary" }}
        >
          <DragHandleIcon />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell component="div" sx={{ width: cellWidths[1] }}>
        {index != null ? index + 1 : ""}
      </StyledTableCell>
      <NoWrapTableCell
        component="div"
        sx={{
          fontSize: 20,
          width: cellWidths[2],
        }}
      >
        {value.title}
      </NoWrapTableCell>
      <StyledTableCell component="div" sx={{ width: cellWidths[3] }}>
        {value.choiceCount}
      </StyledTableCell>
      <StyledTableCell sx={{ padding: 1 }}>
        <IconButton
          size="small"
          aria-label="delete"
          sx={{ color: "text.secondary" }}
        >
          <DeleteIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export const QuestionTableRow: FC<QuestionTableRowProps> = ({
  isDragged,
  cellWidths,
  onRemove,
  ...params
}) => {
  if (isDragged) {
    return <DraggingQuestionTableRow {...params} cellWidths={cellWidths} />;
  } else {
    return <DefaultQuestionTableRow {...params} onRemove={onRemove} />;
  }
};
