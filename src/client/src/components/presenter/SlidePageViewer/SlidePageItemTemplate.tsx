import { SlidePage } from "@/firebase/db";
import { Box, Card, Typography } from "@mui/material";
import { FC, ReactNode, useRef } from "react";

export type SlidePageItemTemplateProps = {
  title: ReactNode;
  page: SlidePage;
  children?: ReactNode;
};

export const SlidePageItemTemplate: FC<SlidePageItemTemplateProps> = ({
  title,
  page,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isActive = page.status != null;
  const { isDone } = page;

  return (
    <Card
      elevation={0}
      ref={ref}
      sx={{
        border: 1,
        borderColor: (theme) => theme.palette.border.main,
        borderRadius: 1,
        boxShadow: isActive ? 3 : 0,
      }}
    >
      <Box
        sx={[
          {
            outline: "1px solid",
            outlineColor: (theme) => theme.palette.border.main,
            borderRadius: 1,
            backgroundColor: (theme) =>
              isActive
                ? theme.palette.primary.light
                : isDone
                ? theme.palette.action.disabledBackground
                : theme.palette.background.default,
            // TODO: isActiveの修正を行った後、配色を再考する
            px: 4,
            py: 1,
          },
          children != null && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
          children == null && {
            py: 2,
          },
        ]}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: isActive ? "medium" : "normal" }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Card>
  );
};
