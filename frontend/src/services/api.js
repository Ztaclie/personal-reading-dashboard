import axios from "axios";

const API_BASE_URL = "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

// Books API
export const booksAPI = {
  getAll: () => api.get("/books"),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post("/books", bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  updateProgress: (id, progressData) =>
    api.put(`/books/${id}/progress`, progressData),
  delete: (id) => api.delete(`/books/${id}`),
  proxyIframe: (url) =>
    api.get(`/books/proxy/iframe?url=${encodeURIComponent(url)}`),
  extractChapter: (url) =>
    api.get(`/books/proxy/extract?url=${encodeURIComponent(url)}`),
};

export default api;
