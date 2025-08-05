const express = require("express");
const router = express.Router();
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  updateBookProgress,
  deleteBook,
} = require("../controllers/bookController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authenticateToken);

// Book CRUD operations
router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBook);
router.put("/:id", updateBook);
router.put("/:id/progress", updateBookProgress);
router.delete("/:id", deleteBook);

module.exports = router;
