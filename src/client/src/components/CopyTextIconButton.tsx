import { FC, useCallback, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { strings } from "@strings";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export type CopyTextIconButtonProps = Omit<IconButtonProps, "onClick"> & {
  text: string;
};

export const CopyTextIconButton: FC<CopyTextIconButtonProps> = ({
  text,
  ...props
}) => {
  const [visibleCopiedMessage, setVisibleCopiedMessage] =
    useState<boolean>(false);
  const showCopiedMessage = useCallback(() => {
    setVisibleCopiedMessage(true);
    setTimeout(() => {
      setVisibleCopiedMessage(false);
    }, 2000);
  }, []);

  const copy = useCopyToClipboard(text, showCopiedMessage);

  return (
    <Tooltip title={strings.common.copied} open={visibleCopiedMessage}>
      <IconButton {...props} onClick={copy}>
        <ContentCopyIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};
