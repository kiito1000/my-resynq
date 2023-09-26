import dayjs from "dayjs";
import "dayjs/locale/ja";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import "./firebase/appCheck";

import { ProgressBar } from "@components/ProgressBar";
import { setAutoFreeze } from "immer";
import { FC, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

// do not freeze objects produced by immer
// ignore the problem: https://github.com/react-hook-form/react-hook-form/discussions/3715
setAutoFreeze(false);

// enable plugin "relativeTime"
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale("ja");

export const App: FC = () => (
  <Suspense fallback={<ProgressBar />}>
    <RouterProvider router={router} />
  </Suspense>
);
