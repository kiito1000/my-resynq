import { StatusBar } from "@components/StatusBar";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import SyncIcon from "@mui/icons-material/Sync";
import { Slide, SlideProps, useTheme } from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { strings } from "@strings";
import React, { FC, useCallback, useMemo } from "react";

const TransitionLeft: FC<SlideProps> = (props) => {
  return <Slide {...props} direction="left" />;
};

const SlideEditorStatusBar: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const status = useAppSelector((state) => state.slideEditor.status);
  const handleClose = useCallback(() => {
    dispatch(({ slideEditor }) => slideEditor.setStatus("none"));
  }, [dispatch]);

  const message = useMemo(() => {
    switch (status) {
      case "none":
        return undefined;
      case "doing":
        return strings.project.saving;
      case "done":
        return strings.project.saved;
    }
  }, [status]);

  const icon = useMemo(() => {
    switch (status) {
      case "none":
        return undefined;
      case "doing":
        return (
          <SyncIcon
            htmlColor={theme.palette.info.light}
            fontSize="inherit"
            sx={{
              animation: "spin 1.5s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(-360deg)" },
              },
            }}
          />
        );
      case "done":
        return (
          <CheckIcon
            htmlColor={theme.palette.success.light}
            fontSize="inherit"
          />
        );
    }
  }, [status, theme.palette.info.light, theme.palette.success.light]);

  return (
    <StatusBar
      message={message}
      icon={icon}
      open={status !== "none"}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      autoHideDuration={status === "done" ? 3000 : undefined}
      onClose={handleClose}
      TransitionComponent={TransitionLeft}
      sx={{
        [theme.breakpoints.up("xs")]: {
          top: 144,
          right: 0,
        },
      }}
    />
  );
};

const MemorizedStatusBar = React.memo(SlideEditorStatusBar);

export { MemorizedStatusBar as SlideEditorStatusBar };
