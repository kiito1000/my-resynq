import { auth, googleProvider, twitterProvider } from "@/firebase/auth";
import { useScreenSize } from "@/hooks/useScreenSize";
import { images } from "@images";
import {
  AppBar,
  Box,
  CssBaseline,
  Link,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
  styled,
} from "@mui/material";
import { pages } from "@router";
import { strings } from "@strings";
import { themes } from "@styles/theme";
import { colord } from "colord";
import { FC } from "react";
import { CopyTextButton } from "./CopyTextButton";
import { Header } from "./Header";
import { ProgressBar } from "./ProgressBar";
import {
  StyledFirebaseAuth,
  StyledFirebaseAuthProps,
} from "./firebaseUI/StyledFirebaseAuth";
import { Img } from "./shared/styledHtmlComponents";
import { WordBreak } from "./shared/utilComponents/WordBreak";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";

const uiConfig: StyledFirebaseAuthProps["uiConfig"] = {
  signInFlow: "redirect",
  signInOptions: [
    {
      provider: googleProvider.providerId,
      scopes: googleProvider.getScopes(),
      fullLabel: strings.user.signUpOrLoginWithGoogle,
    },
    {
      // Note: Firebase Emulatorでは動作しない
      // 関連Issue: https://github.com/firebase/firebase-tools/issues/6339
      provider: twitterProvider.providerId,
      scopes: twitterProvider.getScopes(),
      fullLabel: strings.user.signUpOrLoginWithTwitter,
    },
  ],
};

const FirebaseAuthSection: FC<
  Pick<StyledFirebaseAuthProps["uiConfig"], "callbacks">
> = ({ callbacks }) => {
  return (
    <StyledFirebaseAuth
      uiConfig={{ ...uiConfig, callbacks }}
      firebaseAuth={auth}
      styles={{
        button: {
          maxWidth: "none",
        },
      }}
    />
  );
};

const StyledHeader = styled(Header)({
  height: 56,
});

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const { mdAndDown } = useScreenSize();

  return (
    <ThemeProvider theme={themes.landing}>
      <CssBaseline />
      <Box>
        <AppBar>
          <StyledHeader />
          <ProgressBar />
        </AppBar>
        <Stack alignItems="center" sx={{ mt: 8, px: 2 }}>
          <Img src={images.logo.lightTheme} sx={{ width: 272, mr: 3 }} />
          <Typography
            variant="h3"
            sx={{ mt: 2, width: 1, textAlign: "center" }}
          >
            <WordBreak words={strings.app.description} />
          </Typography>
          <Box sx={{ mt: 9, mb: 2 }}>
            <Typography variant="h2" sx={{ fontSize: 24 }}>
              {strings.user.signUp} / {strings.user.login}
            </Typography>
          </Box>
          <FirebaseAuthSection
            callbacks={{
              signInSuccessWithAuthResult: (authResult) => {
                dispatch(({ auth }) => auth.handleSignInSuccess(authResult));
                return true;
              },
              signInFailure: (error) => {
                dispatch(({ auth }) => auth.handleSignInFailure(error));
              },
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              アカウントを登録することにより、
              <Link href={pages.tos()}>{strings.user.tos}</Link>
              に同意したものとみなされます。
            </Typography>
          </Box>
          {mdAndDown && (
            <Paper
              variant="outlined"
              sx={{
                maxWidth: (theme) => theme.breakpoints.values.sm,
                backgroundColor: (theme) =>
                  colord(theme.palette.warning.main).alpha(0.1).toHex(),
                p: 1.5,
                my: 4,
              }}
            >
              <Typography variant="body2">
                {strings.user.recommendUsingWithPc}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                <CopyTextButton text={location.href} size="small">
                  <Typography variant="body2">
                    {strings.user.copyLink}
                  </Typography>
                </CopyTextButton>
              </Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
