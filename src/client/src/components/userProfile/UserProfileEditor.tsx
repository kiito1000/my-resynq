import { Button } from "@components/Button";
import { LabeledInput } from "@components/LabeledInput";
import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  FormControl,
  Input as MuiInput,
  Typography,
} from "@mui/material";
import UserIcon from "@mui/icons-material/Person";
import { strings } from "@strings";
import React, { FC, useCallback, useRef } from "react";
import {
  Control,
  Controller,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";

export type UserProfile = {
  displayName: string;
  iconUrl?: string;
};

type ContentProps = {
  control: Control<UserProfile>;
  register: UseFormRegister<UserProfile>;
};

const Content: FC<ContentProps> = ({ control, register }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectNewProfileImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Box sx={{ width: 485, mx: 6, mt: 4, mb: 8 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {strings.user.profileImage}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Controller
          name="iconUrl"
          control={control}
          render={({ field }) => (
            <Avatar src={field.value} sx={{ width: 72, height: 72 }}>
              <UserIcon sx={{ fontSize: 50 }} />
            </Avatar>
          )}
        />
        <Button
          variant="text"
          size="small"
          disableRipple
          disableFocusRipple
          onClick={selectNewProfileImage}
          sx={{
            "&.MuiButton-sizeSmall": {
              fontSize: 16,
            },
            padding: 0,
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {strings.user.setNewProfileImage}
        </Button>
        <MuiInput
          // TODO: ファイルを選択したらAvatarに表示する
          inputRef={fileInputRef}
          type="file"
          sx={{ display: "none" }}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControl
          sx={{
            width: 1.0,
          }}
          variant="standard"
        >
          <LabeledInput
            label={strings.user.displayName}
            id="title-input"
            inputProps={register("displayName")}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export type UserProfileEditorProps = Omit<DialogProps, "onSubmit"> & {
  initialValue: UserProfile;
  onSubmit: SubmitHandler<UserProfile>;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
};

export const UserProfileEditor: FC<UserProfileEditorProps> = ({
  initialValue,
  onSubmit,
  onCancel,
  ...props
}) => {
  const { control, register, handleSubmit } = useForm<UserProfile>({
    defaultValues: {
      ...initialValue,
    },
  });

  return (
    <Dialog {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "h4.fontSize",
            fontWeight: "normal",
            p: 3,
          }}
        >
          {strings.user.editProfile}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Content control={control} register={register} />
        </DialogContent>
        <Divider />
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
