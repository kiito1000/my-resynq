import { Toolbar, ToolbarProps, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/material";
import { FC, ReactNode, memo } from "react";

export type SubHeaderProps = ToolbarProps & {
  title: string;
  rightItem?: ReactNode;
};

const SubHeader: FC<SubHeaderProps> = ({ title, rightItem, sx, ...props }) => {
  const theme = useTheme();

  return (
    <Toolbar
      disableGutters
      variant={"dense"}
      sx={[
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: (theme) => theme.palette.background.paper,
          py: 1,
          px: 4,
          [theme.breakpoints.up("lg")]: {
            px: 10,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Box sx={{ flexBasis: "25%" }}></Box>
      <Typography
        variant="h2"
        sx={{
          flexBasis: "50%",
          textAlign: "center",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>
      <Box sx={{ flexBasis: "25%", textAlign: "right" }}>{rightItem}</Box>
    </Toolbar>
  );
};

const MemorizedSubHeader = memo(SubHeader);

export { MemorizedSubHeader as SubHeader };
