# 🛠️ TODO - Personal Reading Dashboard

## 📊 Progress Summary

- **Backend**: ✅ **100% Complete** - All core features implemented
- **Frontend**: ✅ **90% Complete** - Core features implemented, ready for testing
- **DevOps**: ✅ **95% Complete** - Docker setup ready for both services
- **Security**: ✅ **Backend Complete** - JWT auth implemented
- **Overall**: 🎯 **~85% Complete**

---

## 1. Backend (Node.js + SQLite) ✅ COMPLETED

- [x] Initialize Express server
- [x] Connect SQLite with native sqlite3 or knex
- [x] JWT authentication (signup, login, verify middleware)
- [x] Winston logger setup
- [x] API endpoints:
  - [x] `POST /api/auth/signup`
  - [x] `POST /api/auth/login`
  - [x] `POST /api/books` → Add a book/manga
  - [x] `GET /api/books` → List all books for logged-in user
  - [x] `GET /api/books/:id` → Get book detail
  - [x] `PUT /api/books/:id/progress` → Update chapter/page
  - [x] `DELETE /api/books/:id` → Remove book
- [ ] Iframe proxy endpoint (for sites with X-Frame-Options)
- [ ] Elasticsearch integration for searching books

## 2. Frontend (React + TailwindCSS) ✅ COMPLETED

- [x] Setup React with Vite
- [x] Configure TailwindCSS
- [x] JWT login & signup forms
- [x] Landing page:
  - [x] Feature highlights
  - [x] Sign up & login buttons
- [x] Dashboard page:
  - [x] Book list with search & filter
  - [x] Add book modal
  - [x] Delete book functionality
- [ ] Book detail page:
  - [ ] Show iframe reader
  - [ ] Progress controls (+1 chapter, set chapter)
  - [ ] Auto-detect chapter from URL
- [x] Mobile-friendly UI
- [x] Axios API service with token handling

## 3. DevOps (Docker) ✅ COMPLETED

- [x] Dockerfile for backend
- [x] Dockerfile for frontend
- [x] Docker Compose file:
  - [x] Backend service
  - [x] Frontend service
  - [x] SQLite volume
  - [ ] Elasticsearch container (optional)
- [x] Internal Docker network
- [ ] Optional Traefik/Caddy reverse proxy

## 4. Security & Performance - Backend ✅ COMPLETED

- [x] JWT authentication for all API endpoints
- [ ] Rate limiting middleware (express-rate-limit)
- [ ] Gzip compression
- [ ] API caching layer (optional Redis)
- [ ] HTTPS via reverse proxy

## 5. Extra Features

- [ ] PWA support for mobile
- [ ] Auto-detect progress from iframe URL changes
- [ ] Save last reading position per device
- [ ] Dark mode toggle
