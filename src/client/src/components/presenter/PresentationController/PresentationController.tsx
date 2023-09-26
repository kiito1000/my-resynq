import { LocalPresentation } from "@/firebase/db";
import { useStopWatch } from "@/hooks/useStopWatch";
import { Button } from "@components/Button";
import {
  mdiAccountMultiple,
  mdiArrowRightBold,
  mdiArrowULeftBottomBold,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import TimerIcon from "@mui/icons-material/Timer";
import {
  Box,
  Card,
  CardProps,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { useAppSelector } from "@redux/hooks/useAppSelector";
import { strings } from "@strings";
import dayjs, { Dayjs } from "dayjs";
import { FC, memo, useCallback, useMemo, useState } from "react";
import { CancelPresentationConfirmDialog } from "./CancelPresentationConfirmDialog";
import { CloseEventConfirmDialog } from "./CloseEventConfirmDialog";
import { PresentationActionButton } from "./PresentationActionButton";

type StopWatchProps = {
  startDate?: Dayjs;
  endDate?: Dayjs;
};

const StopWatch: FC<StopWatchProps> = ({ startDate, endDate }) => {
  const duration = useMemo(() => dayjs.duration({ seconds: 1 }), []);
  const time = useStopWatch(duration, startDate, endDate);
  return (
    <>
      {
        time.asHours() >= 0
          ? `${Math.floor(time.asHours())}:${time.format("mm:ss")}` // e.g. 2:03:21, 26:40:00
          : time.format("m:ss") // e.g. 0:12, 4:20,
      }
    </>
  );
};

const PresentationStatusViewer = () => {
  const theme = useTheme();
  const startDate = useAppSelector(
    (state) => state.presenter.presentation?.startDate
  );
  const endDate = useAppSelector(
    (state) => state.presenter.presentation?.endDate
  );
  const participants = useAppSelector((state) => state.presenter.participants);

  return (
    <Stack direction="row" gap={2}>
      <Stack direction="row" alignItems="center" gap={1}>
        <TimerIcon sx={{ fontSize: 22, color: theme.palette.text.secondary }} />
        <Typography component="span" fontSize={18}>
          <StopWatch startDate={startDate} endDate={endDate} />
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1}>
        <Icon
          path={mdiAccountMultiple}
          color={theme.palette.text.secondary}
          size={"20px"}
        />
        <Typography component="span" fontSize={18}>
          {participants.length}
          <Typography component="span" fontSize={14}>
            {strings.units.user}
          </Typography>
        </Typography>
      </Stack>
    </Stack>
  );
};

type PresentationControllerButtonsProps = {
  presentation: LocalPresentation;
};

const PresentationControllerButtons: FC<PresentationControllerButtonsProps> = ({
  presentation,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [dialog, setDialog] = useState<{ open: boolean }>({ open: false });
  const activePage = useAppSelector((state) => state.presenter.activePage);
  const pages = useAppSelector((state) => state.presenter.pages);

  const handleCloseDialog = useCallback(() => {
    setDialog({ open: false });
  }, []);

  const holdEvent = useCallback(() => {
    dispatch(({ presentation: presentationAction }) =>
      presentationAction.startPresentation({ presentationId: presentation.id })
    );
  }, [dispatch, presentation.id]);
  const backToPreviousPage = useCallback(() => {
    dispatch(({ presentation: presentationAction }) =>
      presentationAction.setPreviousStatus({ presentationId: presentation.id })
    );
  }, [dispatch, presentation.id]);
  const goToNextPage = useCallback(() => {
    dispatch(({ presentation: presentationAction }) =>
      presentationAction.setNextStatus({ presentationId: presentation.id })
    );
  }, [dispatch, presentation.id]);

  const handleOpenDialog = useCallback(() => {
    setDialog({ open: true });
  }, []);
  const closeEvent = useCallback(() => {
    handleCloseDialog();
    dispatch(({ presentation: presentationAction }) =>
      presentationAction.closePresentation({ presentationId: presentation.id })
    );
  }, [dispatch, handleCloseDialog, presentation.id]);

  if (presentation.startDate == null) {
    return (
      <Box>
        <Button
          onClick={holdEvent}
          variant="contained"
          startIcon={<PlayCircleFilledWhiteIcon />}
          sx={{ width: 200, height: 40, ml: 4 }}
        >
          {strings.presenter.actions.startQuiz}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        onClick={backToPreviousPage}
        variant="outlined"
        sx={{ width: 60, height: 40, ml: 4 }}
        disabled={
          activePage == null || activePage <= 1 || presentation.endDate != null
        }
      >
        <Icon
          path={mdiArrowULeftBottomBold}
          color={theme.palette.text.secondary}
          size={"20px"}
        />
      </Button>
      {activePage == null || activePage < pages.length ? (
        <Button
          onClick={goToNextPage}
          variant="contained"
          endIcon={
            <Icon
              path={mdiArrowRightBold}
              color={theme.palette.background.default}
              size={"20px"}
            />
          }
          sx={{ width: 170, height: 40, ml: 1 }}
          disabled={activePage == null || activePage >= pages.length}
        >
          {strings.button.next}
        </Button>
      ) : (
        <Button
          onClick={handleOpenDialog}
          variant="contained"
          sx={{ width: 200, height: 40, ml: 1 }}
          disabled={presentation.endDate != null}
        >
          {strings.presenter.actions.endEvent}
        </Button>
      )}
      <CloseEventConfirmDialog
        open={dialog.open}
        onClose={handleCloseDialog}
        onCancel={handleCloseDialog}
        onSubmit={closeEvent}
      />
    </Box>
  );
};

export type PresentationControllerProps = CardProps;

const PresentationController: FC<PresentationControllerProps> = (props) => {
  const dispatch = useAppDispatch();
  const [dialog, setDialog] = useState<{ open: boolean }>({ open: false });
  const presentation = useAppSelector((state) => state.presenter.presentation);

  const handleCloseDialog = useCallback(() => {
    setDialog({ open: false });
  }, []);
  const handleCancelEvent = useMemo(() => {
    if (presentation?.endDate != null) {
      return undefined;
    }
    return () => {
      setDialog({ open: true });
    };
  }, [presentation?.endDate]);

  const doCancelEvent = useCallback(() => {
    handleCloseDialog();
    if (presentation == null) {
      return;
    }

    dispatch(({ presenter }) => presenter.clearListener());
    dispatch(({ presentation: presentationAction }) =>
      presentationAction.cancelPresentation({
        presentationId: presentation.id,
      })
    );
  }, [dispatch, handleCloseDialog, presentation]);

  if (presentation == null) {
    return null;
  }

  return (
    <Card elevation={0} {...props}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 2,
          border: 1,
          borderColor: (theme) => theme.palette.border.main,
          borderRadius: 1,
          height: 1.0,
        }}
      >
        <PresentationActionButton
          presentationId={presentation.id}
          onCancelEvent={handleCancelEvent}
        />
        <CancelPresentationConfirmDialog
          open={dialog.open}
          onClose={handleCloseDialog}
          onSubmit={doCancelEvent}
          onCancel={handleCloseDialog}
        />
        <Stack direction="row" alignItems="center">
          <PresentationStatusViewer />
          <PresentationControllerButtons presentation={presentation} />
        </Stack>
      </Stack>
    </Card>
  );
};

const MemorizedPresentationController = memo(PresentationController);

export { MemorizedPresentationController as PresentationController };
