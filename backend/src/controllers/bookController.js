const Book = require("../models/book");
const { logger } = require("../utils/logger");

const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      cover_url,
      reading_url,
      total_chapters,
      total_pages,
      notes,
    } = req.body;

    // Validation
    if (!title || !reading_url) {
      return res.status(400).json({
        error: "Title and reading URL are required",
      });
    }

    const bookData = {
      title,
      author,
      cover_url,
      reading_url,
      total_chapters,
      total_pages,
      notes,
    };

    const book = await Book.create(req.user.id, bookData);

    logger.info("Book created successfully:", {
      bookId: book.id,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    logger.error("Create book error:", error);
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const { search } = req.query;
    let books;

    if (search) {
      books = await Book.search(req.user.id, search);
    } else {
      books = await Book.findByUserId(req.user.id);
    }

    res.json({
      books,
      count: books.length,
    });
  } catch (error) {
    logger.error("Get books error:", error);
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id, req.user.id);

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.json({ book });
  } catch (error) {
    logger.error("Get book error:", error);
    next(error);
  }
};

const updateBookProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      current_chapter,
      current_page,
      total_chapters,
      total_pages,
      status,
    } = req.body;

    // Check if book exists and belongs to user
    const book = await Book.findById(id, req.user.id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    const progressData = {
      current_chapter,
      current_page,
      total_chapters,
      total_pages,
      status,
    };

    const updated = await Book.updateProgress(id, req.user.id, progressData);

    if (!updated) {
      return res.status(400).json({
        error: "Failed to update book progress",
      });
    }

    // Get updated book
    const updatedBook = await Book.findById(id, req.user.id);

    logger.info("Book progress updated:", {
      bookId: id,
      userId: req.user.id,
      progressData,
    });

    res.json({
      message: "Book progress updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    logger.error("Update book progress error:", error);
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, cover_url, reading_url, notes, status } = req.body;

    // Check if book exists and belongs to user
    const book = await Book.findById(id, req.user.id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    const bookData = {
      title,
      author,
      cover_url,
      reading_url,
      notes,
      status,
    };

    const updated = await Book.update(id, req.user.id, bookData);

    if (!updated) {
      return res.status(400).json({
        error: "Failed to update book",
      });
    }

    // Get updated book
    const updatedBook = await Book.findById(id, req.user.id);

    logger.info("Book updated:", { bookId: id, userId: req.user.id });

    res.json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    logger.error("Update book error:", error);
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if book exists and belongs to user
    const book = await Book.findById(id, req.user.id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    const deleted = await Book.delete(id, req.user.id);

    if (!deleted) {
      return res.status(400).json({
        error: "Failed to delete book",
      });
    }

    logger.info("Book deleted:", { bookId: id, userId: req.user.id });

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    logger.error("Delete book error:", error);
    next(error);
  }
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBookProgress,
  updateBook,
  deleteBook,
};
