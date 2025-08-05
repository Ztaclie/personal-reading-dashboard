import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { booksAPI } from "../services/api";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Settings,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Loader2,
  Copy,
} from "lucide-react";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const iframeRef = useRef(null);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoDetectChapter, setAutoDetectChapter] = useState(true);
  const [saving, setSaving] = useState(false);
  const [readingMode, setReadingMode] = useState("iframe"); // "iframe" or "external"

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getById(id);
      const bookData = response.data.book;
      setBook(bookData);
      setCurrentUrl(bookData.reading_url);
    } catch (error) {
      console.error("Error fetching book:", error);
      setError("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = async (newUrl) => {
    setCurrentUrl(newUrl);

    if (autoDetectChapter) {
      try {
        const response = await booksAPI.extractChapter(newUrl);
        const detectedChapter = response.data.chapter;

        if (detectedChapter && detectedChapter !== book.current_chapter) {
          await updateProgress(detectedChapter);
        }
      } catch (error) {
        console.error("Error detecting chapter:", error);
      }
    }
  };

  const updateProgress = async (chapter) => {
    try {
      setSaving(true);
      const response = await booksAPI.updateProgress(id, {
        current_chapter: chapter,
        status: "reading",
      });
      setBook(response.data.book);

      // Update the current URL to reflect the new chapter if possible
      if (readingMode === "external" && currentUrl) {
        try {
          const urlResponse = await booksAPI.extractChapter(currentUrl);
          if (urlResponse.data.chapter) {
            // Try to construct a new URL with the updated chapter
            const urlObj = new URL(currentUrl);
            const path = urlObj.pathname;
            const newPath = path.replace(/chapter-\d+/i, `chapter-${chapter}`);
            const newUrl = `${urlObj.origin}${newPath}`;
            setCurrentUrl(newUrl);
          }
        } catch (error) {
          // If URL update fails, keep the original URL
          console.log("Could not update URL for new chapter");
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChapterChange = async (direction) => {
    if (!book) return;

    const currentChapter = book.current_chapter || 1;
    let newChapter = currentChapter;

    if (direction === "next") {
      newChapter = currentChapter + 1;
    } else if (direction === "prev") {
      newChapter = Math.max(1, currentChapter - 1);
    }

    await updateProgress(newChapter);
  };

  const handleSetChapter = async (chapter) => {
    if (chapter && chapter > 0) {
      await updateProgress(parseInt(chapter));
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleIframeLoad = () => {
    // Iframe loaded successfully
    setError(null);
  };

  const handleIframeError = () => {
    // Check if the URL is likely to have Cloudflare protection
    const cloudflareDomains = [
      "novelfull.com",
      "novelupdates.com",
      "webnovel.com",
      "royalroad.com",
      "scribblehub.com",
      "wuxiaworld.com",
    ];

    const urlDomain = new URL(currentUrl).hostname.replace("www.", "");
    const isLikelyCloudflare = cloudflareDomains.includes(urlDomain);

    if (isLikelyCloudflare) {
      setError(
        "This site likely uses Cloudflare protection. Try reading in a new tab instead."
      );
    } else {
      setError(
        "Failed to load content. The site may not allow iframe embedding."
      );
    }
  };

  // Add direct link mode for Cloudflare-protected sites
  const openInNewTab = () => {
    window.open(currentUrl, "_blank");
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      // You could add a toast notification here
      console.log("URL copied to clipboard");
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleDirectRead = () => {
    // Switch to external reading mode
    setReadingMode("external");
    setError(null);
    openInNewTab();
  };

  const switchToIframe = () => {
    setReadingMode("iframe");
    setError(null);
  };

  // Add a function to handle iframe message events (for better error detection)
  useEffect(() => {
    const handleMessage = (event) => {
      // Handle messages from iframe if needed
      if (event.data && event.data.type === "error") {
        setError(event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Book not found"}
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const iframeSrc = `/api/books/proxy/iframe?url=${encodeURIComponent(
    currentUrl
  )}&token=${encodeURIComponent(localStorage.getItem("token") || "")}`;

  // Debug logging
  console.log("Iframe src:", iframeSrc);
  console.log("Token:", localStorage.getItem("token"));

  return (
    <div
      className={`min-h-screen bg-gray-900 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`bg-white shadow-sm border-b ${
          isFullscreen ? "hidden" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {book.title}
                </h1>
                <p className="text-sm text-gray-600">
                  by {book.author} • Chapter {book.current_chapter || 1}
                  {book.total_chapters && ` of ${book.total_chapters}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Reading Mode Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                <span className="text-xs text-gray-600">Mode:</span>
                <span
                  className={`text-xs font-medium ${
                    readingMode === "iframe"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {readingMode === "iframe" ? "Embedded" : "External"}
                </span>
              </div>

              <button
                onClick={toggleControls}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title={showControls ? "Hide controls" : "Show controls"}
              >
                <Settings className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4 text-gray-600" />
                ) : (
                  <Maximize className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Controls */}
      {showControls && (
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleChapterChange("prev")}
                disabled={saving}
                className="btn-secondary flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Chapter:</span>
                <input
                  type="number"
                  min="1"
                  value={book.current_chapter || 1}
                  onChange={(e) => handleSetChapter(e.target.value)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {book.total_chapters && (
                  <span className="text-sm text-gray-500">
                    / {book.total_chapters}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleChapterChange("next")}
                disabled={saving}
                className="btn-secondary flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoDetectChapter}
                  onChange={(e) => setAutoDetectChapter(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  Auto-detect chapter
                </span>
              </label>

              {saving && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              )}

              {/* Always show "Read in New Tab" button */}
              <button
                onClick={openInNewTab}
                className="btn-primary text-sm px-3 py-1"
                title="Open reading URL in new tab"
              >
                Read in New Tab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex-1">
        {readingMode === "external" ? (
          // External Reading Mode
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white max-w-lg mx-auto">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                Reading in External Tab
              </h3>
              <p className="mb-6 text-gray-300">
                The content is now open in a new tab. Update your progress here
                as you read.
              </p>

              {/* Progress Update Section */}
              <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-6 mb-6">
                <h4 className="text-md font-semibold mb-4 text-white">
                  Update Progress
                </h4>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Chapter:</span>
                    <input
                      type="number"
                      min="1"
                      value={book.current_chapter || 1}
                      onChange={(e) => handleSetChapter(e.target.value)}
                      className="w-20 px-3 py-2 text-sm border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {book.total_chapters && (
                      <span className="text-sm text-gray-400">
                        / {book.total_chapters}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleChapterChange("prev")}
                      disabled={saving}
                      className="btn-secondary text-sm px-3 py-2"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => handleChapterChange("next")}
                      disabled={saving}
                      className="btn-secondary text-sm px-3 py-2"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {saving && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-blue-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving progress...</span>
                  </div>
                )}

                {/* Quick Update Buttons */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <button
                    onClick={() =>
                      handleSetChapter((book.current_chapter || 1) + 1)
                    }
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    +1 Chapter
                  </button>
                  <button
                    onClick={() =>
                      handleSetChapter((book.current_chapter || 1) + 5)
                    }
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    +5 Chapters
                  </button>
                  <button
                    onClick={() =>
                      handleSetChapter((book.current_chapter || 1) + 10)
                    }
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    +10 Chapters
                  </button>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-200">
                  💡 <strong>Tip:</strong> Use the progress controls above or
                  the ones in this panel to update your reading progress as you
                  read in the external tab.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={openInNewTab} className="btn-primary">
                  Open Reading Tab
                </button>
                <button onClick={copyUrlToClipboard} className="btn-secondary">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy URL
                </button>
                <button onClick={switchToIframe} className="btn-outline">
                  Try Embedded Mode
                </button>
              </div>
            </div>
          </div>
        ) : error ? (
          // Error State (Iframe failed)
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white max-w-md mx-auto">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                Unable to Load Content
              </h3>
              <p className="mb-4 text-gray-300">{error}</p>

              {error.includes("Cloudflare") && (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-200">
                    This website uses Cloudflare protection which prevents
                    automated access. You can still read the content by opening
                    it in a new tab.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={handleDirectRead} className="btn-primary">
                  Read in New Tab
                </button>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Open Original Site
                </a>
                <button onClick={() => setError(null)} className="btn-outline">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Iframe Mode (working)
          <div className="relative w-full h-full">
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`Reading ${book.title}`}
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />

            {/* Floating "Read in New Tab" button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={openInNewTab}
                className="bg-white/90 hover:bg-white text-gray-800 font-medium py-2 px-3 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
                title="Open reading URL in new tab"
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">New Tab</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* URL Input (Hidden by default, can be toggled) */}
      {showControls && (
        <div className="bg-white border-t px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                URL:
              </span>
              <input
                type="url"
                value={currentUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter reading URL..."
              />
              <button
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Reload"
              >
                <RotateCcw className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
