import { TAppTheme } from "../utils/types/theme.type"
import { tokens } from "./tokens"

export const lightTheme: TAppTheme = {
  mode: "light",
  colors: {
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    textMuted: "#475569",
    border: "#e2e8f0",
    primary: "#2563eb",
    success: "#16a34a",
    danger: "#dc2626",
  },
  ...tokens,
}

export const darkTheme: TAppTheme = {
  mode: "dark",
  colors: {
    background: "#0b1220",
    surface: "#0f172a",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    border: "#1f2a44",
    primary: "#60a5fa",
    success: "#34d399",
    danger: "#fb7185",
  },
  ...tokens,
}
