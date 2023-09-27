// cf. https://github.com/firebase/firebaseui-web-react/pull/173#issuecomment-1519522490

import "firebaseui/dist/firebaseui.css";

import { CSSObject } from "@emotion/serialize";
import { Box, GlobalStyles, SxProps } from "@mui/material";
import { Auth } from "firebase/auth";
import { auth } from "firebaseui";
import { useEffect, useRef } from "react";

export interface StyledFirebaseAuthProps {
  // The Firebase UI Web UI Config object.
  // See: https://github.com/firebase/firebaseui-web#configuration
  uiConfig: auth.Config;
  // Callback that will be passed the FirebaseUi instance before it is
  // started. This allows access to certain configuration options such as
  // disableAutoSignIn().
  uiCallback?(ui: auth.AuthUI): void;
  // The Firebase App auth instance to use.
  firebaseAuth: Auth; // As firebaseui-web
  styles?: {
    uiContainer?: SxProps;
    button?: CSSObject;
  };
}

export const StyledFirebaseAuth = ({
  uiConfig,
  firebaseAuth,
  styles,
  uiCallback,
}: StyledFirebaseAuthProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let firebaseUiWidget: auth.AuthUI;

    // firebase ui start in event loop to solve react 18 strict requirement.
    const timeout = setTimeout(() => {
      // Get or Create a firebaseUI instance.
      firebaseUiWidget =
        auth.AuthUI.getInstance() || new auth.AuthUI(firebaseAuth);
      if (uiConfig.signInFlow === "popup") firebaseUiWidget.reset();

      // Trigger the callback if any was set.
      if (uiCallback) uiCallback(firebaseUiWidget);

      // Render the firebaseUi Widget.
      firebaseUiWidget.start(element, uiConfig);
    });

    return () => {
      clearTimeout(timeout);
      if (firebaseUiWidget) firebaseUiWidget.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiConfig]);

  return (
    <Box sx={styles?.uiContainer} ref={elementRef}>
      {styles?.button && (
        <GlobalStyles
          styles={{
            "button.firebaseui-idp-button": styles.button,
          }}
        />
      )}
    </Box>
  );
};
