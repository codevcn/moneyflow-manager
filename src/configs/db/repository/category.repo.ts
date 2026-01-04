import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TCategory, TCategoryInput, TCategoryUpdate } from "@/utils/types/db/category.type"
import { TTransactionType } from "@/utils/types/db/transaction.type"

/**
 * Category Entity Adapter
 */
export class CategoryRepository {
  private readonly tableName = "categories"
  private dbManager: DatabaseManager

  constructor() {
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo category mới
   */
  async create(input: TCategoryInput): Promise<TCategory> {
    const timestamp = getCurrentTimestamp()
    const sql = `
      INSERT INTO ${this.tableName} (account_id, name, type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `
    const result = await this.dbManager.executeQuery(sql, [
      input.account_id,
      input.name,
      input.type,
      timestamp,
      timestamp,
    ])

    const insertId = (result as any).lastInsertRowid || (result as any).insertId
    const category = await this.getById(insertId)

    if (!category) {
      throw new Error("Failed to create category")
    }

    return category
  }

  /**
   * Lấy category theo ID
   */
  async getById(id: number): Promise<TCategory | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`
    return await this.dbManager.getFirst<TCategory>(sql, [id])
  }

  /**
   * Lấy tất cả categories của account
   */
  async getByAccountId(accountId: number): Promise<TCategory[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE account_id = ?
      ORDER BY created_at ASC
    `
    return await this.dbManager.getAll<TCategory>(sql, [accountId])
  }

  /**
   * Lấy categories theo type
   */
  async getByType(accountId: number, type: TTransactionType): Promise<TCategory[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE account_id = ? AND type = ?
      ORDER BY created_at ASC
    `
    return await this.dbManager.getAll<TCategory>(sql, [accountId, type])
  }

  /**
   * Cập nhật category
   */
  async update(input: TCategoryUpdate): Promise<TCategory | null> {
    const updates: string[] = []
    const params: any[] = []

    if (input.name !== undefined) {
      updates.push("name = ?")
      params.push(input.name)
    }

    if (updates.length === 0) {
      return this.getById(input.id)
    }

    updates.push("updated_at = ?")
    params.push(getCurrentTimestamp())
    params.push(input.id)

    const sql = `UPDATE ${this.tableName} SET ${updates.join(", ")} WHERE id = ?`
    await this.dbManager.executeQuery(sql, params)

    return this.getById(input.id)
  }

  /**
   * Xóa category
   */
  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`
    await this.dbManager.executeQuery(sql, [id])
  }

  /**
   * Kiểm tra category đã tồn tại chưa
   */
  async exists(accountId: number, name: string, type: TTransactionType): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) as count FROM ${this.tableName}
      WHERE account_id = ? AND name = ? AND type = ?
    `
    const result = await this.dbManager.getFirst<{ count: number }>(sql, [accountId, name, type])
    return (result?.count || 0) > 0
  }
}
