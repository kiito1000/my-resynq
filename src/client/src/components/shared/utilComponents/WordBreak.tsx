import { FC } from "react";
import { Span } from "../styledHtmlComponents";

type WordBreakProps = {
  words: readonly string[];
};

export const WordBreak: FC<WordBreakProps> = ({ words }) => (
  <>
    {words.map((letters, idx) => {
      if (letters === " ") return " ";
      else
        return (
          <Span sx={{ whiteSpace: "nowrap" }} key={idx}>
            {letters}
          </Span>
        );
    })}
  </>
);
