import { DatabaseManager } from "./db-manager"

type TUserVersionRow = {
  user_version: number
}

/**
 * Class khởi tạo database schema
 */
export class DBInitializer {
  private dbManager: DatabaseManager

  constructor() {
    this.dbManager = DatabaseManager.getInstance()
  }

  private async isInitialized(): Promise<boolean> {
    const row = await this.dbManager.getFirst<TUserVersionRow>("PRAGMA user_version;")
    return (row?.user_version || 0) > 0
  }

  /**
   * Khởi tạo toàn bộ schema
   */
  public async initialize(): Promise<void> {
    if (await this.isInitialized()) {
      await this.dbManager.closeRawDBConnection()
      console.log(">>> ✅ Database schema already initialized")
      return
    }
    try {
      await this.createTables()
      await this.createIndexes()
      await this.createTriggers()
      await this.dbManager.closeRawDBConnection()
      console.log(">>> ✅ Database schema initialized successfully")
    } catch (error) {
      console.error(">>> ❌ Error initializing database schema:", error)
      throw error
    }
  }

  /**
   * Tạo tất cả tables
   */
  private async createTables(): Promise<void> {
    for (const tableSql of this.dbManager.getAllTableSQLCommands()) {
      await this.dbManager.executeQuery(tableSql)
    }
  }

  /**
   * Tạo indexes
   */
  private async createIndexes(): Promise<void> {
    for (const indexSql of this.dbManager.getAllIndexesSQLCommands()) {
      await this.dbManager.executeQuery(indexSql)
    }
  }

  /**
   * Tạo triggers
   */
  private async createTriggers(): Promise<void> {
    for (const triggerSql of this.dbManager.getAllTriggersSQLCommands()) {
      await this.dbManager.executeQuery(triggerSql)
    }
  }

  /**
   * Drop tất cả tables (CHỈ DÙNG CHO DEVELOPMENT)
   */
  public async dropAllTables(): Promise<void> {
    const tables = this.dbManager.getTableNames()

    for (const table of tables) {
      await this.dbManager.executeQuery(`DROP TABLE IF EXISTS ${table};`)
    }
  }

  public async dropAllIndexes(): Promise<void> {
    const indexes = this.dbManager.getAllIndexesSQLCommands()

    for (const indexSql of indexes) {
      // Giả sử câu lệnh tạo index có dạng: CREATE INDEX index_name ON table_name (...);
      const match = indexSql.match(/CREATE\s+INDEX\s+(\S+)\s+ON/i)
      if (match && match[1]) {
        const indexName = match[1]
        await this.dbManager.executeQuery(`DROP INDEX IF EXISTS ${indexName};`)
      }
    }
  }

  public async dropAllTriggers(): Promise<void> {
    const triggers = this.dbManager.getAllTriggersSQLCommands()

    for (const triggerSql of triggers) {
      // Giả sử câu lệnh tạo trigger có dạng: CREATE TRIGGER trigger_name ...
      const match = triggerSql.match(/CREATE\s+TRIGGER\s+(\S+)\s+/i)
      if (match && match[1]) {
        const triggerName = match[1]
        await this.dbManager.executeQuery(`DROP TRIGGER IF EXISTS ${triggerName};`)
      }
    }
  }

  public async dropDB(): Promise<void> {
    await this.dropAllTables()
    await this.dropAllIndexes()
    await this.dropAllTriggers()
    await this.dbManager.closeRawDBConnection()
    console.log(">>> ✅ Database dropped successfully")
  }
}
