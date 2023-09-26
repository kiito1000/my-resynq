import "@mui/material/styles";
import type { PaletteColorOptions, PaletteColor } from "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
  interface PaletteOptions {
    border?: PaletteColorOptions;
    choices?: PaletteColorOptions[];
  }
  interface Palette {
    border: PaletteColor;
    choices: PaletteColor[];
  }
  interface TypeAction {
    coloredHover: string;
  }

  interface TypeBackground {
    primary: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    reverseContained: true;
  }

  interface ButtonClasses {
    reverseContained: string;
    reverseContainedPrimary: string;
    reverseContainedSecondary: string;
  }
}
