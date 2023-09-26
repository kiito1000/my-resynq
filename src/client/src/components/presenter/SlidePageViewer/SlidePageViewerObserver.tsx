import {
  mdiArrowDownBoldCircleOutline,
  mdiArrowUpBoldCircleOutline,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { Box, BoxProps, Chip, useTheme } from "@mui/material";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { strings } from "@strings";
import { FC, ReactNode, memo, useCallback, useContext, useRef } from "react";
import { InViewHookResponse, useInView } from "react-intersection-observer";
import { SlidePageScrollContext } from "./contexts/SlidePageScrollContext";
import { useSlidePageNavigatorChips } from "./hooks/useSlidePageNavigatorChips";

type BackToCurrentPageChipProps = {
  scrollTo: "up" | "down";
  onClick?: () => void;
};

const BackToCurrentPageChip: FC<BackToCurrentPageChipProps> = ({
  scrollTo: position,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Chip
      sx={{
        boxShadow: 3,
        px: 1,
        backgroundColor: (theme) => theme.palette.background.default,
        fontSize: 16,
        "&.MuiChip-root:hover": {
          backgroundColor: "#dddddd",
        },
      }}
      icon={
        <Icon
          path={
            position === "up"
              ? mdiArrowUpBoldCircleOutline
              : mdiArrowDownBoldCircleOutline
          }
          color={theme.palette.text.primary}
          size="20px"
        />
      }
      label={strings.presenter.backToCurrentPage}
      onClick={onClick}
    />
  );
};

const MemorizedBackToCurrentPageChip = memo(BackToCurrentPageChip);

type ContentProps = {
  children: ReactNode;
  backToCurrentPage: () => void;
  opacity: {
    top: number;
    bottom: number;
  };
};

const Content: FC<ContentProps> = ({
  children,
  backToCurrentPage,
  opacity,
}) => {
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 8,
          display: "flex",
          justifyContent: "center",
          height: 0,
          visibility: opacity.top > 0 ? "visible" : "hidden",
          opacity: opacity.top,
        }}
      >
        <MemorizedBackToCurrentPageChip
          scrollTo="up"
          onClick={backToCurrentPage}
        />
      </Box>
      {children}
      <Box
        sx={{
          position: "sticky",
          bottom: 40,
          display: "flex",
          justifyContent: "center",
          height: 0,
          visibility: opacity.bottom > 0 ? "visible" : "hidden",
          opacity: opacity.bottom,
        }}
      >
        <MemorizedBackToCurrentPageChip
          scrollTo="down"
          onClick={backToCurrentPage}
        />
      </Box>
    </>
  );
};

const threshold = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

export type SlidePageViewerObserverProps = Omit<BoxProps, "children"> & {
  children: (ref: InViewHookResponse["ref"]) => ReactNode;
};

export const SlidePageViewerObserver: FC<SlidePageViewerObserverProps> = ({
  children,
  ...props
}) => {
  const activePage = useAppSelector((state) => state.presenter.activePage);
  const { scrollTo } = useContext(SlidePageScrollContext);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const { ref, entry } = useInView({ root: rootRef.current, threshold });
  const { opacity } = useSlidePageNavigatorChips(rootRef.current, entry);
  const backToCurrentPage = useCallback(() => {
    if (activePage != null) {
      scrollTo?.(activePage);
    }
  }, [activePage, scrollTo]);

  return (
    <Box {...props} ref={rootRef}>
      <Content backToCurrentPage={backToCurrentPage} opacity={opacity}>
        {children(ref)}
      </Content>
    </Box>
  );
};
