import { UserRecord } from "@/firebase/db";
import {
  Avatar,
  Box,
  Pagination,
  PaginationProps,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { strings } from "@strings";
import React, { FC, useCallback, useState } from "react";

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: 16,
}));

const RankingTableHeader = () => {
  return (
    <TableRow sx={{ whiteSpace: "nowrap" }}>
      <StyledTableHeaderCell sx={{ width: 50, textAlign: "right" }}>
        {strings.common.order}
      </StyledTableHeaderCell>
      <StyledTableHeaderCell sx={{ width: 57 }} />
      <StyledTableHeaderCell>{strings.user.name}</StyledTableHeaderCell>
      <StyledTableHeaderCell sx={{ textAlign: "right" }}>
        {strings.common.points}
      </StyledTableHeaderCell>
    </TableRow>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: 18,
}));

type RankingTableItem = UserRecord;

type RankingTableRowProps = {
  item: RankingTableItem;
};

const RankingTableRow: FC<RankingTableRowProps> = ({ item }) => {
  return (
    <TableRow>
      <StyledTableCell sx={{ textAlign: "right" }}>
        {item.rank}
        <Typography component="span" fontSize={14}>
          {strings.common.rank}
        </Typography>
      </StyledTableCell>
      <StyledTableCell>
        <Avatar alt={item.displayName} src={item.iconUrl} />
      </StyledTableCell>
      <StyledTableCell>{item.displayName}</StyledTableCell>
      <StyledTableCell sx={{ textAlign: "right" }}>
        {item.points}
        <Typography component="span" fontSize={14}>
          pt
        </Typography>
      </StyledTableCell>
    </TableRow>
  );
};

export type RankingTableProps = {
  records: UserRecord[];
  rowsPerPage: number;
};

export const RankingTable: FC<RankingTableProps> = ({
  records,
  rowsPerPage,
}) => {
  const [page, setPage] = useState<number>(1);
  const maxPage = Math.ceil(records.length / rowsPerPage);

  const handleChangePage: NonNullable<PaginationProps["onChange"]> =
    useCallback((_, page: number) => {
      setPage(page);
    }, []);

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <RankingTableHeader />
          </TableHead>
          <TableBody>
            {records
              .slice(
                (page - 1) * rowsPerPage,
                (page - 1) * rowsPerPage + rowsPerPage
              )
              .map((item) => (
                <RankingTableRow key={item.userId} item={item} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {maxPage > 1 && (
        <Stack alignItems="center" sx={{ my: 2 }}>
          <Pagination
            page={page}
            count={maxPage}
            color="primary"
            onChange={handleChangePage}
          />
        </Stack>
      )}
    </Box>
  );
};
