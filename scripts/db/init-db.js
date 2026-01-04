"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var better_sqlite3_1 = __importDefault(require("better-sqlite3"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
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
var StandaloneDatabaseManager = /** @class */ (function () {
    function StandaloneDatabaseManager() {
        this.db = null;
        this.DB_NAME = "db/moneyflow.db";
    }
    StandaloneDatabaseManager.getInstance = function () {
        if (!StandaloneDatabaseManager.instance) {
            StandaloneDatabaseManager.instance = new StandaloneDatabaseManager();
        }
        return StandaloneDatabaseManager.instance;
    };
    StandaloneDatabaseManager.prototype.getConnection = function () {
        if (!this.db) {
            this.db = new better_sqlite3_1.default(this.DB_NAME);
            this.db.pragma("foreign_keys = ON");
        }
        return this.db;
    };
    StandaloneDatabaseManager.prototype.executeQuery = function (sql, params) {
        var _a;
        var db = this.getConnection();
        if (params && params.length > 0) {
            return (_a = db.prepare(sql)).run.apply(_a, params);
        }
        return db.exec(sql);
    };
    StandaloneDatabaseManager.prototype.getFirst = function (sql, params) {
        var _a;
        var db = this.getConnection();
        if (params && params.length > 0) {
            return (_a = db.prepare(sql)).get.apply(_a, params);
        }
        return db.prepare(sql).get();
    };
    StandaloneDatabaseManager.prototype.getAll = function (sql, params) {
        var _a;
        var db = this.getConnection();
        if (params && params.length > 0) {
            return (_a = db.prepare(sql)).all.apply(_a, params);
        }
        return db.prepare(sql).all();
    };
    StandaloneDatabaseManager.prototype.closeConnection = function () {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    };
    StandaloneDatabaseManager.instance = null;
    return StandaloneDatabaseManager;
}());
// ============================================================
// SQL FILE LOADER (Node.js Implementation)
// ============================================================
function readSQLFile(relativePath) {
    var projectRoot = path.join(__dirname, "..", "..");
    var sqlPath = path.join(projectRoot, "src", "configs", "sql", relativePath);
    if (!fs.existsSync(sqlPath)) {
        throw new Error("SQL file not found: ".concat(sqlPath));
    }
    return fs.readFileSync(sqlPath, "utf-8");
}
function splitSQL(sql) {
    return sql
        .split(";")
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return s.length > 0; })
        .map(function (s) { return s + ";"; });
}
// ============================================================
// DATABASE INITIALIZER (Inline Implementation)
// ============================================================
var StandaloneDBInitializer = /** @class */ (function () {
    function StandaloneDBInitializer() {
        this.dbManager = StandaloneDatabaseManager.getInstance();
    }
    StandaloneDBInitializer.prototype.initialize = function () {
        try {
            console.log("📦 Starting database initialization...");
            this.createTables();
            this.createIndexes();
            this.createTriggers();
            console.log("✅ Database schema initialized successfully");
        }
        catch (error) {
            console.error("❌ Error initializing database schema:", error);
            throw error;
        }
    };
    StandaloneDBInitializer.prototype.createTables = function () {
        console.log("  📝 Creating tables...");
        var tableFiles = [
            "tables/accounts.sql",
            "tables/categories.sql",
            "tables/transactions.sql",
            "tables/account_settings.sql",
            "tables/app_settings.sql",
        ];
        for (var _i = 0, tableFiles_1 = tableFiles; _i < tableFiles_1.length; _i++) {
            var file = tableFiles_1[_i];
            var sql = readSQLFile(file);
            this.dbManager.executeQuery(sql);
        }
    };
    StandaloneDBInitializer.prototype.createIndexes = function () {
        console.log("  🔍 Creating indexes...");
        var indexFiles = [
            "indexes/transactions_indexes.sql",
            "indexes/categories_indexes.sql",
            "indexes/account_settings_indexes.sql",
        ];
        for (var _i = 0, indexFiles_1 = indexFiles; _i < indexFiles_1.length; _i++) {
            var file = indexFiles_1[_i];
            var sql = readSQLFile(file);
            var statements = splitSQL(sql);
            for (var _a = 0, statements_1 = statements; _a < statements_1.length; _a++) {
                var statement = statements_1[_a];
                this.dbManager.executeQuery(statement);
            }
        }
    };
    StandaloneDBInitializer.prototype.createTriggers = function () {
        console.log("  ⚡ Creating triggers...");
        var triggerFiles = [
            "triggers/accounts_triggers.sql",
            "triggers/transactions_triggers.sql",
            "triggers/categories_triggers.sql",
            "triggers/account_settings_triggers.sql",
            "triggers/app_settings_triggers.sql",
        ];
        for (var _i = 0, triggerFiles_1 = triggerFiles; _i < triggerFiles_1.length; _i++) {
            var file = triggerFiles_1[_i];
            var sql = readSQLFile(file);
            this.dbManager.executeQuery(sql);
        }
    };
    StandaloneDBInitializer.prototype.dropAllTables = function () {
        console.log("🗑️  Dropping all tables...");
        var tables = ["transactions", "categories", "account_settings", "accounts", "app_settings"];
        for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
            var table = tables_1[_i];
            this.dbManager.executeQuery("DROP TABLE IF EXISTS ".concat(table, ";"));
            console.log("  \u2713 Dropped table: ".concat(table));
        }
    };
    return StandaloneDBInitializer;
}());
// ============================================================
// UTILITY FUNCTIONS
// ============================================================
var dbInitializer = new StandaloneDBInitializer();
var dbManager = StandaloneDatabaseManager.getInstance();
/**
 * Khởi tạo database lần đầu
 */
