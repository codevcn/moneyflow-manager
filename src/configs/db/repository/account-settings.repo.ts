import { DatabaseManager } from "@/configs/db/db-manager"
import { DEFAULTS } from "@/constants/formats"
import { getCurrentTimestamp } from "@/utils/formatters"
import {
  TAccountSettings,
  TAccountSettingsInput,
  TAccountSettingsUpdate,
} from "@/utils/types/db/account-settings.type"
import { eq } from "drizzle-orm"
import { accountSettings } from "../db-schema"

/**
 * Account Settings Entity Adapter
 */
export class AccountSettingsRepository {
  private dbManager: DatabaseManager
  private schema: typeof accountSettings

  constructor() {
    this.schema = accountSettings
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo settings cho account
   */
  async create(input: TAccountSettingsInput): Promise<TAccountSettings> {
    const dbClient = await this.dbManager.getDBClient()
    const accountSettings = await dbClient
      .insert(this.schema)
      .values({
        account_id: input.account_id,
        theme_mode: input.theme_mode || DEFAULTS.THEME_MODE,
        currency: input.currency || DEFAULTS.CURRENCY,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      })
      .returning()
    return accountSettings[0] as TAccountSettings
  }

  /**
   * Lấy settings theo account ID
   */
  async getByAccountId(accountId: number): Promise<TAccountSettings | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.account_id, accountId))
      .limit(1)
    return (result[0] as TAccountSettings) || null
  }

  /**
   * Cập nhật settings
   */
  async update(input: TAccountSettingsUpdate): Promise<TAccountSettings | null> {
    const dbClient = await this.dbManager.getDBClient()

    const updateData: any = {
      updated_at: getCurrentTimestamp(),
    }

    if (input.theme_mode !== undefined) {
      updateData.theme_mode = input.theme_mode
    }

    if (input.currency !== undefined) {
      updateData.currency = input.currency
    }

    await dbClient.update(this.schema).set(updateData).where(eq(this.schema.account_id, input.account_id))

    return this.getByAccountId(input.account_id)
  }

  /**
   * Xóa settings (cascade khi xóa account)
   */
  async delete(accountId: number): Promise<void> {
    const dbClient = await this.dbManager.getDBClient()
    await dbClient.delete(this.schema).where(eq(this.schema.account_id, accountId))
  }
}
