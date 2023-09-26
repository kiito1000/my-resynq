import { FC, useCallback, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, ButtonProps, Tooltip } from "@mui/material";
import { strings } from "@strings";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export type CopyTextButtonProps = Omit<ButtonProps, "onClick"> & {
  text: string;
};

export const CopyTextButton: FC<CopyTextButtonProps> = ({
  text,
  children,
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
      <Button
        variant="text"
        {...props}
        onClick={copy}
        startIcon={<ContentCopyIcon fontSize="inherit" />}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
