import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TAccount, TAccountInput, TAccountUpdate } from "@/utils/types/db/account.type"

/**
 * Account Entity Adapter - Quản lý các thao tác với bảng accounts
 */
export class AccountRepository {
  private readonly tableName = "accounts"
  private dbManager: DatabaseManager

  constructor() {
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo account mới
   */
  async create(input: TAccountInput): Promise<TAccount> {
    const timestamp = getCurrentTimestamp()
    const sql = `
      INSERT INTO ${this.tableName} (name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `
    const result = await this.dbManager.executeQuery(sql, [
      input.name,
      input.description || null,
      timestamp,
      timestamp,
    ])

    const insertId = (result as any).lastInsertRowid || (result as any).insertId
    const account = await this.getById(insertId)

    if (!account) {
      throw new Error("Failed to create account")
    }

    return account
  }

  /**
   * Lấy account theo ID
   */
  async getById(id: number): Promise<TAccount | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`
    return await this.dbManager.getFirst<TAccount>(sql, [id])
  }

  /**
   * Lấy tất cả accounts
   */
  async getAll(): Promise<TAccount[]> {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`
    return await this.dbManager.getAll<TAccount>(sql)
  }

  /**
   * Cập nhật account
   */
  async update(input: TAccountUpdate): Promise<TAccount | null> {
    const updates: string[] = []
    const params: any[] = []

    if (input.name !== undefined) {
      updates.push("name = ?")
      params.push(input.name)
    }

    if (input.description !== undefined) {
      updates.push("description = ?")
      params.push(input.description)
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
   * Xóa account
   */
  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`
    await this.dbManager.executeQuery(sql, [id])
  }

  /**
   * Đếm số lượng accounts
   */
  async count(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName}`
    const result = await this.dbManager.getFirst<{ count: number }>(sql)
    return result?.count || 0
  }

  /**
   * Lấy account đầu tiên (dùng khi có 1 account)
   */
  async getFirst(): Promise<TAccount | null> {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY created_at ASC LIMIT 1`
    return await this.dbManager.getFirst<TAccount>(sql)
  }
}
