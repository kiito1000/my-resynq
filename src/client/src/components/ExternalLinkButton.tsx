import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { IconButton, IconButtonProps, Link } from "@mui/material";
import React, { FC } from "react";

export type ExternalLinkButtonProps = Omit<IconButtonProps, "onClick"> & {
  href: string;
};

export const ExternalLinkButton: FC<ExternalLinkButtonProps> = ({
  href,
  ...props
}) => {
  return (
    <Link href={href} target="_blank">
      <IconButton {...props}>
        <OpenInNewIcon fontSize="inherit" />
      </IconButton>
    </Link>
  );
};
