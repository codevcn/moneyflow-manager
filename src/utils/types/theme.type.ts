import { tokens } from "@/theme/tokens"

export type TAppThemeMode = "system" | "light" | "dark"

export type TAppTheme = {
  mode: "light" | "dark"
  colors: {
    background: string
    surface: string
    text: string
    textMuted: string
    border: string

    primary: string
    success: string
    danger: string
  }
  spacing: typeof tokens.spacing
  radius: typeof tokens.radius
  fontSize: typeof tokens.fontSize
  fontWeight: typeof tokens.fontWeight
}
