import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TAppSettings, TAppSettingsUpdate } from "@/utils/types/db/app-settings.type"

/**
 * App Settings Entity Adapter
 */
export class AppSettingsRepository {
  private dbManager: DatabaseManager

  constructor() {
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Lấy app settings (luôn có ID = 1)
   */
  async get(): Promise<TAppSettings | null> {
    const sql = "SELECT * FROM app_settings WHERE id = 1"
    return await this.dbManager.getFirst<TAppSettings>(sql)
  }

  /**
   * Cập nhật app settings
   */
  async update(input: TAppSettingsUpdate): Promise<TAppSettings | null> {
    const updates: string[] = []
    const params: any[] = []

    if (input.language !== undefined) {
      updates.push("language = ?")
      params.push(input.language)
    }

    if (input.app_password !== undefined) {
      updates.push("app_password = ?")
      params.push(input.app_password)
    }

    if (input.is_password_enabled !== undefined) {
      updates.push("is_password_enabled = ?")
      params.push(input.is_password_enabled)
    }

    if (updates.length === 0) {
      return this.get()
    }

    updates.push("updated_at = ?")
    params.push(getCurrentTimestamp())

    const sql = `UPDATE app_settings SET ${updates.join(", ")} WHERE id = 1`
    await this.dbManager.executeQuery(sql, params)

    return this.get()
  }
}
