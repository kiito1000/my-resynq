import { useAuth } from "@/hooks/useAuth";
import { images } from "@images";
import { Box, Button, Toolbar, ToolbarProps, useTheme } from "@mui/material";
import React, { FC } from "react";
import { Img } from "./shared/styledHtmlComponents";
import { UserAvatar } from "./userProfile/UserAvatar";
import { UserMenu } from "./userProfile/UserMenu";
import { pages } from "@router";

const UserAvatarContainer: FC = () => {
  const { displayName, iconUrl, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <UserAvatar
      displayName={displayName}
      iconUrl={iconUrl}
      menuContent={<UserMenu />}
    />
  );
};

type HeaderProps = ToolbarProps;

const Header: FC<HeaderProps> = ({ sx, ...props }) => {
  const theme = useTheme();
  return (
    <Toolbar
      disableGutters
      variant={"dense"}
      sx={[
        {
          alignItems: "center",
          backgroundColor: (theme) => theme.palette.primary.main,
          px: 2,
          pt: 0.5,
          [theme.breakpoints.up("lg")]: {
            px: 10,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Button href={pages.lp()}>
          <Img src={images.logo.lowContrastTheme} sx={{ height: 48 }} />
        </Button>
      </Box>
      <UserAvatarContainer />
    </Toolbar>
  );
};

const MemorizedHeader = React.memo(Header);

export { MemorizedHeader as Header };
