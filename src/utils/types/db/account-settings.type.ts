export type TThemeMode = "light" | "dark"
export type TCurrency = "VND"

export type TAccountSettings = {
  id: number
  account_id: number
  theme_mode: TThemeMode
  currency: TCurrency
  created_at: number
  updated_at: number
}

export type TAccountSettingsInput = {
  account_id: number
  theme_mode?: TThemeMode
  currency?: TCurrency
}

export type TAccountSettingsUpdate = {
  account_id: number
  theme_mode?: TThemeMode
  currency?: TCurrency
}
