import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TAccount, TAccountInput, TAccountUpdate } from "@/utils/types/db/account.type"
import { count, desc, eq } from "drizzle-orm"
import { accounts } from "../db-schema"

/**
 * Account Entity Adapter - Quản lý các thao tác với bảng accounts
 */
export class AccountRepository {
  private dbManager: DatabaseManager
  private schema: typeof accounts

  constructor() {
    this.schema = accounts
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo account mới
   */
  async create(input: TAccountInput): Promise<TAccount> {
    const dbClient = await this.dbManager.getDBClient()
    const timestamp = getCurrentTimestamp()
    const result = await dbClient
      .insert(this.schema)
      .values({
        name: input.name,
        description: input.description || null,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning()
    return result[0] as TAccount
  }

  /**
   * Lấy account theo ID
   */
  async getById(id: number): Promise<TAccount | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, id))
      .limit(1)
    return (result[0] as TAccount) || null
  }

  /**
   * Lấy tất cả accounts
   */
  async getAll(): Promise<TAccount[]> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .orderBy(desc(this.schema.created_at))
    return result as TAccount[]
  }

  /**
   * Cập nhật account
   */
  async update(input: TAccountUpdate): Promise<TAccount | null> {
    const dbClient = await this.dbManager.getDBClient()

    const updateData: any = {
      updated_at: getCurrentTimestamp(),
    }

    if (input.name !== undefined) {
      updateData.name = input.name
    }

    if (input.description !== undefined) {
      updateData.description = input.description
    }

    await dbClient
      .update(this.schema)
      .set(updateData)
      .where(eq(this.schema.id, input.id))

    return this.getById(input.id)
  }

  /**
   * Xóa account
   */
  async delete(id: number): Promise<void> {
    const dbClient = await this.dbManager.getDBClient()
    await dbClient
      .delete(this.schema)
      .where(eq(this.schema.id, id))
  }

  /**
   * Đếm số lượng accounts
   */
  async count(): Promise<number> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select({ count: count() })
      .from(this.schema)
    return result[0]?.count || 0
  }

  /**
   * Lấy account đầu tiên (dùng khi có 1 account)
   */
  async getFirst(): Promise<TAccount | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .orderBy(this.schema.created_at)
      .limit(1)
    return (result[0] as TAccount) || null
  }
}
