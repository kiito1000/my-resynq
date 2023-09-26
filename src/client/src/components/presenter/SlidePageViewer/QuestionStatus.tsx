import {
  LocalStatusAccept,
  LocalStatusCalculate,
  LocalStatusCheck,
} from "@/firebase/db";
import { useStopWatch } from "@/hooks/useStopWatch";
import { mdiAccountMultipleCheck } from "@mdi/js";
import { Icon } from "@mdi/react";
import TimerIcon from "@mui/icons-material/Timer";
import { Box, Chip, Stack, styled, Typography, useTheme } from "@mui/material";
import { strings } from "@strings";
import { transientOptions } from "@utils/emotion";
import dayjs, { Dayjs } from "dayjs";
import React, { FC } from "react";
import { useMemo } from "react";

type TimerProps = {
  startDate?: Dayjs;
};

const StopWatch: FC<TimerProps> = ({ startDate }) => {
  const duration = useMemo(() => dayjs.duration({ seconds: 1 }), []);
  const time = useStopWatch(duration, startDate);
  return <>{Math.floor(time.asSeconds())}</>;
};

const StyledChip = styled(
  Chip,
  transientOptions
)<{ $isActive: boolean }>(({ theme, $isActive }) => ({
  border: 1,
  borderStyle: "solid",
  borderRadius: 0,
  borderColor: theme.palette.border.main,
  fontSize: 16,
  fontWeight: $isActive
    ? theme.typography.fontWeightMedium
    : theme.typography.fontWeightRegular,
  padding: `${theme.spacing(1)} ${theme.spacing(0.25)}`,
  backgroundColor: $isActive
    ? theme.palette.primary.light
    : theme.palette.background.default,
}));

export type QuestionStatusProps = {
  status?: LocalStatusAccept | LocalStatusCalculate | LocalStatusCheck;
  answeredUsers: number;
  joinedUsers: number;
};

export const QuestionStatus: FC<QuestionStatusProps> = ({
  status,
  answeredUsers,
  joinedUsers,
}) => {
  const theme = useTheme();

  return (
    <Stack direction="column" spacing={3} alignItems="end">
      <Stack direction="row">
        <StyledChip
          $isActive={status?.type === "accept"}
          label={strings.presenter.status.accept}
          sx={{
            borderTopLeftRadius: (theme) => theme.shape.borderRadius,
            borderBottomLeftRadius: (theme) => theme.shape.borderRadius,
          }}
        />
        <StyledChip
          $isActive={status?.type === "calculate"}
          label={strings.presenter.status.calculate}
        />
        <StyledChip
          $isActive={status?.type === "check"}
          label={strings.presenter.status.check}
          sx={{
            borderTopRightRadius: (theme) => theme.shape.borderRadius,
            borderBottomRightRadius: (theme) => theme.shape.borderRadius,
          }}
        />
      </Stack>
      <Box
        display="grid"
        gridTemplateColumns="30px 1fr"
        alignItems="center"
        rowGap={1}
      >
        <Icon
          path={mdiAccountMultipleCheck}
          color={theme.palette.text.secondary}
          size={"22px"}
        />
        <Box textAlign="right">
          <Typography component="span" fontSize={16}>
            {answeredUsers}
          </Typography>
          <Typography component="span" fontSize={14} sx={{ alignSelf: "end" }}>
            {`/${joinedUsers}${strings.units.user}`}
          </Typography>
        </Box>
        {status?.startDate != null && (
          <>
            <TimerIcon
              sx={{ fontSize: 22, color: theme.palette.text.secondary }}
            />
            <Box textAlign="right">
              <Typography component="span" fontSize={16}>
                <StopWatch startDate={status?.startDate} />
              </Typography>
              <Typography
                component="span"
                fontSize={14}
                sx={{ alignSelf: "end" }}
              >
                {strings.units.seconds}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Stack>
  );
};
