import { createTheme, ThemeOptions } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { AnyColor, Colord, colord } from "colord";

const merge = (
  target: ThemeOptions,
  source: ThemeOptions,
  options?: { clone?: boolean }
): ThemeOptions => deepmerge(target, source, options);

const darken = (input: AnyColor | Colord) => colord(input).darken(0.05).toHex();
const darkenWeakly = (input: AnyColor | Colord) =>
  colord(input).darken(0.025).toHex();

const commonOptions: ThemeOptions = {
  typography: {
    fontFamily: ["'Noto Sans JP'", "sans-serif"].join(","),
    htmlFontSize: 16,
    overline: { textTransform: "none" },
    button: { textTransform: "none" },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        position: "sticky",
        color: "transparent",
      },
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
};

const landing = createTheme(
  merge(commonOptions, {
    shape: {
      borderRadius: 6,
    },
    palette: {
      primary: {
        main: "#FF9A38",
        light: "#FFD5AC",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#53C8E4",
        contrastText: "#FFFFFF",
      },
      error: {
        main: "#FF4848",
        light: "#FF6C6C",
        dark: "#CC3939",
        contrastText: "#FFFFFF",
      },
      warning: {
        main: "#ED6C02",
        light: "#FF9800",
        dark: "#E65100",
        contrastText: "#FFFFFF",
      },
      text: {
        primary: "#707070",
        secondary: "#9D9D9D",
      },
      border: {
        main: "#C5C5C5",
        light: "#e2e2e2",
      },
      background: {
        paper: "#F8F9F9",
        default: "#F4F5F5",
      },
    },
    typography: {
      button: { fontSize: 16 },
      h1: {
        fontSize: 36,
        fontWeight: 500,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
        fontWeight: 500,
      },
      h4: {
        fontSize: 20,
      },
      subtitle1: {
        fontSize: 22,
      },
      subtitle2: {
        fontSize: 16,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: ({ theme }) => {
            const color = theme.palette.common.white;
            const backgroundColor = theme.palette.primary.main;
            return {
              color,
              backgroundColor,
              "&:hover": { backgroundColor: darken(backgroundColor) },
            };
          },
          reverseContainedPrimary: ({ theme }) => {
            const color = theme.palette.primary.main;
            const backgroundColor = theme.palette.common.white;
            return {
              color,
              backgroundColor,
              boxShadow: theme.shadows[1],
              "&:hover": {
                backgroundColor: darkenWeakly(backgroundColor),
                boxShadow: theme.shadows[4],
              },
            };
          },
          containedSecondary: ({ theme }) => {
            const color = theme.palette.common.white;
            const backgroundColor = theme.palette.secondary.main;
            return {
              color,
              backgroundColor,
              "&:hover": { backgroundColor: darken(backgroundColor) },
            };
          },
          reverseContainedSecondary: ({ theme }) => {
            const color = theme.palette.secondary.main;
            const backgroundColor = theme.palette.common.white;
            return {
              color,
              backgroundColor,
              boxShadow: theme.shadows[1],
              "&:hover": {
                backgroundColor: darkenWeakly(backgroundColor),
                boxShadow: theme.shadows[4],
              },
            };
          },
          text: ({ theme }) => ({
            padding: 0,
            "&:hover": { color: theme.palette.primary.main },
          }),
          textPrimary: ({ theme }) => ({
            color: "unset",
            "&:hover": { color: theme.palette.primary.main },
          }),
          textSecondary: ({ theme }) => ({
            color: "unset",
            "&:hover": { color: theme.palette.secondary.main },
          }),
        },
      },
    },
  })
);

const docs = createTheme(
  merge(landing, {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          h2: {
            fontSize: 22,
            marginTop: 26,
            marginBottom: 12,
          },
          h3: {
            fontSize: 18,
            marginTop: 8,
            marginBottom: 8,
          },
          h5: {
            margin: 0,
          },
          p: {
            fontSize: 16,
          },
          ul: {
            marginTop: 8,
            marginBottom: 8,
          },
          hr: {
            marginTop: 26,
            borderColor: "whitesmoke",
          },
        },
      },
    },
  })
);

