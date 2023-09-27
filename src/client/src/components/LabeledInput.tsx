import { InputBaseProps, InputLabel } from "@mui/material";
import React, { FC } from "react";
import { ReactNode } from "react";
import { Input } from "./Input";

export type LabeledInputProps = InputBaseProps & {
  label: ReactNode;
  id: string;
};

export const LabeledInput: FC<LabeledInputProps> = ({
  label,
  id,
  ...props
}) => {
  return (
    <>
      <InputLabel
        shrink
        focused={false}
        disableAnimation
        htmlFor={id}
        sx={{
          fontSize: "body1",
          transform: "none",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        {label}
      </InputLabel>
      <Input
        {...props}
        sx={{
          ...props.sx,
          "label + &": {
            marginTop: 5,
          },
        }}
        id={id}
      />
    </>
  );
};
