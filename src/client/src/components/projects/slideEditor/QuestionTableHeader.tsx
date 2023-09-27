import { TableCell, TableRow, TableRowProps, styled } from "@mui/material";
import { strings } from "@strings";
import React, { FC } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export type QuestionTableHeaderProps = TableRowProps;

export const QuestionTableHeader: FC<QuestionTableHeaderProps> = (props) => {
  return (
    <TableRow {...props}>
      <StyledTableCell sx={{ width: 45 }}></StyledTableCell>
      <StyledTableCell sx={{ width: 50 }}>
        {strings.project.order}
      </StyledTableCell>
      <StyledTableCell>{strings.project.question}</StyledTableCell>
      <StyledTableCell sx={{ width: 80 }}>
        {strings.project.choiceCount}
      </StyledTableCell>
      <StyledTableCell sx={{ width: 50 }}></StyledTableCell>
    </TableRow>
  );
};
