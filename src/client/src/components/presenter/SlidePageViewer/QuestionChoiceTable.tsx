import { Choice } from "@/firebase/db";
import CheckIcon from "@mui/icons-material/Check";
import {
  Avatar,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { strings } from "@strings";
import { themes } from "@styles/theme";
import React, { FC } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: 18,
}));

export type QuestionChoiceTableItem = Choice & {
  selectedRate?: number;
  selectedCount?: number;
};

type QuestionChoiceTableRowProps = {
  item: QuestionChoiceTableItem;
  index: number;
};

const QuestionChoiceTableRow: FC<QuestionChoiceTableRowProps> = ({
  item,
  index,
}) => {
  return (
    <TableRow>
      <StyledTableCell sx={{ width: 40 }}>
        <Avatar
          sx={{
            width: 25,
            height: 25,
            // TODO: イベントに設定されたThemeを使用する
            backgroundColor: themes.slide.default.palette.choices[index]?.main,
          }}
        >
          {item.isCorrect && <CheckIcon />}
        </Avatar>
      </StyledTableCell>
      <StyledTableCell>{item.label}</StyledTableCell>
      <StyledTableCell sx={{ width: 60, textAlign: "right" }}>
        {item.selectedCount != null && (
          <>
            {item.selectedCount}
            <Typography component="span" fontSize={14}>
              {strings.units.vote}
            </Typography>
          </>
        )}
      </StyledTableCell>
      <StyledTableCell sx={{ width: 40, textAlign: "right" }}>
        {item.selectedRate != null && (
          <>
            {Math.round(item.selectedRate * 100)}
            <Typography component="span" fontSize={14}>
              %
            </Typography>
          </>
        )}
      </StyledTableCell>
    </TableRow>
  );
};

export type QuestionChoiceTableProps = {
  items: QuestionChoiceTableItem[];
};

export const QuestionChoiceTable: FC<QuestionChoiceTableProps> = ({
  items,
}) => {
  return (
    <Table>
      <TableBody>
        {items.map((item, i) => (
          <QuestionChoiceTableRow key={item.id} index={i} item={item} />
        ))}
      </TableBody>
    </Table>
  );
};
