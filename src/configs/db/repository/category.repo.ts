import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TCategory, TCategoryInput, TCategoryUpdate } from "@/utils/types/db/category.type"
import { TTransactionType } from "@/utils/types/db/transaction.type"
import { and, count, eq } from "drizzle-orm"
import { categories } from "../db-schema"

/**
 * Category Entity Adapter
 */
export class CategoryRepository {
  private dbManager: DatabaseManager
  private schema: typeof categories

  constructor() {
    this.schema = categories
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo category mới
   */
  async create(input: TCategoryInput): Promise<TCategory> {
    const dbClient = await this.dbManager.getDBClient()
    const timestamp = getCurrentTimestamp()
    const result = await dbClient
      .insert(this.schema)
      .values({
        account_id: input.account_id,
        name: input.name,
        type: input.type,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning()
    return result[0] as TCategory
  }

  /**
   * Lấy category theo ID
   */
  async getById(id: number): Promise<TCategory | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, id))
      .limit(1)
    return (result[0] as TCategory) || null
  }

  /**
   * Lấy tất cả categories của account
   */
  async getByAccountId(accountId: number): Promise<TCategory[]> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.account_id, accountId))
      .orderBy(this.schema.created_at)
    return result as TCategory[]
  }

  /**
   * Lấy categories theo type
   */
  async getByType(accountId: number, type: TTransactionType): Promise<TCategory[]> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(and(
        eq(this.schema.account_id, accountId),
        eq(this.schema.type, type)
      ))
      .orderBy(this.schema.created_at)
    return result as TCategory[]
  }

  /**
   * Cập nhật category
   */
  async update(input: TCategoryUpdate): Promise<TCategory | null> {
    const dbClient = await this.dbManager.getDBClient()

    const updateData: any = {
      updated_at: getCurrentTimestamp(),
    }

    if (input.name !== undefined) {
      updateData.name = input.name
    }

    await dbClient
      .update(this.schema)
      .set(updateData)
      .where(eq(this.schema.id, input.id))

    return this.getById(input.id)
  }

  /**
   * Xóa category
   */
  async delete(id: number): Promise<void> {
    const dbClient = await this.dbManager.getDBClient()
    await dbClient
      .delete(this.schema)
      .where(eq(this.schema.id, id))
  }

  /**
   * Kiểm tra category đã tồn tại chưa
   */
  async exists(accountId: number, name: string, type: TTransactionType): Promise<boolean> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select({ count: count() })
      .from(this.schema)
      .where(and(
        eq(this.schema.account_id, accountId),
        eq(this.schema.name, name),
        eq(this.schema.type, type)
      ))
    return (result[0]?.count || 0) > 0
  }
}
