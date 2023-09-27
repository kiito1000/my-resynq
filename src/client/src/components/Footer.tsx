import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { strings } from "@strings";
import { FC, memo } from "react";

const Footer: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4,
      }}
    >
      <Divider sx={{ width: 0.95 }} />
      <Typography variant="subtitle2" sx={{ marginY: 2 }}>
        {strings.app.copyright()}
      </Typography>
    </Box>
  );
};

const MemorizedFooter = memo(Footer);

export { MemorizedFooter as Footer };