const project = createTheme(
  merge(commonOptions, {
    shape: {
      borderRadius: 6,
    },
    palette: {
      primary: {
        main: "#FF9A38",
        light: "#FFD5AC",
      },
      secondary: {
        main: "#53C8E4",
      },
      text: {
        primary: "#707070",
        secondary: "#9D9D9D",
      },
      border: {
        main: "#C5C5C5",
        light: "#e2e2e2",
      },
      action: {
        coloredHover: "rgba(255, 154, 56, 0.08)",
      },
      warning: {
        main: "#FF4848",
        light: "#FF6C6C",
      },
      background: {
        paper: "#F8F9F9",
        default: "#F4F5F5",
      },
    },
    typography: {
      button: { fontSize: 16 },
      h1: {
        fontSize: 32,
        fontWeight: 500,
      },
      h2: {
        fontSize: 28,
      },
      h3: {
        fontSize: 20,
      },
      h4: {
        fontSize: 18,
      },
      subtitle1: {
        fontSize: 22,
      },
      subtitle2: {
        fontSize: 16,
      },
    },
  })
);

const presenter = createTheme(
  merge(commonOptions, {
    shape: {
      borderRadius: 6,
    },
    palette: {
      primary: {
        main: "#FF9A38",
        light: "#FFD5AC",
      },
      secondary: {
        main: "#53C8E4",
      },
      text: {
        primary: "#707070",
        secondary: "#9D9D9D",
      },
      border: {
        main: "#C5C5C5",
      },
      action: {
        coloredHover: "rgba(255, 154, 56, 0.08)",
      },
      warning: {
        main: "#FF4848",
        light: "#FF6C6C",
      },
      background: {
        paper: "#F8F9F9",
        default: "#F4F5F5",
      },
    },
    typography: {
      button: { fontSize: 16 },
      h1: {
        fontSize: 32,
        fontWeight: 500,
      },
      h2: {
        fontSize: 28,
      },
      subtitle1: {
        fontSize: 22,
      },
      subtitle2: {
        fontSize: 16,
      },
    },
  })
);

const slide = {
  default: createTheme(
    // Font Familyが適用されない問題があるためdeepmergeを使う
    merge(commonOptions, {
      palette: {
        primary: {
          main: "#FF9A38",
        },
        secondary: {
          main: "#53C8E4",
        },
        choices: [
          { main: "#F797B2", light: "#FFE5EC" },
          { main: "#42D6FF", light: "#D9F7FF" },
          { main: "#F5E74C", light: "#FFFBD1" },
          { main: "#6DEF80", light: "#DCFFE1" },
          { main: "#FFAD5E", light: "#FFECD9" },
          { main: "#B492FF", light: "#E9DFFE" },
          { main: "#B7B7B7", light: "#DFDFDF" },
        ],
        text: {
          primary: "rgba(110, 110, 110, 0.87)",
          secondary: "rgba(238, 238, 238, 0.55)",
        },
      },
      typography: {
        fontFamily: ["'Mochiy Pop One'", "sans-serif"].join(","),
        h1: {
          fontSize: 56,
        },
        h2: {
          fontSize: 32,
        },
        h3: {
          fontSize: 28,
        },
        caption: {
          fontSize: 16,
        },
        body1: {
          fontSize: 34,
        },
      },
    })
  ),
};

const answererSystem = createTheme(
  merge(commonOptions, {
    palette: {
      primary: {
        main: "#FF9A38",
        light: "#FFD5AC",
      },
      secondary: {
        main: "#53C8E4",
      },
      border: {
        main: "#C5C5C5",
      },
      background: {
        paper: "#F8F9F9",
        default: "#F4F5F5",
      },
      text: {
        primary: "rgba(16,16,16, 0.56)",
        secondary: "rgba(0,0,0, 0.4)",
      },
    },
  })
);

const answerer = createTheme(
  merge(commonOptions, {
    palette: {
      primary: {
        main: "#FF9A38",
        light: "#FFD5AC",
      },
      secondary: {
        main: "#53C8E4",
      },
      border: {
        main: "#C5C5C5",
      },
      background: {
        paper: "#F8F9F9",
        default: "#F4F5F5",
      },
      text: {
        primary: "rgba(16,16,16, 0.56)",
        secondary: "rgba(0,0,0, 0.4)",
      },
    },
    typography: {
      fontFamily: ["'Mochiy Pop One'", "sans-serif"].join(","),
    },
  })
);

export const themes = {
  default: project,
  docs,
  landing,
  project,
  slide,
  answerer,
  answererSystem,
  presenter,
};
