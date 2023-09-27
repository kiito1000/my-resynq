import { Header } from "@components/Header";
import { ProgressBar } from "@components/ProgressBar";
import { SubHeader, SubHeaderProps } from "@components/SubHeader";
import { AppBar, Divider, styled } from "@mui/material";
import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

const PAGE_WIDTH = 960;

const headerHeight = {
  main: 48,
  sub: 48,
} as const;

const StyledHeader = styled(Header)({
  height: headerHeight.main,
});

const StyledSubHeader = styled(SubHeader)({
  height: headerHeight.sub,
});

export type TopStickyLayoutProps = {
  subHeader: Omit<SubHeaderProps, "className">;
  top?: ReactNode;
  children: ReactNode;
};

export const TopStickyLayout: FC<TopStickyLayoutProps> = ({
  subHeader,
  top,
  children,
}) => {
  return (
    <Box>
      <AppBar>
        <StyledHeader />
        <ProgressBar />
        <StyledSubHeader {...subHeader} />
        <Divider />
      </AppBar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          px: 4,
          width: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: PAGE_WIDTH,
            width: 1,
            pb: 3,
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: `${headerHeight.main + headerHeight.sub}px`,
              zIndex: 1,
            }}
          >
            {top}
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
