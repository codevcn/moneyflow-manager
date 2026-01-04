import { DatabaseManager } from "@/configs/db/db-manager"
import { DEFAULTS } from "@/constants/formats"
import { getCurrentTimestamp } from "@/utils/formatters"
import {
  TAccountSettings,
  TAccountSettingsInput,
  TAccountSettingsUpdate,
} from "@/utils/types/db/account-settings.type"

/**
 * Account Settings Entity Adapter
 */
export class AccountSettingsRepository {
  private readonly tableName = "account_settings"
  private dbManager: DatabaseManager

  constructor() {
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo settings cho account
   */
  async create(input: TAccountSettingsInput): Promise<TAccountSettings> {
    const timestamp = getCurrentTimestamp()
    const sql = `
      INSERT INTO ${this.tableName} (account_id, theme_mode, currency, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `
    await this.dbManager.executeQuery(sql, [
      input.account_id,
      input.theme_mode || DEFAULTS.THEME_MODE,
      input.currency || DEFAULTS.CURRENCY,
      timestamp,
      timestamp,
    ])

    const settings = await this.getByAccountId(input.account_id)
    if (!settings) {
      throw new Error("Failed to create account settings")
    }

    return settings
  }

  /**
   * Lấy settings theo account ID
   */
  async getByAccountId(accountId: number): Promise<TAccountSettings | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE account_id = ?`
    return await this.dbManager.getFirst<TAccountSettings>(sql, [accountId])
  }

  /**
   * Cập nhật settings
   */
  async update(input: TAccountSettingsUpdate): Promise<TAccountSettings | null> {
    const updates: string[] = []
    const params: any[] = []

    if (input.theme_mode !== undefined) {
      updates.push("theme_mode = ?")
      params.push(input.theme_mode)
    }

    if (input.currency !== undefined) {
      updates.push("currency = ?")
      params.push(input.currency)
    }

    if (updates.length === 0) {
      return this.getByAccountId(input.account_id)
    }

    updates.push("updated_at = ?")
    params.push(getCurrentTimestamp())
    params.push(input.account_id)

    const sql = `UPDATE ${this.tableName} SET ${updates.join(", ")} WHERE account_id = ?`
    await this.dbManager.executeQuery(sql, params)

    return this.getByAccountId(input.account_id)
  }

  /**
   * Xóa settings (cascade khi xóa account)
   */
  async delete(accountId: number): Promise<void> {
    const sql = `DELETE FROM ${this.tableName} WHERE account_id = ?`
    await this.dbManager.executeQuery(sql, [accountId])
  }
}
