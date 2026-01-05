import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TAppSettings, TAppSettingsUpdate } from "@/utils/types/db/app-settings.type"
import { eq } from "drizzle-orm"
import { appSettings } from "../db-schema"

/**
 * App Settings Entity Adapter
 */
export class AppSettingsRepository {
  private dbManager: DatabaseManager
  private schema: typeof appSettings

  constructor() {
    this.schema = appSettings
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Lấy app settings (luôn có ID = 1)
   */
  async get(): Promise<TAppSettings | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, 1))
      .limit(1)
    return (result[0] as TAppSettings) || null
  }

  /**
   * Cập nhật app settings
   */
  async update(input: TAppSettingsUpdate): Promise<TAppSettings | null> {
    const dbClient = await this.dbManager.getDBClient()

    const updateData: any = {
      updated_at: getCurrentTimestamp(),
    }

    if (input.language !== undefined) {
      updateData.language = input.language
    }

    if (input.app_password !== undefined) {
      updateData.app_password = input.app_password
    }

    if (input.is_password_enabled !== undefined) {
      updateData.is_password_enabled = input.is_password_enabled
    }

    await dbClient
      .update(this.schema)
      .set(updateData)
      .where(eq(this.schema.id, 1))

    return this.get()
  }
}
