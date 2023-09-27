import { ThemeProvider } from "@mui/material/styles";
import { themes } from "@styles/theme";
import { FC } from "react";

const SlideMock: FC = () => {
  // Created by https://github.com/isIxd
  return <>スライド画面</>;
};

export const SlideTop: FC = () => {
  return (
    <ThemeProvider theme={themes.slide.default}>
      <SlideMock />
    </ThemeProvider>
  );
};

export default SlideTop;
