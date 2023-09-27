import { select } from "@redux/utils/saga";
import { strings } from "@strings";
import { enqueueSnackbar } from "notistack";

export function* getUserId() {
  const userId = yield* select((state) => state.myProfile.user?.uid);

  if (userId == null) {
    enqueueSnackbar({
      key: "auth_error",
      variant: "error",
      message: strings.errors.authError,
    });
    return undefined;
  }
  return userId;
}
