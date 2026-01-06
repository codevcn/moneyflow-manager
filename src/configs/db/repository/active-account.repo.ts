import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TActiveAccount, TActiveAccountInput } from "@/utils/types/db/active-account.type"
import { eq } from "drizzle-orm"
import { activeAccount } from "../db-schema"

/**
 * Account Entity Adapter - Quản lý các thao tác với bảng accounts
 */
export class ActiveAccountRepository {
  private dbManager: DatabaseManager
  private schema: typeof activeAccount

  constructor() {
    this.schema = activeAccount
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo account mới
   */
  async replaceActiveAccount(input: TActiveAccountInput): Promise<TActiveAccount> {
    if (await this.checkIfExistsAny()) {
      const dbClient = await this.dbManager.getDBClient()
      const timestamp = getCurrentTimestamp()
      const result = await dbClient
        .update(this.schema)
        .set({
          account_id: input.account_id,
          updated_at: timestamp,
        })
        .where(eq(this.schema.account_id, input.account_id))
        .returning()
      return result[0]
    } else {
      return await this.create(input)
    }
  }

  private async checkIfExistsAny(): Promise<boolean> {
    const dbClient = await this.dbManager.getDBClient()
    const countResult = await dbClient.$count(this.schema)
    return countResult > 0
  }

  private async create(input: TActiveAccountInput): Promise<TActiveAccount> {
    const dbClient = await this.dbManager.getDBClient()
    const timestamp = getCurrentTimestamp()
    const result = await dbClient
      .insert(this.schema)
      .values({
        account_id: input.account_id,
        updated_at: timestamp,
      })
      .returning()
    return result[0]
  }

  /**
   * Lấy account đang hoạt động
   */
  async getActiveAccount(): Promise<TActiveAccount> {
    const result = await this.getFirst()
    if (!result) {
      throw new Error("No active account found")
    }
    return result
  }

  private async getFirst(): Promise<TActiveAccount | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient.select().from(this.schema).limit(1)
    return result && result.length > 0 ? result[0] : null
  }
}
