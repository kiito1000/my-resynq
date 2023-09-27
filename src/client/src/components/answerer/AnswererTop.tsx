import { CssBaseline, ThemeProvider } from "@mui/material";
import { themes } from "@styles/theme";
import { FC } from "react";

const AnswererMock: FC = () => {
  // Created by https://github.com/isIxd
  return <>回答者画面</>;
};

export const AnswererTop: FC = () => {
  return (
    <ThemeProvider theme={themes.answerer}>
      <CssBaseline />
      <AnswererMock />
    </ThemeProvider>
  );
};

export default AnswererTop;
