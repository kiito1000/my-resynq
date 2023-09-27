import { LabeledInput } from "@components/LabeledInput";
import { Box, FormControl, Typography } from "@mui/material";
import { strings } from "@strings";
import React, { FC, useCallback } from "react";
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";

export type FormValue = {
  name: string;
  hashtag?: string;
};
export type EditProjectFormValue = FormValue;

type ContentProps = {
  register: UseFormRegister<FormValue>;
  control: Control<FormValue>;
  getValues: UseFormGetValues<FormValue>;
  setValue: UseFormSetValue<FormValue>;
};

export const EditProjectForm: FC<ContentProps> = ({
  register,
  control,
  getValues,
  setValue,
}) => {
  const name = useWatch({ control, name: "name" });
  const defaultHashtag = `#${name.replace(/\s/g, "")}`;
  const onFocusHashtag = useCallback(() => {
    const hashtag = getValues("hashtag");
    if (hashtag == null || hashtag.length === 0) {
      setValue("hashtag", defaultHashtag);
    }
  }, [defaultHashtag, getValues, setValue]);

  return (
    <Box sx={{ width: 680, mx: 6, mt: 2, mb: 3 }}>
      <Box sx={{ mt: 3 }}>
        <FormControl
          sx={{
            width: 1.0,
          }}
          variant="standard"
        >
          <LabeledInput
            label={strings.project.projectName}
            id="project-name-input"
            sx={{ fontSize: 24 }}
            inputProps={{ ...register("name") }}
          />
        </FormControl>
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControl
          sx={{
            width: 1.0,
          }}
          variant="standard"
        >
          <LabeledInput
            label={
              <>
                <Typography component="span">
                  {strings.project.hashtag}
                </Typography>
                <Typography component="span" color="text.secondary">
                  {` (${strings.form.optional})`}
                </Typography>
              </>
            }
            id="project-hashtag-input"
            sx={{ fontSize: 24 }}
            inputProps={{ ...register("hashtag") }}
            placeholder={defaultHashtag}
            onFocus={onFocusHashtag}
          />
        </FormControl>
      </Box>
    </Box>
  );
};
