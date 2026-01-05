import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

// Định nghĩa bảng 'accounts'
export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
})

// Định nghĩa bảng 'account_settings'
export const accountSettings = sqliteTable("account_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  account_id: integer("account_id").notNull().unique(),
  theme_mode: text("theme_mode").notNull(),
  currency: text("currency").notNull(),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
})

// Định nghĩa bảng 'app_settings'
export const appSettings = sqliteTable("app_settings", {
  id: integer("id").primaryKey(),
  language: text("language").notNull(),
  app_password: text("app_password"),
  is_password_enabled: integer("is_password_enabled").notNull(),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
})

// Định nghĩa bảng 'categories'
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  account_id: integer("account_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
})

// Định nghĩa bảng 'transactions'
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  account_id: integer("account_id").notNull(),
  category_id: integer("category_id"),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  description: text("description"),
  transaction_date: integer("transaction_date").notNull(),
  transaction_time: text("transaction_time").notNull(),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
})
