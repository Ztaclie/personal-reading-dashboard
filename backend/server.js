const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./src/routes/auth");
const bookRoutes = require("./src/routes/books");

// Import controllers for direct route handling
const {
  proxyIframe,
  extractChapterFromUrl,
} = require("./src/controllers/bookController");

// Import middleware
const { errorHandler } = require("./src/middleware/errorHandler");
const { logger } = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Routes
app.use("/api/auth", authRoutes);

// Iframe proxy routes (no authentication middleware - handled in controller)
app.get("/api/books/proxy/iframe", proxyIframe);
app.get("/api/books/proxy/extract", extractChapterFromUrl);

// Book routes (with authentication middleware)
app.use("/api/books", bookRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app
  .listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    logger.error("Server startup error:", error);
    console.error("❌ Server failed to start:", error.message);
  });

module.exports = app;
