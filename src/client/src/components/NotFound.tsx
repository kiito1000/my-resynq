import { AppBar, Box, Divider, styled, Typography } from "@mui/material";
import { strings } from "@strings";
import { FC } from "react";
import { Button } from "./Button";
import { Header } from "./Header";
import { pages } from "@router";

const StyledHeader = styled(Header)({
  height: 48,
});

export const NotFound: FC = () => {
  return (
    <Box>
      <AppBar>
        <StyledHeader />
        <Divider />
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h2" sx={{ mt: 11, mb: 3 }}>
          {strings.notFound.title}
        </Typography>
        <Typography variant="body1">{strings.notFound.message}</Typography>
        <Box sx={{ mt: 8 }}>
          <Button variant="contained" href={pages.lp()}>
            {strings.notFound.backToTop}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
