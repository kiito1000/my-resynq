import { Header } from "@components/Header";
import { ProgressBar } from "@components/ProgressBar";
import { SubHeader } from "@components/SubHeader";
import { AppBar, Box, Divider, ThemeProvider, Typography } from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { themes } from "@styles/theme";
import { FC, useEffect } from "react";
import { PresentationController } from "./PresentationController/PresentationController";
import { SlidePageViewer } from "./SlidePageViewer/SlidePageViewer";
import { SlidePageScrollContextProvider } from "./SlidePageViewer/contexts/SlidePageScrollContext";
import { SlidePreview } from "./SlidePreview/SlidePreview";
import { SlideSideBar } from "./SlideSideBar/SlideSideBar";

export type PresenterTopProps = {
  presentationId: string;
};

export const PresenterTop: FC<PresenterTopProps> = ({ presentationId }) => {
  const dispatch = useAppDispatch();
  const title =
    useAppSelector((state) => state.presenter.presentation?.name) ?? "";
  const hashtag = useAppSelector(
    (state) => state.presenter.presentation?.hashtag
  );

  useEffect(() => {
    dispatch(({ presenter }) => presenter.setListener({ presentationId }));
    return () => {
      dispatch(({ presenter }) => presenter.clearListener());
    };
  }, [dispatch, presentationId]);

  const contentMarginTop = 32;
  const spaceY = 8 * 4; //32
  const headerHeight = {
    main: 48,
    sub: 48,
  } as const;
  const contentTop = `${headerHeight.main + headerHeight.sub + spaceY}px`;
  const contentHeight = `calc(100vh - ${
    headerHeight.main + headerHeight.sub + spaceY * 2
  }px)`;

  return (
    <ThemeProvider theme={themes.presenter}>
      <SlidePageScrollContextProvider scrollOffset={contentMarginTop}>
        <AppBar>
          <Header sx={{ height: headerHeight.main }} />
          <ProgressBar />
          <SubHeader
            title={title}
            rightItem={
              hashtag && (
                <Typography
                  variant="subtitle1"
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  {hashtag}
                </Typography>
              )
            }
            sx={{ height: headerHeight.sub }}
          />
          <Divider />
        </AppBar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            px: 10,
            width: 1,
            height: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: 1,
              height: 1,
              maxWidth: 1440,
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: contentTop,
                width: 0.3,
                height: contentHeight,
                mx: 2,
                display: "grid",
                gridTemplateRows: "6fr 4fr",
                gap: 2,
              }}
            >
              <SlideSideBar />
              <SlidePreview />
            </Box>
            <Box
              sx={{
                width: 0.7,
                background: (theme) => theme.palette.background.default,
              }}
            >
              <SlidePageViewer
                sx={{
                  "&::before": {
                    content: '""',
                    minHeight: `${spaceY}px`,
                  },
                  mx: 2,
                }}
              />
              <Box
                sx={{
                  position: "sticky",
                  bottom: 0,
                  pb: `${spaceY}px`,
                  px: 2,
                  background: (theme) => theme.palette.background.default,
                }}
              >
                <PresentationController
                  sx={{
                    height: 64,
                    background: (theme) => theme.palette.background.paper,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </SlidePageScrollContextProvider>
    </ThemeProvider>
  );
};

export default PresenterTop;
