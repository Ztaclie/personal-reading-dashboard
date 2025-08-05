const Book = require("../models/book");
const { logger } = require("../utils/logger");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const jwt = require("jsonwebtoken");
const { getRow } = require("../utils/database");

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
    const { current_chapter, current_page, status } = req.body;

    const updatedBook = await Book.updateProgress(id, req.user.id, {
      current_chapter,
      current_page,
      status,
    });

    if (!updatedBook) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.json({ book: updatedBook });
  } catch (error) {
    logger.error("Update book progress error:", error);
    next(error);
  }
};

// New iframe proxy endpoint
const proxyIframe = async (req, res, next) => {
  try {
    const { url, token } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "URL parameter is required",
      });
    }

    // If token is provided as query parameter (for iframe requests), verify it
    if (token) {
      try {
        const JWT_SECRET =
          process.env.JWT_SECRET || "your-secret-key-change-in-production";
        logger.info("Verifying token for iframe request");

        const decoded = jwt.verify(token, JWT_SECRET);
        logger.info("Token decoded successfully:", { userId: decoded.userId });

        const user = await getRow(
          "SELECT id, username, email FROM users WHERE id = ?",
          [decoded.userId]
        );

        if (!user) {
          logger.error("User not found for token:", { userId: decoded.userId });
          return res.status(401).json({ error: "User not found" });
        }

        logger.info("User authenticated for iframe:", {
          userId: user.id,
          username: user.username,
        });
        req.user = user;
      } catch (error) {
        logger.error("Token verification failed:", error.message);
        return res.status(401).json({ error: "Invalid token" });
      }
    } else {
      // If no token provided, check if user is authenticated via middleware
      if (!req.user) {
        logger.error("No token provided and no user authenticated");
        return res.status(401).json({ error: "Authentication required" });
      }
    }

    // Validate URL
    const urlObj = new URL(url);
    const allowedDomains = [
      "novelupdates.com",
      "webnovel.com",
      "royalroad.com",
      "scribblehub.com",
      "wuxiaworld.com",
      "lightnovelworld.com",
      "readlightnovel.org",
      "novelfull.com",
      "mangadex.org",
      "mangakakalot.com",
      "readmanganato.com",
      "mangareader.to",
      "webtoons.com",
      "tapas.io",
      "webtoon.com",
      "example.com", // For testing
      "httpbin.org", // For testing
      "jsonplaceholder.typicode.com", // For testing
    ];

    const domain = urlObj.hostname.replace("www.", "");
    if (!allowedDomains.includes(domain)) {
      return res.status(403).json({
        error: "Domain not allowed for iframe proxy",
      });
    }

    logger.info("Fetching content from:", url);

    // Try multiple approaches to fetch the content
    let response;
    let errorDetails = "";

    // First attempt with full headers
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Sec-Ch-Ua":
            '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          Referer: urlObj.origin,
        },
        redirect: "follow",
        timeout: 10000,
      });
    } catch (error) {
      logger.error("First fetch attempt failed:", error.message);
    }

    // If first attempt failed or returned error, try with minimal headers
    if (!response || !response.ok) {
      logger.info("Trying with minimal headers...");
      try {
        response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          },
          redirect: "follow",
          timeout: 10000,
        });
      } catch (error) {
        logger.error("Second fetch attempt failed:", error.message);
      }
    }

    // If still failed, try with no headers at all
    if (!response || !response.ok) {
      logger.info("Trying with no headers...");
      try {
        response = await fetch(url, {
          redirect: "follow",
          timeout: 10000,
        });
      } catch (error) {
        logger.error("Third fetch attempt failed:", error.message);
      }
    }

    if (!response) {
      logger.error("All fetch attempts failed for URL:", url);
      return res.status(503).json({
        error: "Failed to fetch content after multiple attempts",
        url: url,
      });
    }

    if (!response.ok) {
      logger.error(
        "Failed to fetch content:",
        response.status,
        response.statusText,
        "URL:",
        url
      );

      // Try to get more details about the error
      let errorDetails = "";
      try {
        const errorText = await response.text();
        errorDetails = errorText.substring(0, 500); // Limit to first 500 chars
        logger.error("Response body:", errorDetails);
      } catch (e) {
        logger.error("Could not read error response body");
      }

      // Check if it's a Cloudflare challenge page
      if (
        errorDetails.includes("Just a moment") ||
        errorDetails.includes("Cloudflare")
      ) {
        return res.status(403).json({
          error:
            "This website uses Cloudflare protection and cannot be accessed through the proxy",
          details:
            "The website requires JavaScript execution and user interaction to pass security checks",
          url: url,
          suggestion: "Try opening the link in a new tab instead",
        });
      }

      return res.status(response.status).json({
        error: `Failed to fetch content: ${response.statusText}`,
        details: errorDetails,
        url: url,
      });
    }

    let content = await response.text();
    logger.info("Content fetched successfully, processing...");

    // Remove X-Frame-Options and Content-Security-Policy headers
    content = content.replace(
      /<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi,
      ""
    );
    content = content.replace(
      /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
      ""
    );

    // Add base tag to fix relative URLs
    const baseTag = `<base href="${urlObj.origin}${urlObj.pathname}">`;
    content = content.replace(/<head>/i, `<head>${baseTag}`);

    // Set response headers
    res.set({
      "Content-Type": "text/html",
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self'",
    });

    logger.info("Sending proxied content to iframe");
    res.send(content);
  } catch (error) {
    logger.error("Iframe proxy error:", error);
    res.status(500).json({
      error: "Failed to proxy content",
    });
  }
};

// Extract chapter number from URL
const extractChapterFromUrl = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "URL parameter is required",
      });
    }

    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const search = urlObj.search;

    // Common chapter patterns
    const patterns = [
      /chapter-(\d+)/i,
      /ch-(\d+)/i,
      /chapter\/(\d+)/i,
      /ch\/(\d+)/i,
      /(\d+)/, // Fallback: any number
    ];

    let chapterNumber = null;

    for (const pattern of patterns) {
      const match = (path + search).match(pattern);
      if (match) {
        chapterNumber = parseInt(match[1]);
        break;
      }
    }

    res.json({
      chapter: chapterNumber,
      url: url,
    });
  } catch (error) {
    logger.error("Chapter extraction error:", error);
    res.status(500).json({
      error: "Failed to extract chapter number",
    });
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
  updateBook,
  updateBookProgress,
  deleteBook,
  proxyIframe,
  extractChapterFromUrl,
};
