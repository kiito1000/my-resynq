import { styled, TableCell, TableRow, Theme } from "@mui/material";
import React, { FC, useCallback } from "react";

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

export type SlidePageTableItem = {
  page: number;
  title: string;
};

export type SlidePageTableRowProps = {
  item: SlidePageTableItem;
  variant: "default" | "active" | "done";
  onClick: (page: number) => void;
};

export const SlidePageTableRow: FC<SlidePageTableRowProps> = ({
  item,
  variant,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(item.page);
  }, [item.page, onClick]);

  const backgroundColor = (theme: Theme) => {
    switch (variant) {
      case "default":
        return theme.palette.background.default;
      case "active":
        return theme.palette.primary.light;
      case "done":
        return theme.palette.action.disabledBackground;
    }
  };

  return (
    <StyledTableRow
      hover={variant !== "done"}
      onClick={handleClick}
      sx={[{ backgroundColor }, variant !== "done" && { cursor: "pointer" }]}
    >
      <StyledTableCell sx={{ width: 50, textAlign: "right" }}>
        {item.page}
      </StyledTableCell>
      <StyledTableCell
        sx={{ fontWeight: variant === "active" ? "bold" : "normal" }}
      >
        {item.title}
      </StyledTableCell>
    </StyledTableRow>
  );
};
