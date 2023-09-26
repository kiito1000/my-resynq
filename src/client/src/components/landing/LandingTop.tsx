import { CssBaseline, ThemeProvider } from "@mui/material";
import { themes } from "@styles/theme";
import { FC } from "react";

const LandingMock: FC = () => {
  // Created by https://github.com/isIxd
  return <>ランディングページ</>;
};

export const LandingTop: FC = () => {
  return (
    <ThemeProvider theme={themes.landing}>
      <CssBaseline />
      <LandingMock />
    </ThemeProvider>
  );
};

export default LandingTop;
