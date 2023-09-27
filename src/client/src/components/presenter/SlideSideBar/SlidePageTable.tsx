import { Table, TableBody, TableContainer } from "@mui/material";
import { FC, useCallback, useContext } from "react";
import { SlidePageScrollContext } from "../SlidePageViewer/contexts/SlidePageScrollContext";
import {
  SlidePageTableItem,
  SlidePageTableRow,
  SlidePageTableRowProps,
} from "./SlidePageTableRow";

export type SlidePageTableProps = {
  items: SlidePageTableItem[];
  activePage: number;
};

export const SlidePageTable: FC<SlidePageTableProps> = ({
  items,
  activePage,
}) => {
  const { scrollTo } = useContext(SlidePageScrollContext);
  const handleClick: SlidePageTableRowProps["onClick"] = useCallback(
    (page) => {
      scrollTo?.(page);
    },
    [scrollTo]
  );

  const variant = (
    item: SlidePageTableItem
  ): SlidePageTableRowProps["variant"] => {
    if (item.page < activePage) {
      return "done";
    } else if (item.page === activePage) {
      return "active";
    } else {
      return "default";
    }
  };

  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table>
        <TableBody>
          {items.map((item) => (
            <SlidePageTableRow
              key={item.page}
              item={item}
              variant={variant(item)}
              onClick={handleClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
