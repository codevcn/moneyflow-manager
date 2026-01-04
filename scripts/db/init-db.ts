import Database from "better-sqlite3"
import * as fs from "fs"
import * as path from "path"

/**
 * ============================================================
 * STANDALONE DATABASE INITIALIZATION SCRIPT
 * ============================================================
 *
 * File này hoàn toàn độc lập, không phụ thuộc vào bất kỳ code nào khác.
 * Tất cả logic được viết inline trong file này.
 *
 * Cách chạy:
 * npm install better-sqlite3
 * npx tsx scripts/db/init-db.ts
 *
 * ============================================================
 */

// ============================================================
// DATABASE MANAGER (Inline Implementation)
// ============================================================
class StandaloneDatabaseManager {
  private static instance: StandaloneDatabaseManager | null = null
  private db: Database.Database | null = null
  private readonly DB_NAME = "db/moneyflow.db"

  private constructor() {}

  static getInstance(): StandaloneDatabaseManager {
    if (!StandaloneDatabaseManager.instance) {
      StandaloneDatabaseManager.instance = new StandaloneDatabaseManager()
    }
    return StandaloneDatabaseManager.instance
  }

  getConnection(): Database.Database {
    if (!this.db) {
      this.db = new Database(this.DB_NAME)
      this.db.pragma("foreign_keys = ON")
    }
    return this.db
  }

  executeQuery(sql: string, params?: any[]): any {
    const db = this.getConnection()
    if (params && params.length > 0) {
      return db.prepare(sql).run(...params)
    }
    return db.exec(sql)
  }

  getFirst<T>(sql: string, params?: any[]): T | undefined {
    const db = this.getConnection()
    if (params && params.length > 0) {
      return db.prepare(sql).get(...params) as T | undefined
    }
    return db.prepare(sql).get() as T | undefined
  }

  getAll<T>(sql: string, params?: any[]): T[] {
    const db = this.getConnection()
    if (params && params.length > 0) {
      return db.prepare(sql).all(...params) as T[]
    }
    return db.prepare(sql).all() as T[]
  }

  closeConnection(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// ============================================================
// SQL FILE LOADER (Node.js Implementation)
// ============================================================
function readSQLFile(relativePath: string): string {
  const projectRoot = path.join(__dirname, "..", "..")
  const sqlPath = path.join(projectRoot, "src", "configs", "sql", relativePath)

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`SQL file not found: ${sqlPath}`)
  }

  return fs.readFileSync(sqlPath, "utf-8")
}

function splitSQL(sql: string): string[] {
  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s + ";")
}

// ============================================================
// DATABASE INITIALIZER (Inline Implementation)
// ============================================================
class StandaloneDBInitializer {
  private dbManager: StandaloneDatabaseManager

  constructor() {
    this.dbManager = StandaloneDatabaseManager.getInstance()
  }

  initialize(): void {
    try {
      console.log("📦 Starting database initialization...")

      this.createTables()
      this.createIndexes()
      this.createTriggers()

      console.log("✅ Database schema initialized successfully")
    } catch (error) {
      console.error("❌ Error initializing database schema:", error)
      throw error
    }
  }

  private createTables(): void {
    console.log("  📝 Creating tables...")

    const tableFiles = [
      "tables/accounts.sql",
      "tables/categories.sql",
      "tables/transactions.sql",
      "tables/account_settings.sql",
      "tables/app_settings.sql",
    ]

    for (const file of tableFiles) {
      const sql = readSQLFile(file)
      this.dbManager.executeQuery(sql)
    }
  }

  private createIndexes(): void {
    console.log("  🔍 Creating indexes...")

    const indexFiles = [
      "indexes/transactions_indexes.sql",
      "indexes/categories_indexes.sql",
      "indexes/account_settings_indexes.sql",
    ]

    for (const file of indexFiles) {
      const sql = readSQLFile(file)
      const statements = splitSQL(sql)

      for (const statement of statements) {
        this.dbManager.executeQuery(statement)
      }
    }
  }

  private createTriggers(): void {
    console.log("  ⚡ Creating triggers...")

    const triggerFiles = [
      "triggers/accounts_triggers.sql",
      "triggers/transactions_triggers.sql",
      "triggers/categories_triggers.sql",
      "triggers/account_settings_triggers.sql",
      "triggers/app_settings_triggers.sql",
    ]

    for (const file of triggerFiles) {
      const sql = readSQLFile(file)
      this.dbManager.executeQuery(sql)
    }
  }

