import { DatabaseManager } from "@/configs/db/db-manager"
import { getCurrentTimestamp } from "@/utils/formatters"
import { TTransaction, TTransactionInput, TTransactionUpdate } from "@/utils/types/db/transaction.type"
import { and, count, desc, eq, gte, lte } from "drizzle-orm"
import { transactions } from "../db-schema"

/**
 * Transaction Entity Adapter
 */
export class TransactionRepository {
  private dbManager: DatabaseManager
  private schema: typeof transactions

  constructor() {
    this.schema = transactions
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Tạo transaction mới
   */
  async create(input: TTransactionInput): Promise<TTransaction> {
    const dbClient = await this.dbManager.getDBClient()
    const timestamp = getCurrentTimestamp()
    const result = await dbClient
      .insert(this.schema)
      .values({
        account_id: input.account_id,
        category_id: input.category_id || null,
        type: input.type,
        amount: input.amount,
        description: input.description || null,
        transaction_date: input.transaction_date,
        transaction_time: input.transaction_time,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning()
    return result[0] as TTransaction
  }

  /**
   * Lấy transaction theo ID
   */
  async getById(id: number): Promise<TTransaction | null> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, id))
      .limit(1)
    return (result[0] as TTransaction) || null
  }

  /**
   * Lấy tất cả transactions của account
   */
  async getByAccountId(accountId: number): Promise<TTransaction[]> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(eq(this.schema.account_id, accountId))
      .orderBy(desc(this.schema.transaction_date), desc(this.schema.transaction_time))
    return result as TTransaction[]
  }

  /**
   * Lấy transactions theo ngày
   */
  async getByDate(accountId: number, startDate: number, endDate: number): Promise<TTransaction[]> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select()
      .from(this.schema)
      .where(and(
        eq(this.schema.account_id, accountId),
        gte(this.schema.transaction_date, startDate),
        lte(this.schema.transaction_date, endDate)
      ))
      .orderBy(desc(this.schema.transaction_date), desc(this.schema.transaction_time))
    return result as TTransaction[]
  }

  /**
   * Cập nhật transaction
   */
  async update(input: TTransactionUpdate): Promise<TTransaction | null> {
    const dbClient = await this.dbManager.getDBClient()

    const updateData: any = {
      updated_at: getCurrentTimestamp(),
    }

    if (input.category_id !== undefined) {
      updateData.category_id = input.category_id
    }

    if (input.type !== undefined) {
      updateData.type = input.type
    }

    if (input.amount !== undefined) {
      updateData.amount = input.amount
    }

    if (input.description !== undefined) {
      updateData.description = input.description
    }

    if (input.transaction_date !== undefined) {
      updateData.transaction_date = input.transaction_date
    }

    if (input.transaction_time !== undefined) {
      updateData.transaction_time = input.transaction_time
    }

    await dbClient
      .update(this.schema)
      .set(updateData)
      .where(eq(this.schema.id, input.id))

    return this.getById(input.id)
  }

  /**
   * Xóa transaction
   */
  async delete(id: number): Promise<void> {
    const dbClient = await this.dbManager.getDBClient()
    await dbClient
      .delete(this.schema)
      .where(eq(this.schema.id, id))
  }

  /**
   * Đếm số lượng transactions của account
   */
  async countByAccountId(accountId: number): Promise<number> {
    const dbClient = await this.dbManager.getDBClient()
    const result = await dbClient
      .select({ count: count() })
      .from(this.schema)
      .where(eq(this.schema.account_id, accountId))
    return result[0]?.count || 0
  }
}
