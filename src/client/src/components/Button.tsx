import { ButtonProps, Button as MuiButton } from "@mui/material";
import React, { FC } from "react";

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <MuiButton
      {...props}
      disableElevation
      sx={{
        border: props.variant === "outlined" ? "1px solid" : "none",
        borderColor: "border.main",
        color: (theme) => {
          switch (props.variant) {
            case "contained":
              return theme.palette.common.white;
            case "outlined":
              return theme.palette.text.primary;
            case "text":
              return theme.palette.primary.main;
          }
        },
        paddingX: 2,
        paddingY: 0.5,
        "&.MuiButton-sizeSmall": {
          fontSize: 14,
        },
        "&.MuiButton-sizeMedium": {
          fontSize: 16,
        },
        "&.MuiButton-sizeLarge": {
          fontSize: 18,
        },
        ...props.sx,
      }}
    >
      {children}
    </MuiButton>
  );
};
