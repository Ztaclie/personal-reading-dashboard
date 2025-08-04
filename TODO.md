# 🛠️ TODO - Personal Reading Dashboard

## 1. Backend (Node.js + SQLite)

- [ ] Initialize Express server
- [ ] Connect SQLite with native sqlite3 or knex
- [ ] JWT authentication (signup, login, verify middleware)
- [ ] Winston logger setup
- [ ] API endpoints:
  - [ ] `POST /auth/signup`
  - [ ] `POST /auth/login`
  - [ ] `POST /books` → Add a book/manga
  - [ ] `GET /books` → List all books for logged-in user
  - [ ] `GET /books/:id` → Get book detail
  - [ ] `PUT /books/:id/progress` → Update chapter/page
  - [ ] `DELETE /books/:id` → Remove book
- [ ] Iframe proxy endpoint (for sites with X-Frame-Options)
- [ ] Elasticsearch integration for searching books

## 2. Frontend (React + TailwindCSS)

- [ ] Setup React with Vite
- [ ] Configure TailwindCSS
- [ ] JWT login & signup forms
- [ ] Landing page:
  - [ ] Feature highlights
  - [ ] Sign up & login buttons
- [ ] Dashboard page:
  - [ ] Book list with search & filter
  - [ ] Add book modal
  - [ ] Delete/edit book
- [ ] Book detail page:
  - [ ] Show iframe reader
  - [ ] Progress controls (+1 chapter, set chapter)
  - [ ] Auto-detect chapter from URL
- [ ] Mobile-friendly UI
- [ ] Axios API service with token handling

## 3. DevOps (Docker)

- [ ] Dockerfile for backend
- [ ] Dockerfile for frontend
- [ ] Docker Compose file:
  - [ ] Backend service
  - [ ] Frontend service
  - [ ] SQLite volume
  - [ ] Elasticsearch container (optional)
- [ ] Internal Docker network
- [ ] Optional Traefik/Caddy reverse proxy

## 4. Security & Performance

- [ ] JWT authentication for all API endpoints
- [ ] Rate limiting middleware (express-rate-limit)
- [ ] Gzip compression
- [ ] API caching layer (optional Redis)
- [ ] HTTPS via reverse proxy

## 5. Extra Features

- [ ] PWA support for mobile
- [ ] Auto-detect progress from iframe URL changes
- [ ] Save last reading position per device
- [ ] Dark mode toggle
