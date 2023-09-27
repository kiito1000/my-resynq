import { TableCell, TableRow, TableRowProps, styled } from "@mui/material";
import { strings } from "@strings";
import React, { FC } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export type QuestionChoiceTableHeaderProps = TableRowProps;

export const QuestionChoiceTableHeader: FC<QuestionChoiceTableHeaderProps> = (
  props
) => {
  return (
    <TableRow {...props}>
      <StyledTableCell sx={{ width: 40 }}></StyledTableCell>
      <StyledTableCell sx={{ width: 40 }}>
        {strings.project.correct}
      </StyledTableCell>
      <StyledTableCell>{strings.project.choice}</StyledTableCell>
      <StyledTableCell sx={{ width: 50 }}></StyledTableCell>
    </TableRow>
  );
};
