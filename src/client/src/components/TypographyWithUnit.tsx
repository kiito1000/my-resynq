import { Box, Typography } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createTypography";
import React, { FC } from "react";

type TypographyWithUnitProps = {
  typography: string | number;
  unit: string | number;
  typographyFontSize?: CSSProperties["fontSize"];
  unitFontSize?: CSSProperties["fontSize"];
};

export const TypographyWithUnit: FC<TypographyWithUnitProps> = ({
  typography,
  unit,
  typographyFontSize = 16,
  unitFontSize = 12,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "baseline",
      }}
    >
      <Typography sx={{ fontSize: typographyFontSize }}>
        {typography}
      </Typography>
      <Typography sx={{ fontSize: unitFontSize }}>{unit}</Typography>
    </Box>
  );
};
