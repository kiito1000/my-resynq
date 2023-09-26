import UserIcon from "@mui/icons-material/Person";
import { Avatar, IconButton, Menu, Tooltip } from "@mui/material";
import { strings } from "@strings";
import { FC, MouseEventHandler, ReactNode, useCallback, useState } from "react";

type UserAvatarProps = {
  menuContent: ReactNode;
  displayName?: string;
  iconUrl?: string;
};

export const UserAvatar: FC<UserAvatarProps> = (props) => {
  const {
    menuContent,
    displayName = strings.user.defaultDisplayName,
    iconUrl,
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Tooltip title={displayName}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "user-avatar" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {iconUrl != null ? (
            <Avatar src={iconUrl} alt={displayName} />
          ) : (
            <Avatar alt={displayName}>
              <UserIcon />
            </Avatar>
          )}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="user-avatar"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 2,
          },
        }}
        MenuListProps={{ sx: { padding: 0 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuContent}
      </Menu>
    </>
  );
};
