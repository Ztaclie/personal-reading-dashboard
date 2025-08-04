const express = require("express");
const {
  createBook,
  getBooks,
  getBook,
  updateBookProgress,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// All book routes require authentication
router.use(authenticateToken);

// Book CRUD operations
router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

// Progress update
router.put("/:id/progress", updateBookProgress);

module.exports = router;
