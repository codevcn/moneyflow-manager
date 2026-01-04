import * as SQLite from "expo-sqlite"
import { initIndexes, initTables, initTriggers } from "../sql/sql-commands"

/**
 * Singleton class quản lý database connection
 */
export class DatabaseManager {
  private static instance: DatabaseManager
  private static readonly DB_NAME = "moneyflow.db"
  private db: SQLite.SQLiteDatabase | null = null

  private constructor() {}

  public getAllTableSQLCommands(): string[] {
    return Object.values(initTables)
  }

  public getAllIndexesSQLCommands(): string[] {
    return Object.values(initIndexes)
  }

  public getAllTriggersSQLCommands(): string[] {
    return Object.values(initTriggers)
  }

  public getTableNames(): string[] {
    return Object.keys(initTables)
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  /**
   * Mở kết nối database
   */
  public async getConnection(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      try {
        this.db = await SQLite.openDatabaseAsync(DatabaseManager.DB_NAME)
        await this.enableForeignKeys()
      } catch (error) {
        console.error("Error opening database:", error)
        throw error
      }
    }
    return this.db
  }

  /**
   * Enable foreign keys constraint
   */
  private async enableForeignKeys(): Promise<void> {
    if (this.db) {
      await this.db.execAsync("PRAGMA foreign_keys = ON;")
    }
  }

  /**
   * Đóng kết nối database
   */
  public async closeConnection(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync()
      this.db = null
    }
  }

  /**
   * Execute raw SQL query
   */
  public async executeQuery(sql: string, params?: any[]): Promise<any> {
    const db = await this.getConnection()
    if (params) {
      return await db.runAsync(sql, params)
    }
    return await db.execAsync(sql)
  }

  /**
   * Get first result
   */
  public async getFirst<T>(sql: string, params?: any[]): Promise<T | null> {
    const db = await this.getConnection()
    if (params) {
      return await db.getFirstAsync<T>(sql, params)
    }
    return await db.getFirstAsync<T>(sql)
  }

  /**
   * Get all results
   */
  public async getAll<T>(sql: string, params?: any[]): Promise<T[]> {
    const db = await this.getConnection()
    if (params) {
      return await db.getAllAsync<T>(sql, params)
    }
    return await db.getAllAsync<T>(sql)
  }
}
