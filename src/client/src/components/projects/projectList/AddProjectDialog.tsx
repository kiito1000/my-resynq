import { Button } from "@components/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { strings } from "@strings";
import React, { FC, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditProjectForm, EditProjectFormValue } from "./EditProjectForm";

export type AddProjectDialogProps = Omit<DialogProps, "onSubmit"> & {
  onSubmit: SubmitHandler<EditProjectFormValue>;
};

export const AddProjectDialog: FC<AddProjectDialogProps> = ({
  onSubmit,
  ...props
}) => {
  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit: handleSubmitForm,
    reset,
  } = useForm<EditProjectFormValue>({
    defaultValues: {
      name: "",
    },
  });
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      handleSubmitForm(onSubmit)(e);
      reset();
    },
    [handleSubmitForm, onSubmit, reset]
  );

  return (
    <Dialog {...props} maxWidth={false}>
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "h4.fontSize",
            fontWeight: "normal",
            p: 3,
          }}
        >
          {strings.project.addProject}
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
            mx: 5,
            my: 2,
          }}
        >
          <Button variant="contained" type="submit">
            {strings.project.createProject}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
