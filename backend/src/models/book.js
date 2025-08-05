const { runQuery, getRow, getAll } = require("../utils/database");
const { logger } = require("../utils/logger");

class Book {
  static async create(userId, bookData) {
    try {
      const {
        title,
        author,
        cover_url,
        reading_url,
        current_chapter = 1,
        current_page = 1,
        total_chapters,
        total_pages,
        status = "reading",
        notes,
      } = bookData;

      const result = await runQuery(
        `INSERT INTO books (
          user_id, title, author, cover_url, reading_url, 
          current_chapter, current_page, total_chapters, 
          total_pages, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          title,
          author,
          cover_url,
          reading_url,
          current_chapter,
          current_page,
          total_chapters,
          total_pages,
          status,
          notes,
        ]
      );

      return { id: result.id, ...bookData };
    } catch (error) {
      logger.error("Error creating book:", error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      return await getAll(
        "SELECT * FROM books WHERE user_id = ? ORDER BY updated_at DESC",
        [userId]
      );
    } catch (error) {
      logger.error("Error finding books by user id:", error);
      throw error;
    }
  }

  static async findById(bookId, userId) {
    try {
      return await getRow("SELECT * FROM books WHERE id = ? AND user_id = ?", [
        bookId,
        userId,
      ]);
    } catch (error) {
      logger.error("Error finding book by id:", error);
      throw error;
    }
  }

  static async updateProgress(bookId, userId, progressData) {
    try {
      const {
        current_chapter,
        current_page,
        total_chapters,
        total_pages,
        status,
      } = progressData;

      const updateFields = [];
      const updateValues = [];

      if (current_chapter !== undefined) {
        updateFields.push("current_chapter = ?");
        updateValues.push(current_chapter);
      }

      if (current_page !== undefined) {
        updateFields.push("current_page = ?");
        updateValues.push(current_page);
      }

      if (total_chapters !== undefined) {
        updateFields.push("total_chapters = ?");
        updateValues.push(total_chapters);
      }

      if (total_pages !== undefined) {
        updateFields.push("total_pages = ?");
        updateValues.push(total_pages);
      }

      if (status !== undefined) {
        updateFields.push("status = ?");
        updateValues.push(status);
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      updateValues.push(bookId, userId);

      const result = await runQuery(
        `UPDATE books SET ${updateFields.join(
          ", "
        )} WHERE id = ? AND user_id = ?`,
        updateValues
      );

      if (result.changes > 0) {
        // Return the updated book
        return await this.findById(bookId, userId);
      }

      return null;
    } catch (error) {
      logger.error("Error updating book progress:", error);
      throw error;
    }
  }

  static async update(bookId, userId, bookData) {
    try {
      const { title, author, cover_url, reading_url, notes, status } = bookData;

      const result = await runQuery(
        `UPDATE books SET 
          title = ?, author = ?, cover_url = ?, reading_url = ?, 
          notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND user_id = ?`,
        [title, author, cover_url, reading_url, notes, status, bookId, userId]
      );

      return result.changes > 0;
    } catch (error) {
      logger.error("Error updating book:", error);
      throw error;
    }
  }

  static async delete(bookId, userId) {
    try {
      const result = await runQuery(
        "DELETE FROM books WHERE id = ? AND user_id = ?",
        [bookId, userId]
      );

      return result.changes > 0;
    } catch (error) {
      logger.error("Error deleting book:", error);
      throw error;
    }
  }

  static async search(userId, searchTerm) {
    try {
      const searchPattern = `%${searchTerm}%`;
      return await getAll(
        `SELECT * FROM books 
         WHERE user_id = ? AND (title LIKE ? OR author LIKE ? OR notes LIKE ?)
         ORDER BY updated_at DESC`,
        [userId, searchPattern, searchPattern, searchPattern]
      );
    } catch (error) {
      logger.error("Error searching books:", error);
      throw error;
    }
  }
}

module.exports = Book;
