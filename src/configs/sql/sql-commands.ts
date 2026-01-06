// tên của các field phải trùng với tên các table trong DB (có gạch dưới)
export const initTables = {
  accounts: `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `,
  account_settings: `
    CREATE TABLE IF NOT EXISTS account_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL UNIQUE,
      theme_mode TEXT NOT NULL DEFAULT 'light' CHECK(theme_mode IN ('light', 'dark')),
      currency TEXT NOT NULL DEFAULT 'VND',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );
  `,
  app_settings: `
    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      language TEXT NOT NULL DEFAULT 'vi',
      app_password TEXT,
      is_password_enabled INTEGER NOT NULL DEFAULT 0 CHECK(is_password_enabled IN (0, 1)),
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `,
  categories: `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon_path TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      UNIQUE(name)
    );
  `,
  transactions: `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      category_id INTEGER,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL CHECK(amount > 0),
      description TEXT,
      transaction_date INTEGER NOT NULL,
      transaction_time TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `,
  active_account: `
    CREATE TABLE IF NOT EXISTS active_account (
      account_id INTEGER PRIMARY KEY NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );
  `,
} as const

export const initIndexes = {
  transactionsIndexes: `
    CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
  `,
  accountSettingsIndexes: `
    CREATE INDEX IF NOT EXISTS idx_account_settings_account_id ON account_settings(account_id);
  `,
} as const

export const initTriggers = {
  accountsTriggers: `
    CREATE TRIGGER IF NOT EXISTS update_accounts_timestamp
    AFTER UPDATE ON accounts
    FOR EACH ROW
    BEGIN
      UPDATE accounts SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
    END;
  `,
  transactionsTriggers: `
    CREATE TRIGGER IF NOT EXISTS update_transactions_timestamp
    AFTER UPDATE ON transactions
    FOR EACH ROW
    BEGIN
      UPDATE transactions SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
    END;
  `,
  activeAccountTriggers: `
    CREATE TRIGGER IF NOT EXISTS update_active_account_timestamp
    AFTER UPDATE ON active_account
    FOR EACH ROW
    BEGIN
      UPDATE active_account SET updated_at = strftime('%s', 'now') WHERE account_id = NEW.account_id;
    END;
  `,
}
