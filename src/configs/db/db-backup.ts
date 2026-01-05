import * as FileSystem from "expo-file-system/legacy"
import { DatabaseManager } from "./db-manager"

type TBackupData = {
  version: string
  exportDate: string
  data: {
    accounts: any[]
    transactions: any[]
    categories: any[]
    accountSettings: any[]
    appSettings: any
  }
}

/**
 * Class xử lý backup và restore database
 */
export class DatabaseBackup {
  private dbManager: DatabaseManager
  private static readonly VERSION = "1.0.0"
  public static localServerEndpoint = "http://192.168.2.6:8000/db-export/"

  constructor() {
    this.dbManager = DatabaseManager.getInstance()
  }

  /**
   * Export database sang JSON
   */
  public async exportToJSON(): Promise<string> {
    try {
      const accounts = await this.dbManager.getAll("SELECT * FROM accounts")
      const transactions = await this.dbManager.getAll("SELECT * FROM transactions")
      const categories = await this.dbManager.getAll("SELECT * FROM categories")
      const accountSettings = await this.dbManager.getAll("SELECT * FROM account_settings")
      const appSettings = await this.dbManager.getFirst("SELECT * FROM app_settings WHERE id = 1")

      const exportData: TBackupData = {
        version: DatabaseBackup.VERSION,
        exportDate: new Date().toISOString(),
        data: {
          accounts,
          transactions,
          categories,
          accountSettings,
          appSettings: appSettings || {},
        },
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error("Error exporting database:", error)
      throw new Error("Failed to export database")
    }
  }

  /**
   * Import database từ JSON
   */
  public async importFromJSON(jsonString: string): Promise<void> {
    try {
      const importData: TBackupData = JSON.parse(jsonString)
      this.validateImportData(importData)

      await this.dbManager.executeQuery("BEGIN TRANSACTION;")

      try {
        await this.clearExistingData()
        await this.importAccounts(importData.data.accounts)
        await this.importCategories(importData.data.categories)
        await this.importTransactions(importData.data.transactions)
        await this.importAccountSettings(importData.data.accountSettings)
        await this.importAppSettings(importData.data.appSettings)

        await this.dbManager.executeQuery("COMMIT;")
        console.log("✅ Database imported successfully")
      } catch (error) {
        await this.dbManager.executeQuery("ROLLBACK;")
        throw error
      }
    } catch (error) {
      console.error("❌ Error importing database:", error)
      throw new Error("Failed to import database")
    }
  }

  /**
   * Validate import data structure
   */
  private validateImportData(data: any): void {
    if (!data.version || !data.data) {
      throw new Error("Invalid backup file format")
    }

    if (data.version !== DatabaseBackup.VERSION) {
      console.warn(`Backup version mismatch: ${data.version} vs ${DatabaseBackup.VERSION}`)
    }
  }

  /**
   * Clear existing data
   */
  private async clearExistingData(): Promise<void> {
    await this.dbManager.executeQuery("DELETE FROM transactions;")
    await this.dbManager.executeQuery("DELETE FROM categories;")
    await this.dbManager.executeQuery("DELETE FROM account_settings;")
    await this.dbManager.executeQuery("DELETE FROM accounts;")
  }

  /**
   * Import accounts
   */
  private async importAccounts(accounts: any[]): Promise<void> {
    if (!accounts || accounts.length === 0) return

    for (const account of accounts) {
      await this.dbManager.executeQuery(
        "INSERT INTO accounts (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        [account.id, account.name, account.description, account.created_at, account.updated_at]
      )
    }
  }

  /**
   * Import categories
   */
  private async importCategories(categories: any[]): Promise<void> {
    if (!categories || categories.length === 0) return

    for (const category of categories) {
      await this.dbManager.executeQuery(
        "INSERT INTO categories (id, account_id, name, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          category.id,
          category.account_id,
          category.name,
          category.type,
          category.created_at,
          category.updated_at,
        ]
      )
    }
  }

  /**
   * Import transactions
   */
  private async importTransactions(transactions: any[]): Promise<void> {
    if (!transactions || transactions.length === 0) return

    for (const transaction of transactions) {
      await this.dbManager.executeQuery(
        "INSERT INTO transactions (id, account_id, category_id, type, amount, description, transaction_date, transaction_time, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          transaction.id,
          transaction.account_id,
          transaction.category_id,
          transaction.type,
          transaction.amount,
          transaction.description,
          transaction.transaction_date,
          transaction.transaction_time,
          transaction.created_at,
          transaction.updated_at,
        ]
      )
    }
  }

  /**
   * Import account settings
   */
  private async importAccountSettings(accountSettings: any[]): Promise<void> {
    if (!accountSettings || accountSettings.length === 0) return

    for (const setting of accountSettings) {
      await this.dbManager.executeQuery(
        "INSERT INTO account_settings (id, account_id, theme_mode, currency, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          setting.id,
          setting.account_id,
          setting.theme_mode,
          setting.currency,
          setting.created_at,
          setting.updated_at,
        ]
      )
    }
  }

  /**
   * Import app settings
   */
  private async importAppSettings(appSettings: any): Promise<void> {
    if (!appSettings) return

    await this.dbManager.executeQuery(
      "UPDATE app_settings SET language = ?, app_password = ?, is_password_enabled = ?, updated_at = ? WHERE id = 1",
      [
        appSettings.language,
        appSettings.app_password,
        appSettings.is_password_enabled,
        appSettings.updated_at,
      ]
    )
  }

  /**
   * Export file .db vật lý để debug trên máy tính
   * @param dbName Tên file database (mặc định là moneyflow.db)
   */
  public static async exportDBFileToLocalServer(): Promise<void> {
    const dbDir = FileSystem.documentDirectory + "SQLite/"
    const dbUri = dbDir + DatabaseManager.getDBName()

    try {
      const fileInfo = await FileSystem.getInfoAsync(dbUri)
      if (!fileInfo.exists) {
        console.warn(`>>> [Debug] Database file not found at: ${dbUri}`)
        throw new Error("Database file not found")
      }

      console.log(`>>> [Debug] Uploading database file from: ${dbUri}`)
      console.log(`>>> [Debug] File size: ${fileInfo.size} bytes`)

      const uploadResult = await FileSystem.uploadAsync(DatabaseBackup.localServerEndpoint, dbUri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        mimeType: "application/octet-stream",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (uploadResult.status === 200) {
        console.log(`>>> [Debug] Database file uploaded successfully: ${uploadResult.body}`)
      } else {
        console.error(`>>> [Debug] Upload failed with status: ${uploadResult.status}`)
        throw new Error(`Upload failed: ${uploadResult.status}`)
      }
    } catch (error) {
      console.error(">>> [Debug] Error exporting database file:", error)
      throw error
    }
  }
}
