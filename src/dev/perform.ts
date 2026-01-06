import { DatabaseBackup } from "@/configs/db/db-backup"
import { DatabaseManager } from "@/configs/db/db-manager"
import { initTables } from "@/configs/sql/sql-commands"
import { getCurrentTimestamp } from "@/utils/formatters"

/**
 * Xóa cột account_id trong bảng categories
 * SQLite không hỗ trợ DROP COLUMN trực tiếp, nên phải:
 * 1. Tạo bảng mới không có cột account_id
 * 2. Copy dữ liệu (trừ cột account_id)
 * 3. Xóa bảng cũ
 * 4. Rename bảng mới thành tên cũ
 */
const removeAccountIdFromCategoriesTable = async () => {
  try {
    const dbManager = DatabaseManager.getInstance()

    console.log(">>> Bắt đầu xóa cột account_id từ bảng categories...")

    // Bước 1: Tạo bảng mới không có cột account_id
    await dbManager.executeQuery(`
      CREATE TABLE IF NOT EXISTS categories_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        UNIQUE(name, type)
      );
    `)
    console.log(">>> ✅ Tạo bảng categories_new thành công")

    // Bước 2: Copy dữ liệu từ bảng cũ sang bảng mới (không bao gồm account_id)
    await dbManager.executeQuery(`
      INSERT INTO categories_new (id, name, type, created_at, updated_at)
      SELECT id, name, type, created_at, updated_at
      FROM categories;
    `)
    console.log(">>> ✅ Copy dữ liệu thành công")

    // Bước 3: Xóa bảng cũ
    await dbManager.executeQuery(`DROP TABLE IF EXISTS categories;`)
    console.log(">>> ✅ Xóa bảng categories cũ thành công")

    // Bước 4: Rename bảng mới thành tên cũ
    await dbManager.executeQuery(`ALTER TABLE categories_new RENAME TO categories;`)
    console.log(">>> ✅ Rename bảng thành công")

    console.log(">>> ✅ Hoàn thành xóa cột account_id từ bảng categories")

    await DatabaseBackup.exportDBFileToLocalServer()
    console.log(">>> ✅ Backup database thành công")
  } catch (error) {
    console.error(">>> ❌ Lỗi khi xóa cột account_id:", error)
    throw error
  }
}

/**
 * Thêm cột transaction_id vào bảng categories
 * SQLite hỗ trợ ADD COLUMN nhưng với ràng buộc phức tạp cần tạo lại bảng
 */
const addTransactionIdToCategoriesTable = async () => {
  try {
    const dbManager = DatabaseManager.getInstance()

    console.log(">>> Bắt đầu thêm cột transaction_id vào bảng categories...")

    // Bước 1: Tạo bảng mới với cột transaction_id
    await dbManager.executeQuery(`
      CREATE TABLE IF NOT EXISTS categories_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
        UNIQUE(name, type)
      );
    `)
    console.log(">>> ✅ Tạo bảng categories_new thành công")

    // Bước 2: Copy dữ liệu từ bảng cũ sang bảng mới (transaction_id sẽ là NULL)
    await dbManager.executeQuery(`
      INSERT INTO categories_new (id, name, type, created_at, updated_at, transaction_id)
      SELECT id, name, type, created_at, updated_at, NULL
      FROM categories;
    `)
    console.log(">>> ✅ Copy dữ liệu thành công")

    // Bước 3: Xóa bảng cũ
    await dbManager.executeQuery(`DROP TABLE IF EXISTS categories;`)
    console.log(">>> ✅ Xóa bảng categories cũ thành công")

    // Bước 4: Rename bảng mới thành tên cũ
    await dbManager.executeQuery(`ALTER TABLE categories_new RENAME TO categories;`)
    console.log(">>> ✅ Rename bảng thành công")

    // Bước 6: Tạo index cho transaction_id
    await dbManager.executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_categories_transaction_id ON categories(transaction_id);
    `)
    console.log(">>> ✅ Tạo index cho transaction_id thành công")

    console.log(">>> ✅ Hoàn thành thêm cột transaction_id vào bảng categories")

    await DatabaseBackup.exportDBFileToLocalServer()
    console.log(">>> ✅ Backup database thành công")
  } catch (error) {
    console.error(">>> ❌ Lỗi khi thêm cột transaction_id:", error)
    throw error
  }
}

/**
 * Thêm cột icon_path vào bảng categories
 * SQLite hỗ trợ ADD COLUMN nhưng với NOT NULL constraint cần có DEFAULT value
 */
const addIconPathToCategoriesTable = async () => {
  try {
    const dbManager = DatabaseManager.getInstance()

    console.log(">>> Bắt đầu thêm cột icon_path vào bảng categories...")

    // Bước 1: Tạo bảng mới với cột icon_path
    await dbManager.executeQuery(`
      CREATE TABLE IF NOT EXISTS categories_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER,
        name TEXT NOT NULL,
        icon_path TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
        UNIQUE(name, type)
      );
    `)
    console.log(">>> ✅ Tạo bảng categories_new thành công")

    // Bước 2: Copy dữ liệu từ bảng cũ sang bảng mới (icon_path sẽ là empty string)
    await dbManager.executeQuery(`
      INSERT INTO categories_new (id, transaction_id, name, type, created_at, updated_at, icon_path)
      SELECT id, transaction_id, name, type, created_at, updated_at, ''
      FROM categories;
    `)
    console.log(">>> ✅ Copy dữ liệu thành công")

    // Bước 3: Xóa bảng cũ
    await dbManager.executeQuery(`DROP TABLE IF EXISTS categories;`)
    console.log(">>> ✅ Xóa bảng categories cũ thành công")

    // Bước 4: Rename bảng mới thành tên cũ
    await dbManager.executeQuery(`ALTER TABLE categories_new RENAME TO categories;`)
    console.log(">>> ✅ Rename bảng thành công")

    // Bước 6: Tạo index cho transaction_id
    await dbManager.executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_categories_transaction_id ON categories(transaction_id);
    `)
    console.log(">>> ✅ Tạo index cho transaction_id thành công")

    console.log(">>> ✅ Hoàn thành thêm cột icon_path vào bảng categories")

    await DatabaseBackup.exportDBFileToLocalServer()
    console.log(">>> ✅ Backup database thành công")
  } catch (error) {
    console.error(">>> ❌ Lỗi khi thêm cột icon_path:", error)
    throw error
  }
}

