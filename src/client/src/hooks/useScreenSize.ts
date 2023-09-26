import { Theme, useMediaQuery } from "@mui/material";

export const useScreenSize = () => {
  const smAndDown = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const mdAndDown = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  return { smAndDown, mdAndDown };
};