  dropAllTables(): void {
    console.log("🗑️  Dropping all tables...")

    const tables = ["transactions", "categories", "account_settings", "accounts", "app_settings"]

    for (const table of tables) {
      this.dbManager.executeQuery(`DROP TABLE IF EXISTS ${table};`)
      console.log(`  ✓ Dropped table: ${table}`)
    }
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const dbInitializer = new StandaloneDBInitializer()
const dbManager = StandaloneDatabaseManager.getInstance()

/**
 * Khởi tạo database lần đầu
 */
function manualInitDatabase(): void {
  try {
    console.log("🔧 Starting manual database initialization...")
    dbInitializer.initialize()
    console.log("✅ Database initialized successfully!")
  } catch (error) {
    console.error("❌ Failed to initialize database:", error)
    throw error
  }
}

/**
 * Reset database (XÓA TOÀN BỘ DỮ LIỆU)
 */
function manualResetDatabase(): void {
  try {
    console.log("⚠️  Starting database reset...")
    console.log("⚠️  WARNING: This will delete all data!")
    dbInitializer.dropAllTables()
    console.log("✅ Database reset successfully!")
  } catch (error) {
    console.error("❌ Failed to reset database:", error)
    throw error
  }
}

/**
 * Seed dữ liệu mẫu
 */
function seedSampleData(): void {
  try {
    console.log("🌱 Seeding sample data...")

    // Tạo account mẫu
    dbManager.executeQuery("INSERT INTO accounts (name, description) VALUES (?, ?)", [
      "Tài khoản chính",
      "Tài khoản mặc định để test",
    ])
    console.log("✅ Created sample account")

    // Tạo account settings mẫu
    dbManager.executeQuery(
      "INSERT INTO account_settings (account_id, theme_mode, currency) VALUES (?, ?, ?)",
      [1, "light", "VND"]
    )
    console.log("✅ Created sample account settings")

    // Tạo categories mẫu
    const categories = [
      [1, "Ăn uống", "expense"],
      [1, "Mua sắm", "expense"],
      [1, "Lương", "income"],
      [1, "Thưởng", "income"],
    ]

    for (const [accountId, name, type] of categories) {
      dbManager.executeQuery("INSERT INTO categories (account_id, name, type) VALUES (?, ?, ?)", [
        accountId,
        name,
        type,
      ])
    }
    console.log("✅ Created sample categories")

    // Tạo transactions mẫu
    const now = Math.floor(Date.now() / 1000)
    const transactions = [
      [1, 1, "expense", 50000, "Ăn trưa", now, "12:30:00"],
      [1, 3, "income", 15000000, "Lương tháng 1", now, "09:00:00"],
      [1, 2, "expense", 200000, "Mua quần áo", now - 86400, "15:45:00"],
    ]

    for (const [accountId, categoryId, type, amount, description, date, time] of transactions) {
      dbManager.executeQuery(
        "INSERT INTO transactions (account_id, category_id, type, amount, description, transaction_date, transaction_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [accountId, categoryId, type, amount, description, date, time]
      )
    }
    console.log("✅ Created sample transactions")

    console.log("✅ Sample data seeded successfully!")
  } catch (error) {
    console.error("❌ Failed to seed sample data:", error)
    throw error
  }
}

/**
 * Kiểm tra trạng thái database
 */
function checkDatabaseStatus(): void {
  try {
    console.log("📊 Checking database status...")

    const tables = ["accounts", "categories", "transactions", "account_settings", "app_settings"]

    for (const table of tables) {
      const result = dbManager.getFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${table}`
      )
      console.log(`  - ${table}: ${result?.count || 0} records`)
    }

    const integrityResult = dbManager.getFirst<{ integrity_check: string }>(
      "PRAGMA integrity_check"
    )
    console.log(`  - Integrity: ${integrityResult?.integrity_check || "unknown"}`)

    console.log("✅ Database status check completed!")
  } catch (error) {
    console.error("❌ Failed to check database status:", error)
    throw error
  }
}

// ============================================================
// MAIN EXECUTION
// ============================================================
function main() {
  try {
    // Uncomment dòng bạn muốn chạy:

    // Khởi tạo database lần đầu
    manualInitDatabase()

    // Reset database (XÓA TOÀN BỘ DỮ LIỆU)
    // manualResetDatabase()

    // Kiểm tra trạng thái database
    // checkDatabaseStatus()

    // Seed dữ liệu mẫu (chạy sau khi init)
    // seedSampleData()

    // Đóng database connection
    dbManager.closeConnection()
    console.log("👋 Closed database connection")

    process.exit(0)
  } catch (error) {
    console.error("💥 Script failed:", error)
    dbManager.closeConnection()
    process.exit(1)
  }
}

// Chạy script nếu file được execute trực tiếp
if (require.main === module) {
  main()
}
