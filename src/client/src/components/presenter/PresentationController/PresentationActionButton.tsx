import { FC, useCallback, useMemo, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuProps,
  Tooltip,
  useTheme,
  Typography,
} from "@mui/material";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { mdiArrowUpDropCircleOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import { strings } from "@strings";
import { pages } from "@router";

type PresentationActionMenuProps = {
  menuProps: Pick<MenuProps, "anchorEl" | "open" | "onClose">;
  answererUrl: string;
  slideUrl: string;
  cancelEvent?: () => void;
  openSlideWithNewWindow?: () => void;
  onCopyUrl?: () => void;
};

const PresentationActionMenu: FC<PresentationActionMenuProps> = ({
  menuProps,
  answererUrl,
  slideUrl,
  cancelEvent,
  openSlideWithNewWindow,
  onCopyUrl,
}) => {
  const copyAnswererUrl = useCopyToClipboard(answererUrl, onCopyUrl);
  const copySlideUrl = useCopyToClipboard(slideUrl, onCopyUrl);
  return (
    <Menu
      {...menuProps}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <MenuItem onClick={copyAnswererUrl}>
        <span>{strings.presenter.actions.copyAnswererUrl}</span>
      </MenuItem>
      <MenuItem onClick={copySlideUrl}>
        <span>{strings.presenter.actions.copySlideUrl}</span>
      </MenuItem>
      <MenuItem onClick={openSlideWithNewWindow}>
        {strings.presenter.actions.openSlideWithNewWindow}
      </MenuItem>
      <MenuItem
        onClick={cancelEvent}
        sx={{ color: "warning.main" }}
        disabled={cancelEvent == null}
      >
        {strings.presenter.actions.cancelPresentation}
      </MenuItem>
    </Menu>
  );
};

export type PresentationActionButtonProps = {
  presentationId: string;
  onCancelEvent?: () => void;
};

export const PresentationActionButton: FC<PresentationActionButtonProps> = ({
  presentationId,
  onCancelEvent,
}) => {
  const theme = useTheme();

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [visibleCopiedMessage, setVisibleCopiedMessage] =
    useState<boolean>(false);

  const open = Boolean(anchorElement);
  const openMenu: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setAnchorElement(event.currentTarget);
    },
    []
  );
  const handleClose = useCallback(() => {
    setAnchorElement(null);
  }, []);

  const answererUrl = `${location.origin}${pages.presentation(presentationId)}`;
  const slideUrl = `${location.origin}${pages.slideViewer(presentationId)}`;

  const handleCopyUrl = useCallback(() => {
    handleClose();
    setVisibleCopiedMessage(true);
    setTimeout(() => {
      setVisibleCopiedMessage(false);
    }, 2000);
  }, [handleClose]);
  const openSlideWithNewWindow = useCallback(() => {
    handleClose();
    // cf. https://developer.mozilla.org/en-US/docs/Web/API/Window/open#best_practices
    window.open(slideUrl, "SlideWindow", "popup");
  }, [handleClose, slideUrl]);

  const handleCancelEvent = useMemo(() => {
    if (onCancelEvent == null) {
      return undefined;
    }
    return () => {
      handleClose();
      onCancelEvent?.();
    };
  }, [onCancelEvent, handleClose]);

  return (
    <>
      <Tooltip
        title={strings.common.copied}
        placement="top"
        open={visibleCopiedMessage}
      >
        <Button
          onClick={openMenu}
          size="small"
          variant="text"
          startIcon={
            <Icon
              path={mdiArrowUpDropCircleOutline}
              color={theme.palette.text.secondary}
              size="20px"
              style={{
                transform: `rotate(${open ? 180 : 0}deg)`,
              }}
            />
          }
          sx={{
            color: (theme) => theme.palette.text.primary,
            "&.MuiButton-sizeSmall": {
              fontSize: 16,
            },
          }}
        >
          <Typography> {strings.presenter.moreActions}</Typography>
        </Button>
      </Tooltip>
      <PresentationActionMenu
        menuProps={{
          anchorEl: anchorElement,
          open,
          onClose: handleClose,
        }}
        answererUrl={answererUrl}
        slideUrl={slideUrl}
        cancelEvent={handleCancelEvent}
        openSlideWithNewWindow={openSlideWithNewWindow}
        onCopyUrl={handleCopyUrl}
      />
    </>
  );
};
