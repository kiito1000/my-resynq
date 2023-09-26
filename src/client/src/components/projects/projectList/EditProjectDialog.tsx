import { Button } from "@components/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { strings } from "@strings";
import React, { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditProjectForm, EditProjectFormValue } from "./EditProjectForm";

export type EditProjectDialogProps = Omit<DialogProps, "onSubmit"> & {
  initialValue?: EditProjectFormValue;
  onSubmit: SubmitHandler<EditProjectFormValue>;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
};

export const EditProjectDialog: FC<EditProjectDialogProps> = ({
  initialValue,
  onSubmit,
  onCancel,
  ...props
}) => {
  const { register, control, getValues, setValue, reset, handleSubmit } =
    useForm<EditProjectFormValue>({
      defaultValues: {
        name: "",
        ...initialValue,
      },
    });

  useEffect(() => {
    reset(initialValue);
  }, [initialValue, reset]);

  return (
    <Dialog {...props} maxWidth={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "h4.fontSize",
            fontWeight: "normal",
            p: 3,
          }}
        >
          {strings.project.dialogs.editProject}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <EditProjectForm
            register={register}
            control={control}
            getValues={getValues}
            setValue={setValue}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 4,
            mx: 5,
            my: 2,
          }}
        >
          <Button variant="text" onClick={onCancel}>
            {strings.button.cancel}
          </Button>
          <Button variant="contained" type="submit">
            {strings.button.save}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
