import { SlidePage } from "@/firebase/db";
import { Box, Typography } from "@mui/material";
import { strings } from "@strings";
import React, { FC } from "react";
import { RankingTable } from "./RankingTable";
import { SlidePageItemTemplate } from "./SlidePageItemTemplate";

export type SlideRankPageItemProps = {
  page: Extract<SlidePage, { type: "rank" }>;
};

export const SlideRankPageItem: FC<SlideRankPageItemProps> = ({ page }) => {
  return (
    <SlidePageItemTemplate title={strings.presenter.status.rank} page={page}>
      {page.ranking.length > 0 ? (
        <Box
          sx={{
            maxWidth: 800,
            mx: "auto",
            my: 3,
          }}
        >
          <RankingTable records={page.ranking} rowsPerPage={10} />
        </Box>
      ) : (
        <Box
          sx={{
            mx: 4,
            my: 3,
          }}
        >
          <Typography> {strings.presenter.rankDescription}</Typography>
        </Box>
      )}
    </SlidePageItemTemplate>
  );
};
