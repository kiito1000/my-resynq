import { useCallback } from "react";

export const useCopyToClipboard = (text: string, onCopied?: () => void) =>
  useCallback(async () => {
    await navigator.clipboard.writeText(text);
    if (onCopied != null) onCopied();
  }, [onCopied, text]);
