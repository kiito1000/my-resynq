import { GlobalStyles } from "@mui/material";
import { FC } from "react";

export const GlobalStyle: FC = () => {
  return (
    <GlobalStyles
      styles={{
        ".firebase-emulator-warning": {
          display: "none",
        },
      }}
    />
  );
};
