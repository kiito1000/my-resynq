import { ProgressBar } from "@components/ProgressBar";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { pages } from "@router";
import { FC, lazy, useEffect } from "react";
import { Navigate, useParams } from "react-router";

const AnswererTop = lazy(() => import("@components/answerer/AnswererTop"));
const PresenterTop = lazy(() => import("@components/presenter/PresenterTop"));

type Mode = "automatic" | "answerer" | "presenter";

export const PresentationTop: FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();

  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.presentation.role);

  const mode: Mode = role ?? "automatic";

  useEffect(() => {
    if (presentationId != null && mode === "automatic") {
      dispatch(({ presentation }) => presentation.getRole({ presentationId }));
    }
  }, [dispatch, mode, presentationId]);

  if (presentationId == null) {
    return <Navigate to={pages.notFound()} />;
  }

  switch (mode) {
    case "automatic": {
      return <ProgressBar />;
    }
    case "answerer": {
      return <AnswererTop />;
    }
    case "presenter": {
      return <PresenterTop presentationId={presentationId} />;
    }
  }
};
