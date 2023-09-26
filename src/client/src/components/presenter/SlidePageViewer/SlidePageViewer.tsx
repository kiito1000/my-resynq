import { SlidePage } from "@/firebase/db";
import { Box, styled } from "@mui/material";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { pages } from "@router";
import { FC, memo, ReactNode, useContext, useEffect, useRef } from "react";
import { InViewHookResponse } from "react-intersection-observer";
import { SlidePageScrollContext } from "./contexts/SlidePageScrollContext";
import { SlideEndPageItem } from "./SlideEndPageItem";
import {
  SlidePageViewerObserver,
  SlidePageViewerObserverProps,
} from "./SlidePageViewerObserver";
import { SlideQuestionPageItem } from "./SlideQuestionPageItem";
import { SlideRankPageItem } from "./SlideRankPageItem";
import { SlideStartPageItem } from "./SlideStartPageItem";

const SlideStartPageItemContent: FC<{
  page: Extract<SlidePage, { type: "start" }>;
}> = ({ page }) => {
  const presentation = useAppSelector((state) => state.presenter.presentation);

  if (presentation == null) {
    return null;
  }

  return (
    <SlideStartPageItem
      page={page}
      answererUrl={`${location.origin}${pages.presentation(presentation.id)}`}
      slideUrl={`${location.origin}${pages.slideViewer(presentation.id)}`}
    />
  );
};

const SlideQuestionPageItemContent: FC<{
  page: Extract<SlidePage, { type: "question" }>;
}> = ({ page }) => {
  const answers = useAppSelector((state) => state.presenter.answers);
  const participants = useAppSelector((state) => state.presenter.participants);

  return (
    <SlideQuestionPageItem
      page={page}
      answers={answers[page.question.id]?.choices ?? {}}
      participants={participants}
    />
  );
};

type SlidePageViewerContentProps = {
  page: SlidePage;
};

const SlidePageViewerContent: FC<SlidePageViewerContentProps> = ({ page }) => {
  switch (page.type) {
    case "start":
      return <SlideStartPageItemContent page={page} />;
    case "question":
      return <SlideQuestionPageItemContent page={page} />;
    case "rank":
      return <SlideRankPageItem page={page} />;
    case "end":
      return <SlideEndPageItem page={page} />;
  }
};

const MemorizedSlidePageViewerContent = memo(SlidePageViewerContent);

type SlidePageItemContainerProps = {
  children: ReactNode;
  page: SlidePage;
  className?: string;
  navigatorRef: InViewHookResponse["ref"];
};

const SlidePageItemContainer: FC<SlidePageItemContainerProps> = ({
  children,
  page,
  className,
  navigatorRef,
}) => {
  const activePage = useAppSelector((state) => state.presenter.activePage);
  const { createPageId } = useContext(SlidePageScrollContext);
  const ref = useRef<HTMLDivElement | null>(null);

  const isActive = activePage === page.index;

  useEffect(() => {
    if (isActive) {
      navigatorRef(ref.current);
    }
  }, [isActive, navigatorRef]);

  return (
    <Box id={createPageId?.(page.index)} className={className} ref={ref}>
      {children}
    </Box>
  );
};

const StyledSlidePageItemContainer = styled(SlidePageItemContainer)(
  ({ theme }) => ({
    paddingBottom: theme.spacing(2),
  })
);

export type SlidePageViewerProps = Omit<
  SlidePageViewerObserverProps,
  "children"
>;

const SlidePageViewer: FC<SlidePageViewerProps> = (props) => {
  const pages = useAppSelector((state) => state.presenter.pages);

  return (
    <SlidePageViewerObserver
      {...props}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {(navigatorRef) =>
        pages.map((page, i) => (
          <StyledSlidePageItemContainer
            key={i}
            page={page}
            navigatorRef={navigatorRef}
          >
            <MemorizedSlidePageViewerContent page={page} />
          </StyledSlidePageItemContainer>
        ))
      }
    </SlidePageViewerObserver>
  );
};

const MemorizedSlidePageViewer = memo(SlidePageViewer);

export { MemorizedSlidePageViewer as SlidePageViewer };
