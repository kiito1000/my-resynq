import { LocalProject } from "@/firebase/db";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { pages } from "@router";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export const useHoldEvent = (project: LocalProject | undefined) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return useCallback(() => {
    if (project == null) {
      return;
    }
    if (project.presentationId != null) {
      navigate(pages.presentation(project.presentationId));
    } else if (project.holdDate == null) {
      dispatch(({ presentation }) => presentation.createPresentation(project));
    }
  }, [dispatch, navigate, project]);
};
