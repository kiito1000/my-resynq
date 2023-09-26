import { CssBaseline, ThemeProvider } from "@mui/material";
import { themes } from "@styles/theme";
import { FC } from "react";

const RegisterMock: FC = () => {
  // Created by https://github.com/isIxd
  return <>回答者登録画面</>;
};

const JoinTop: FC = () => {
  return (
    <ThemeProvider theme={themes.answerer}>
      <CssBaseline />
      <RegisterMock />
    </ThemeProvider>
  );
};

export default JoinTop;
