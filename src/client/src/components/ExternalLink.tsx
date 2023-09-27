import { Link, LinkProps } from "@mui/material";
import { FC } from "react";

type ExternalLinkProps = Omit<LinkProps, "target">;

export const ExternalLink: FC<ExternalLinkProps> = ({
  children,
  href,
  rel = "noopener",
  ...props
}) => (
  <Link href={href} target="_blank" rel={rel} {...props}>
    {children}
  </Link>
);