/**
 * Thêm bảng active_account để lưu trữ tài khoản đang hoạt động
 * Bảng này chỉ chứa 1 dòng duy nhất (singleton pattern)
 */
const addActiveAccountTable = async () => {
  try {
    const dbManager = DatabaseManager.getInstance()

    console.log(">>> Bắt đầu tạo bảng active_account...")

    // Bước 1: Tạo bảng active_account
    await dbManager.executeQuery(initTables.active_account)
    console.log(">>> ✅ Tạo bảng active_account thành công")

    // Bước 3: Insert dòng đầu tiên với account_id từ dòng đầu tiên trong bảng accounts (nếu chưa có)
    await dbManager.executeQuery(`
      INSERT OR IGNORE INTO active_account (account_id)
      SELECT id FROM accounts ORDER BY id ASC LIMIT 1;
    `)
    console.log(">>> ✅ Insert dòng mặc định vào active_account thành công")

    console.log(">>> ✅ Hoàn thành tạo bảng active_account")

    await DatabaseBackup.exportDBFileToLocalServer()
    console.log(">>> ✅ Backup database thành công")
  } catch (error) {
    console.error(">>> ❌ Lỗi khi tạo bảng active_account:", error)
    throw error
  }
}

/**
 * Khởi tạo dữ liệu danh sách các danh mục mặc định trong DB
 */
const initCategoryRows = async () => {
  try {
    const dbManager = DatabaseManager.getInstance()
    const timestamp = getCurrentTimestamp()

    console.log(">>> Bắt đầu khởi tạo categories mặc định...")

    const categoriesData = [
      {
        name: "Ăn uống",
        icon_path: "images/icons/food-drinks-icon",
      },
      {
        name: "Mua sắm",
        icon_path: "images/icons/shopping-icon",
      },
    ]

    await dbManager.executeQuery(`DELETE FROM categories;`)
    console.log(">>> ✅ Xóa dữ liệu cũ trong bảng categories thành công")

    for (const category of categoriesData) {
      await dbManager.executeQuery(
        `
        INSERT OR IGNORE INTO categories (name, icon_path, created_at)
        VALUES (?, ?, ?);
      `,
        [category.name, category.icon_path, timestamp]
      )
      console.log(`>>> ✅ Insert category: ${category.name}`)
    }

    console.log(">>> ✅ Hoàn thành khởi tạo categories mặc định")

    await DatabaseBackup.exportDBFileToLocalServer()
    console.log(">>> ✅ Backup database thành công")
  } catch (error) {
    console.error(">>> ❌ Lỗi khi khởi tạo categories:", error)
    throw error
  }
}

/**
 * Xóa cột transaction_id từ bảng categories
 * SQLite không hỗ trợ DROP COLUMN trực tiếp, nên phải tạo lại bảng
 */
const removeTransactionIdFromCategoriesTable = async () => {
  try {
    const dbManager = DatabaseManager.getInstance()

    console.log(">>> Bắt đầu xóa cột transaction_id từ bảng categories...")

    // Bước 1: Tạo bảng mới không có cột transaction_id
    await dbManager.executeQuery(`
      CREATE TABLE IF NOT EXISTS categories_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon_path TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        UNIQUE(name)
      );
    `)
    console.log(">>> ✅ Tạo bảng categories_new thành công")

    // Bước 2: Copy dữ liệu từ bảng cũ sang bảng mới (không bao gồm transaction_id)
    await dbManager.executeQuery(`
      INSERT INTO categories_new (id, name, icon_path, created_at)
      SELECT id, name, icon_path, created_at
      FROM categories;
    `)
    console.log(">>> ✅ Copy dữ liệu thành công")

    // Bước 3: Xóa bảng cũ
    await dbManager.executeQuery(`DROP TABLE IF EXISTS categories;`)
    console.log(">>> ✅ Xóa bảng categories cũ thành công")

    // Bước 4: Rename bảng mới thành tên cũ
    await dbManager.executeQuery(`ALTER TABLE categories_new RENAME TO categories;`)
    console.log(">>> ✅ Rename bảng thành công")

    console.log(">>> ✅ Hoàn thành xóa cột transaction_id từ bảng categories")

    await DatabaseBackup.exportDBFileToLocalServer()
    console.log(">>> ✅ Backup database thành công")
  } catch (error) {
    console.error(">>> ❌ Lỗi khi xóa cột transaction_id:", error)
    throw error
  }
}

export const doTest = async () => {
  // await removeAccountIdFromCategoriesTable()
  // await addTransactionIdToCategoriesTable()
  // await addActiveAccountTable()
  // await addIconPathToCategoriesTable()
  await initCategoryRows()
  // await removeTransactionIdFromCategoriesTable()
}
