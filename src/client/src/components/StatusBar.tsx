import { Alert, Snackbar, SnackbarProps } from "@mui/material";
import React, { FC, ReactNode } from "react";

export type StatusBarProps = SnackbarProps & {
  icon: ReactNode;
};

export const StatusBar: FC<StatusBarProps> = ({ message, icon, ...props }) => {
  return (
    <Snackbar {...props}>
      <Alert
        elevation={1}
        variant="filled"
        icon={icon}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: 108,
          height: 32,
          padding: 0,
          paddingLeft: 1,
          border: "1px solid",
          borderRight: "none",
          borderColor: "border.main",
          color: "text.primary",
          fontWeight: "normal",
          backgroundColor: "background.default",
          borderRadius: "16px 0px 0px 16px",
          "& .MuiAlert-icon": {
            marginRight: 0.5,
          },
          "& .MuiAlert-message": {
            fontSize: 16,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
