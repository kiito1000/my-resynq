import { Button } from "@components/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { strings } from "@strings";
import React, { FC } from "react";

export type CancelPresentationConfirmDialogProps = DialogProps & {
  onSubmit?: () => void;
  onCancel?: () => void;
};

export const CancelPresentationConfirmDialog: FC<
  CancelPresentationConfirmDialogProps
> = ({ onSubmit, onCancel, ...props }) => {
  return (
    <Dialog {...props} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontSize: 18 }}>
        {strings.presenter.dialogs.cancelPresentationTitle}
      </DialogTitle>
      <DialogContent>
        {strings.presenter.dialogs.cancelPresentationDetail}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          my: 2,
        }}
      >
        <Button
          size="small"
          variant="text"
          type="submit"
          onClick={onSubmit}
          sx={{
            color: (theme) => theme.palette.warning.main,
          }}
        >
          {strings.button.yes}
        </Button>
        <Button size="small" variant="text" onClick={onCancel}>
          {strings.button.cancel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
