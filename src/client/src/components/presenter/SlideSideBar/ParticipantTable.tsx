import { Table, TableBody, TableContainer } from "@mui/material";
import React, { FC } from "react";
import {
  ParticipantTableItem,
  ParticipantTableRow,
} from "./ParticipantTableRow";

export type ParticipantTableProps = {
  items: ParticipantTableItem[];
};

export const ParticipantTable: FC<ParticipantTableProps> = ({ items }) => {
  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table>
        <TableBody>
          {items.map((item) => (
            <ParticipantTableRow key={item.index} item={item} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
