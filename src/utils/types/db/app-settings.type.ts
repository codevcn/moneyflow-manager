export type TLanguage = "vi"

export type TAppSettings = {
  id: number
  language: TLanguage
  app_password: string | null
  is_password_enabled: number
  created_at: number
}

export type TAppSettingsUpdate = {
  language?: TLanguage
  app_password?: string | null
  is_password_enabled?: number
}
