import { TAppThemeMode } from "@/utils/types/theme.type"
import { create } from "zustand"

type SettingsState = {
  themeMode: TAppThemeMode // system | light | dark
  setThemeMode: (mode: TAppThemeMode) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: "system",
  setThemeMode: (themeMode) => set({ themeMode }),
}))
