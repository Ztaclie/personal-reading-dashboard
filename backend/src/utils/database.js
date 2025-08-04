const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { logger } = require("./logger");

// Database file path
const dbPath = path.join(__dirname, "../../data/reading_dashboard.db");

// Create database directory if it doesn't exist
const fs = require("fs");
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error("Error opening database:", err);
  } else {
    logger.info("Connected to SQLite database");
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  // Users table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) {
        logger.error("Error creating users table:", err);
      } else {
        logger.info("Users table ready");
      }
    }
  );

  // Books table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      author TEXT,
      cover_url TEXT,
      reading_url TEXT NOT NULL,
      current_chapter INTEGER DEFAULT 1,
      current_page INTEGER DEFAULT 1,
      total_chapters INTEGER,
      total_pages INTEGER,
      status TEXT DEFAULT 'reading',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `,
    (err) => {
      if (err) {
        logger.error("Error creating books table:", err);
      } else {
        logger.info("Books table ready");
      }
    }
  );
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get multiple rows
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  runQuery,
  getRow,
  getAll,
};
