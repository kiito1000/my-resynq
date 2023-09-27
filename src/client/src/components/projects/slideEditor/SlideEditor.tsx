import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { ProgressBar } from "@components/ProgressBar";
import { SubHeader } from "@components/SubHeader";
import {
  AppBar,
  Box,
  ButtonProps,
  Divider,
  ThemeProvider,
} from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { pages } from "@router";
import { strings } from "@strings";
import { themes } from "@styles/theme";
import { FC, useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { QuestionEditor } from "./QuestionEditor";
import { QuestionList } from "./QuestionList";
import { SlideEditorStatusBar } from "./SlideEditorStatusBar";
import { useHoldEvent } from "./hooks/useHoldEvent";
import { QuestionCardScrollContextProvider } from "./contexts/QuestionCardScrollContext";

const SubHeaderRightItem: FC<ButtonProps> = (props) => {
  return (
    <Button {...props} variant="contained" size="medium">
      {strings.project.startEvent}
    </Button>
  );
};

export const SlideEditor: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.slideEditor.project);
  const holdEvent = useHoldEvent(project);

  useEffect(() => {
    if (projectId == null) return;

    dispatch(({ slideEditor }) =>
      slideEditor.setProjectListener({ projectId })
    );
    return () => {
      dispatch(({ slideEditor }) => slideEditor.clearProjectListener());
    };
  }, [dispatch, projectId]);

  if (projectId == null) {
    return <Navigate to={pages.notFound()} />;
  }

  if (project == null) {
    return null;
  }

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
    <ThemeProvider theme={themes.project}>
      <QuestionCardScrollContextProvider scrollOffset={contentMarginTop}>
        <AppBar>
          <Header sx={{ height: headerHeight.main }} />
          <ProgressBar />
          <SubHeader
            title={project.name}
            rightItem={
              <SubHeaderRightItem
                disabled={project == null || project.holdDate != null}
                onClick={holdEvent}
              />
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
              }}
            >
              <QuestionList project={project} sx={{ height: 1.0 }} />
            </Box>
            <Box
              sx={{
                width: 0.7,
                background: (theme) => theme.palette.background.default,
              }}
            >
              <QuestionEditor
                questions={project.slide.questions}
                sx={{
                  "&::before": {
                    content: '""',
                    minHeight: `${spaceY}px`,
                  },
                  mx: 2,
                  pb: 2,
                }}
              />
              <SlideEditorStatusBar />
            </Box>
          </Box>
        </Box>
      </QuestionCardScrollContextProvider>
    </ThemeProvider>
  );
};

export default SlideEditor;
