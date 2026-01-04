import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TTransaction, TTransactionInput, TTransactionUpdate } from "@/utils/types/db/transaction.type"

/**
 * Transaction Entity Adapter
 */
export class TransactionRepository {
  private readonly tableName = "transactions"
  private dbManager: DatabaseManager

  constructor() {
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo transaction mới
   */
  async create(input: TTransactionInput): Promise<TTransaction> {
    const timestamp = getCurrentTimestamp()
    const sql = `
      INSERT INTO ${this.tableName} (
        account_id, category_id, type, amount, description,
        transaction_date, transaction_time, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const result = await this.dbManager.executeQuery(sql, [
      input.account_id,
      input.category_id || null,
      input.type,
      input.amount,
      input.description || null,
      input.transaction_date,
      input.transaction_time,
      timestamp,
      timestamp,
    ])

    const insertId = (result as any).lastInsertRowid || (result as any).insertId
    const transaction = await this.getById(insertId)

    if (!transaction) {
      throw new Error("Failed to create transaction")
    }

    return transaction
  }

  /**
   * Lấy transaction theo ID
   */
  async getById(id: number): Promise<TTransaction | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`
    return await this.dbManager.getFirst<TTransaction>(sql, [id])
  }

  /**
   * Lấy tất cả transactions của account
   */
  async getByAccountId(accountId: number): Promise<TTransaction[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE account_id = ?
      ORDER BY transaction_date DESC, transaction_time DESC
    `
    return await this.dbManager.getAll<TTransaction>(sql, [accountId])
  }

  /**
   * Lấy transactions theo ngày
   */
  async getByDate(accountId: number, startDate: number, endDate: number): Promise<TTransaction[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE account_id = ? AND transaction_date >= ? AND transaction_date <= ?
      ORDER BY transaction_date DESC, transaction_time DESC
    `
    return await this.dbManager.getAll<TTransaction>(sql, [accountId, startDate, endDate])
  }

  /**
   * Cập nhật transaction
   */
  async update(input: TTransactionUpdate): Promise<TTransaction | null> {
    const updates: string[] = []
    const params: any[] = []

    if (input.category_id !== undefined) {
      updates.push("category_id = ?")
      params.push(input.category_id)
    }

    if (input.type !== undefined) {
      updates.push("type = ?")
      params.push(input.type)
    }

    if (input.amount !== undefined) {
      updates.push("amount = ?")
      params.push(input.amount)
    }

    if (input.description !== undefined) {
      updates.push("description = ?")
      params.push(input.description)
    }

    if (input.transaction_date !== undefined) {
      updates.push("transaction_date = ?")
      params.push(input.transaction_date)
    }

    if (input.transaction_time !== undefined) {
      updates.push("transaction_time = ?")
      params.push(input.transaction_time)
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
   * Xóa transaction
   */
  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`
    await this.dbManager.executeQuery(sql, [id])
  }

  /**
   * Đếm số lượng transactions của account
   */
  async countByAccountId(accountId: number): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE account_id = ?`
    const result = await this.dbManager.getFirst<{ count: number }>(sql, [accountId])
    return result?.count || 0
  }
}
