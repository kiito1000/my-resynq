import { CssBaseline, ThemeProvider } from "@mui/material";
import { themes } from "@styles/theme";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "@redux/store";
import { GlobalStyle } from "./GlobalStyle";
import { SnackbarProvider } from "notistack";

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error("Root element (#root) is not found.");
}
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={themes.default}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <CssBaseline />
          <GlobalStyle />
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
