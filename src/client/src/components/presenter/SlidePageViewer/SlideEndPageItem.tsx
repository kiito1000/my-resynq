import { SlidePage } from "@/firebase/db";
import { strings } from "@strings";
import React, { FC } from "react";
import { SlidePageItemTemplate } from "./SlidePageItemTemplate";

export type SlideEndPageItemProps = {
  page: Extract<SlidePage, { type: "end" }>;
};

export const SlideEndPageItem: FC<SlideEndPageItemProps> = ({ page }) => {
  return (
    <SlidePageItemTemplate title={strings.presenter.status.end} page={page} />
  );
};
