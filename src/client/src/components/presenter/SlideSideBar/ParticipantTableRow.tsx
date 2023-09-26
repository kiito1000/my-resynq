import { Avatar, styled, TableCell, TableRow } from "@mui/material";
import React, { FC } from "react";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
}));

export type ParticipantTableItem = {
  index: number;
  iconUrl: string;
  displayName: string;
};

export type ParticipantTableRowProps = {
  item: ParticipantTableItem;
};

export const ParticipantTableRow: FC<ParticipantTableRowProps> = ({ item }) => {
  return (
    <StyledTableRow>
      <StyledTableCell sx={{ width: 50, textAlign: "right" }}>
        {item.index}
      </StyledTableCell>
      <StyledTableCell sx={{ width: 50 }}>
        <Avatar alt={item.displayName} src={item.iconUrl} />
      </StyledTableCell>
      <StyledTableCell>{item.displayName}</StyledTableCell>
    </StyledTableRow>
  );
};
