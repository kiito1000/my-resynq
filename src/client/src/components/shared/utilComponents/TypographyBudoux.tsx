import { FC } from "react";
import { loadDefaultJapaneseParser } from "budoux";
import { Typography, TypographyProps } from "@mui/material";
const parser = loadDefaultJapaneseParser();

type TypographyBudouxProps = {
  string?: string;
} & TypographyProps;

export const TypographyBudoux: FC<TypographyBudouxProps> = ({
  string,
  sx,
  children,
  ...props
}) => {
  const lettersList =
    string != null
      ? parser.parse(string)
      : typeof children === "string"
      ? parser.parse(children)
      : [];
  return (
    <Typography
      sx={{ wordBreak: "keep-all", overflowWrap: "anywhere", ...sx }}
      {...props}
    >
      {lettersList.map((letters) => (
        <>
          {letters}
          <wbr />
        </>
      ))}
    </Typography>
  );
};
