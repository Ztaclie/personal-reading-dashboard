const bcrypt = require("bcrypt");
const { runQuery, getRow } = require("../utils/database");
const { logger } = require("../utils/logger");

class User {
  static async create(username, email, password) {
    try {
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert user
      const result = await runQuery(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, passwordHash]
      );

      return { id: result.id, username, email };
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      return await getRow("SELECT * FROM users WHERE email = ?", [email]);
    } catch (error) {
      logger.error("Error finding user by email:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await getRow(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
        [id]
      );
    } catch (error) {
      logger.error("Error finding user by id:", error);
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      return await getRow("SELECT * FROM users WHERE username = ?", [username]);
    } catch (error) {
      logger.error("Error finding user by username:", error);
      throw error;
    }
  }

  static async verifyPassword(password, passwordHash) {
    try {
      return await bcrypt.compare(password, passwordHash);
    } catch (error) {
      logger.error("Error verifying password:", error);
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    try {
      await runQuery(
        "UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [userId]
      );
    } catch (error) {
      logger.error("Error updating last login:", error);
      throw error;
    }
  }
}

module.exports = User;
