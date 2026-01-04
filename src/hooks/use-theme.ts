import { useSettingsStore } from "@/stores/settings.store"
import { darkTheme, lightTheme } from "@/theme/themes"
import { TAppTheme } from "@/utils/types/theme.type"
import { useColorScheme } from "react-native"

export function useTheme(): TAppTheme {
  const system = useColorScheme() // 'light' | 'dark' | null
  const themeMode = useSettingsStore((s) => s.themeMode)

  const resolved = themeMode === "system" ? (system === "dark" ? "dark" : "light") : themeMode

  return resolved === "dark" ? darkTheme : lightTheme
}
