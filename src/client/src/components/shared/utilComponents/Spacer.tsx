import { Box } from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { FC } from "react";

type SpacerProps = { space: CSSProperties["paddingTop"] };

export const Spacer: FC<SpacerProps> = ({ space }) => {
  return <Box sx={{ pt: space }} />;
};
