import { drizzle } from "drizzle-orm/expo-sqlite"
import * as SQLite from "expo-sqlite"
import { initIndexes, initTables, initTriggers } from "../sql/sql-commands"

type TDBClient = ReturnType<typeof drizzle>

/**
 * Singleton class quản lý database connection
 */
export class DatabaseManager {
  private static instance: DatabaseManager
  private static readonly DB_NAME = "moneyflow.db"
  private dbClient: TDBClient | null = null
  private rawDB: SQLite.SQLiteDatabase | null = null

  constructor() {}

  public static getDBName(): string {
    return DatabaseManager.DB_NAME
  }

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

  public getRawDbInstance(): SQLite.SQLiteDatabase | null {
    return this.rawDB
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

  private async initRawDBConnection(): Promise<SQLite.SQLiteDatabase> {
    if (!this.rawDB) {
      try {
        this.rawDB = await SQLite.openDatabaseAsync(DatabaseManager.DB_NAME)
      } catch (error) {
        console.error("Error opening database:", error)
        throw error
      }
    }
    return this.rawDB
  }

  /**
   * 2. Lấy Drizzle Client (Sử dụng lại kết nối rawDB)
   */
  public async getDBClient(): Promise<TDBClient> {
    if (!this.dbClient) {
      // Đảm bảo rawDB đã có trước
      const sqliteDb = await this.initRawDBConnection()
      // Truyền rawDB vào drizzle
      this.dbClient = drizzle(sqliteDb)
    }
    return this.dbClient
  }

  /**
   * Đóng kết nối database
   */
  public async closeRawDBConnection(): Promise<void> {
    if (this.rawDB) {
      await this.rawDB.closeAsync()
      this.rawDB = null
    }
  }

  /**
   * Execute raw SQL query
   */
  public async executeQuery(sql: string, params?: any[]): Promise<any> {
    const rawDB = await this.initRawDBConnection()
    if (params) {
      return await rawDB.runAsync(sql, params)
    }
    return await rawDB.execAsync(sql)
  }

  /**
   * Get first result
   */
  public async getFirst<T>(sql: string, params?: any[]): Promise<T | null> {
    const rawDB = await this.initRawDBConnection()
    if (params) {
      return await rawDB.getFirstAsync<T>(sql, params)
    }
    return await rawDB.getFirstAsync<T>(sql)
  }

  /**
   * Get all results
   */
  public async getAll<T>(sql: string, params?: any[]): Promise<T[]> {
    const rawDB = await this.initRawDBConnection()
    if (params) {
      return await rawDB.getAllAsync<T>(sql, params)
    }
    return await rawDB.getAllAsync<T>(sql)
  }
}
