import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { booksAPI } from "../services/api";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  LogOut,
  User,
} from "lucide-react";
import AddBookModal from "../components/AddBookModal";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      const response = await booksAPI.create(bookData);
      setBooks([...books, response.data.book]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksAPI.delete(bookId);
        setBooks(books.filter((book) => book.id !== bookId));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "reading":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "plan_to_read":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "reading":
        return "Reading";
      case "completed":
        return "Completed";
      case "plan_to_read":
        return "Plan to Read";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">
                Reading Dashboard
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Books</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
                <option value="plan_to_read">Plan to Read</option>
              </select>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Reading</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.filter((book) => book.status === "reading").length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.filter((book) => book.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Plan to Read
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    books.filter((book) => book.status === "plan_to_read")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add book button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Book
          </button>
        </div>

        {/* Books grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 mb-4">
              {books.length === 0
                ? "You haven't added any books yet. Start by adding your first book!"
                : "No books match your search criteria."}
            </p>
            {books.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Add Your First Book
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.author}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        book.status
                      )}`}
                    >
                      {getStatusText(book.status)}
                    </span>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>Current: Chapter {book.current_chapter || 1}</p>
                  <p>Total: {book.total_chapters || "Unknown"} chapters</p>
                  {book.reading_url && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/book/${book.id}`)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Read in App →
                      </button>
                      <a
                        href={book.reading_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        (External)
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Book Modal */}
      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddBook}
        />
      )}
    </div>
  );
};

export default DashboardPage;