function manualInitDatabase() {
    try {
        console.log("🔧 Starting manual database initialization...");
        dbInitializer.initialize();
        console.log("✅ Database initialized successfully!");
    }
    catch (error) {
        console.error("❌ Failed to initialize database:", error);
        throw error;
    }
}
/**
 * Reset database (XÓA TOÀN BỘ DỮ LIỆU)
 */
function manualResetDatabase() {
    try {
        console.log("⚠️  Starting database reset...");
        console.log("⚠️  WARNING: This will delete all data!");
        dbInitializer.dropAllTables();
        console.log("✅ Database reset successfully!");
    }
    catch (error) {
        console.error("❌ Failed to reset database:", error);
        throw error;
    }
}
/**
 * Seed dữ liệu mẫu
 */
function seedSampleData() {
    try {
        console.log("🌱 Seeding sample data...");
        // Tạo account mẫu
        dbManager.executeQuery("INSERT INTO accounts (name, description) VALUES (?, ?)", [
            "Tài khoản chính",
            "Tài khoản mặc định để test",
        ]);
        console.log("✅ Created sample account");
        // Tạo account settings mẫu
        dbManager.executeQuery("INSERT INTO account_settings (account_id, theme_mode, currency) VALUES (?, ?, ?)", [1, "light", "VND"]);
        console.log("✅ Created sample account settings");
        // Tạo categories mẫu
        var categories = [
            [1, "Ăn uống", "expense"],
            [1, "Mua sắm", "expense"],
            [1, "Lương", "income"],
            [1, "Thưởng", "income"],
        ];
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var _a = categories_1[_i], accountId = _a[0], name_1 = _a[1], type = _a[2];
            dbManager.executeQuery("INSERT INTO categories (account_id, name, type) VALUES (?, ?, ?)", [
                accountId,
                name_1,
                type,
            ]);
        }
        console.log("✅ Created sample categories");
        // Tạo transactions mẫu
        var now = Math.floor(Date.now() / 1000);
        var transactions = [
            [1, 1, "expense", 50000, "Ăn trưa", now, "12:30:00"],
            [1, 3, "income", 15000000, "Lương tháng 1", now, "09:00:00"],
            [1, 2, "expense", 200000, "Mua quần áo", now - 86400, "15:45:00"],
        ];
        for (var _b = 0, transactions_1 = transactions; _b < transactions_1.length; _b++) {
            var _c = transactions_1[_b], accountId = _c[0], categoryId = _c[1], type = _c[2], amount = _c[3], description = _c[4], date = _c[5], time = _c[6];
            dbManager.executeQuery("INSERT INTO transactions (account_id, category_id, type, amount, description, transaction_date, transaction_time) VALUES (?, ?, ?, ?, ?, ?, ?)", [accountId, categoryId, type, amount, description, date, time]);
        }
        console.log("✅ Created sample transactions");
        console.log("✅ Sample data seeded successfully!");
    }
    catch (error) {
        console.error("❌ Failed to seed sample data:", error);
        throw error;
    }
}
/**
 * Kiểm tra trạng thái database
 */
function checkDatabaseStatus() {
    try {
        console.log("📊 Checking database status...");
        var tables = ["accounts", "categories", "transactions", "account_settings", "app_settings"];
        for (var _i = 0, tables_2 = tables; _i < tables_2.length; _i++) {
            var table = tables_2[_i];
            var result = dbManager.getFirst("SELECT COUNT(*) as count FROM ".concat(table));
            console.log("  - ".concat(table, ": ").concat((result === null || result === void 0 ? void 0 : result.count) || 0, " records"));
        }
        var integrityResult = dbManager.getFirst("PRAGMA integrity_check");
        console.log("  - Integrity: ".concat((integrityResult === null || integrityResult === void 0 ? void 0 : integrityResult.integrity_check) || "unknown"));
        console.log("✅ Database status check completed!");
    }
    catch (error) {
        console.error("❌ Failed to check database status:", error);
        throw error;
    }
}
// ============================================================
// MAIN EXECUTION
// ============================================================
function main() {
    try {
        // Uncomment dòng bạn muốn chạy:
        // Khởi tạo database lần đầu
        manualInitDatabase();
        // Reset database (XÓA TOÀN BỘ DỮ LIỆU)
        // manualResetDatabase()
        // Kiểm tra trạng thái database
        // checkDatabaseStatus()
        // Seed dữ liệu mẫu (chạy sau khi init)
        // seedSampleData()
        // Đóng database connection
        dbManager.closeConnection();
        console.log("👋 Closed database connection");
        process.exit(0);
    }
    catch (error) {
        console.error("💥 Script failed:", error);
        dbManager.closeConnection();
        process.exit(1);
    }
}
// Chạy script nếu file được execute trực tiếp
if (require.main === module) {
    main();
}
