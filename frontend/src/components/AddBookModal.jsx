import React, { useState } from "react";
import { X, BookOpen, User, Link, Hash } from "lucide-react";

const AddBookModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    reading_url: "",
    status: "reading",
    current_chapter: "",
    total_chapters: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAdd({
        ...formData,
        current_chapter: parseInt(formData.current_chapter) || 1,
        total_chapters: parseInt(formData.total_chapters) || null,
      });
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Book Title *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Enter book title"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Author *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Enter author name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reading_url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reading URL
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="url"
                id="reading_url"
                name="reading_url"
                value={formData.reading_url}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="https://example.com/book"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="plan_to_read">Plan to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="current_chapter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Chapter
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  id="current_chapter"
                  name="current_chapter"
                  value={formData.current_chapter}
                  onChange={handleChange}
                  min="1"
                  className="input-field pl-10"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="total_chapters"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Total Chapters
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  id="total_chapters"
                  name="total_chapters"
                  value={formData.total_chapters}
                  onChange={handleChange}
                  min="1"
                  className="input-field pl-10"
                  placeholder="Unknown"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
