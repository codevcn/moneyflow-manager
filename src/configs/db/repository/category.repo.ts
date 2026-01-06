import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TCategory, TCategoryInput, TCategoryUpdate } from "@/utils/types/db/category.type"
import { and, asc, count, eq } from "drizzle-orm"
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
   * Lấy tất cả categories
   */
  async getAll(): Promise<TCategory[]> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient.select().from(this.schema).orderBy(asc(this.schema.name))
    return result as TCategory[]
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
        icon_path: input.icon_path,
        name: input.name,
        created_at: timestamp,
      })
      .returning()
    return result[0] as TCategory
  }

  /**
   * Lấy category theo ID
   */
  async getById(id: TCategory["id"]): Promise<TCategory | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient.select().from(this.schema).where(eq(this.schema.id, id)).limit(1)
    return (result[0] as TCategory) || null
  }

  // /**
  //  * Lấy tất cả categories của account
  //  */
  // async getTransactionId(transactionId: TTransaction["id"]): Promise<TCategory[]> {
  //   const dbClient = await this.dbManager.getDBClient()
  //   const result = await dbClient
  //     .select()
  //     .from(this.schema)
  //     .where(eq(this.schema.transaction_id, transactionId))
  //     .orderBy(this.schema.created_at)
  //   return result as TCategory[]
  // }

  // /**
  //  * Lấy categories theo type
  //  */
  // async getByType(transactionId: TTransaction["id"], type: TTransactionType): Promise<TCategory[]> {
  //   const dbClient = await this.dbManager.getDBClient()
  //   const result = await dbClient
  //     .select()
  //     .from(this.schema)
  //     .where(and(eq(this.schema.transaction_id, transactionId), eq(this.schema.type, type)))
  //     .orderBy(this.schema.created_at)
  //   return result as TCategory[]
  // }

  /**
   * Cập nhật category
   */
  async update(input: TCategoryUpdate): Promise<TCategory | null> {
    const dbClient = await this.dbManager.getDBClient()

    const updateData: any = {}

    if (input.name !== undefined) {
      updateData.name = input.name
    }

    if (input.icon_path !== undefined) {
      updateData.icon_path = input.icon_path
    }

    await dbClient.update(this.schema).set(updateData).where(eq(this.schema.id, input.id))

    return this.getById(input.id)
  }

  /**
   * Xóa category
   */
  async delete(id: number): Promise<void> {
    const dbClient = await this.dbManager.getDBClient()
    await dbClient.delete(this.schema).where(eq(this.schema.id, id))
  }

  /**
   * Kiểm tra category đã tồn tại chưa
   */
  async exists(name: string): Promise<boolean> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select({ count: count() })
      .from(this.schema)
      .where(and(eq(this.schema.name, name)))
    return (result[0]?.count || 0) > 0
  }

  static createIconPath(iconName: string): string {
    return `images/icons/${iconName}.png`
  }
}
