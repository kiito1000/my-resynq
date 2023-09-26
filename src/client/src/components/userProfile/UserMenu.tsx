import { useAuth } from "@/hooks/useAuth";
import { Button } from "@components/Button";
import UserIcon from "@mui/icons-material/Person";
import { Avatar, Box, Divider, Typography } from "@mui/material";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { strings } from "@strings";
import { FC, useCallback, useState } from "react";
import { UserProfileEditor, UserProfileEditorProps } from "./UserProfileEditor";

export const UserMenu: FC = () => {
  const dispatch = useAppDispatch();
  const {
    displayName = strings.user.defaultDisplayName,
    iconUrl,
    description,
  } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const handleSubmitProfile: UserProfileEditorProps["onSubmit"] = useCallback(
    (values) => {
      // TODO: アイコンをFirebaseにアップロードしてUser DBにURLを保存する
      dispatch(({ myProfile }) => myProfile.update(values));
      handleClose();
    },
    [dispatch, handleClose]
  );

  const logout = useCallback(() => {
    dispatch(({ auth }) => auth.logout());
  }, [dispatch]);

  return (
    <Box sx={{ width: 352 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          alignItems: "center",
          gap: 3,
          py: 2,
          px: 4,
          overflow: "hidden",
        }}
      >
        <Avatar src={iconUrl} alt={displayName} sx={{ width: 1.0, height: 72 }}>
          <UserIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box
          sx={{
            minWidth: 0,
            "& > *": {
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          }}
        >
          <Typography variant="h4" sx={{ pb: 0.5 }}>
            {displayName}
          </Typography>
          <Typography variant="body2">{description}</Typography>
          {/* <MuiButton
            variant="text"
            disableRipple
            disableFocusRipple
            onClick={handleEditProfile}
            sx={{
              padding: 0,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            {strings.user.editProfile}
          </MuiButton> */}
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          my: 2,
        }}
      >
        <Button variant="outlined" size="small" onClick={logout}>
          {strings.user.logout}
        </Button>
      </Box>
      <UserProfileEditor
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        initialValue={{
          displayName,
          iconUrl,
        }}
        onSubmit={handleSubmitProfile}
      />
    </Box>
  );
};
