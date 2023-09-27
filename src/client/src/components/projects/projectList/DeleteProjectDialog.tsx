import { LocalProject } from "@/firebase/db";
import { Button } from "@components/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import { strings } from "@strings";
import React, { FC, useCallback } from "react";

type ContentProps = {
  name: string;
};

const Content: FC<ContentProps> = ({ name }) => {
  return (
    <Box sx={{ width: 680, mx: 6, mt: 2, mb: 3 }}>
      <Box sx={{ mt: 3, whiteSpace: "pre-line" }}>
        <Typography
          variant="inherit"
          component="span"
          sx={{ fontWeight: "bold" }}
        >
          {name}
        </Typography>
        {"を削除します。\n削除後は復元できません。\n本当に削除しますか？"}
      </Box>
    </Box>
  );
};

export type DeleteProjectDialogProps = Omit<DialogProps, "onSubmit"> & {
  project?: LocalProject;
  onSubmit: (projectId: string) => void;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
};

export const DeleteProjectDialog: FC<DeleteProjectDialogProps> = ({
  project,
  onSubmit,
  onCancel,
  ...props
}) => {
  const handleSubmit = useCallback(() => {
    if (project) {
      onSubmit(project.id);
    }
  }, [onSubmit, project]);

  return (
    <Dialog {...props} maxWidth={false}>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "h4.fontSize",
          fontWeight: "normal",
          p: 3,
        }}
      >
        {strings.project.deleteProject}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Content name={project?.name ?? ""} />
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
        <Button variant="contained" color="warning" onClick={handleSubmit}>
          {strings.button.delete}
        </Button>
        <Button variant="text" onClick={onCancel}>
          {strings.button.cancel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
