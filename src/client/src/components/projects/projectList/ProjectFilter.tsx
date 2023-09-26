import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  ToggleButtonProps,
} from "@mui/material";
import { strings } from "@strings";
import React, { FC } from "react";
import { useCallback } from "react";

const StyledToggleButton: FC<ToggleButtonProps> = (props) => {
  return (
    <ToggleButton
      {...props}
      color="primary"
      sx={{
        ...props.sx,
        height: 30,
        border: "1px solid",
        borderColor: (theme) => theme.palette.border.main,
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: "15px",
      }}
    />
  );
};

export type ProjectFilterValue = "all" | "notHeld" | "held";

export type ProjectFilterProps = {
  value: ProjectFilterValue;
  onChange?: (value: ProjectFilterValue) => void;
};

export const ProjectFilter: FC<ProjectFilterProps> = ({ value, onChange }) => {
  const handleChange: NonNullable<ToggleButtonGroupProps["onChange"]> =
    useCallback(
      (_, newValue) => {
        if (newValue != null) {
          onChange?.(newValue as ProjectFilterValue);
        }
      },
      [onChange]
    );

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="project filter"
      sx={{
        gap: 1.5,
        ".MuiToggleButtonGroup-grouped:not(:first-of-type)": {
          borderColor: (theme) => theme.palette.border.main,
          borderRadius: "15px",
        },
        ".MuiToggleButtonGroup-grouped:not(:last-of-type)": {
          borderColor: (theme) => theme.palette.border.main,
          borderRadius: "15px",
        },
      }}
    >
      <StyledToggleButton value="all" aria-label="all">
        {strings.project.projectFilter.all}
      </StyledToggleButton>
      <StyledToggleButton value="notHeld" aria-label="not held">
        {strings.project.projectFilter.notHeld}
      </StyledToggleButton>
      <StyledToggleButton value="held" aria-label="held">
        {strings.project.projectFilter.held}
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
};
