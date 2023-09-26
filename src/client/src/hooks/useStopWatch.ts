import dayjs, { Dayjs } from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import { useEffect, useState } from "react";

export const useStopWatch = (
  interval: Duration,
  startDate?: Dayjs,
  endDate?: Dayjs
): Duration => {
  const [date, setDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    if (startDate == null || endDate != null) return;

    setDate(dayjs());

    const id = setInterval(() => {
      setDate(dayjs());
    }, interval.asMilliseconds());

    return () => {
      clearInterval(id);
    };
  }, [endDate, interval, startDate]);

  if (startDate == null) {
    return dayjs.duration(0);
  }
  if (startDate != null && endDate != null) {
    return dayjs.duration(endDate.diff(startDate));
  }

  const duration = dayjs.duration(date.diff(startDate));
  return duration;
};
