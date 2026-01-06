import { TAppTheme } from "../utils/types/theme.type"
import { palette } from "./colors"
import { tokens } from "./tokens"

export const lightTheme: TAppTheme = {
  mode: "light",
  colors: {
    background: palette.white,
    surface: palette.slate100,
    text: palette.slate900,
    textMuted: palette.slate600,
    border: palette.slate200,
    primary: palette.mainBlue,
    success: palette.green600,
    danger: palette.red400,
  },
  ...tokens,
}

export const darkTheme: TAppTheme = {
  mode: "dark",
  colors: {
    background: palette.black,
    surface: palette.slate900,
    text: palette.white,
    textMuted: palette.slate200,
    border: palette.slate600,
    primary: palette.mainBlue,
    success: palette.green600,
    danger: palette.red600,
  },
  ...tokens,
}
