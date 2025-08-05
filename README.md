# 📚 Personal Reading Dashboard

A self-hosted personal reading tracker and dashboard for novels, manga, and webtoons.
Runs locally with **Node.js**, **SQLite**, **Docker**, and a **React + TailwindCSS** frontend.

The dashboard can load your reading sites in an iframe and automatically track your reading progress (chapter number) for both novels and manga.  
Supports **multi-user accounts** with **JWT authentication**.

---

## 🚀 Features

- 📖 **Track novels, manga, and webtoons**
- 🔄 **Auto-progress tracking** via chapter number detection in iframe URLs
- 🎯 **Resume reading** from the last saved chapter
- 🔐 **JWT Authentication** for secure, user-based data
- 📜 **Logging with Winston**
- ⚡ **Fast search** with Elasticsearch integration (planned)
- 🛡️ **Docker internal network** isolation for security
- 📱 **Responsive React + TailwindCSS UI** (mobile-friendly)
- 📦 **SQLite** for lightweight local storage
- 🐳 **Dockerized deployment**
- 🌐 **Landing page** for signup/login
- 📊 **Dashboard page** for managing books

---

## 🛠️ Tech Stack

**Backend**

- Node.js (Express)
- SQLite (persistent local database)
- JWT Authentication
- Winston logging
- Elasticsearch (optional, for search)

**Frontend**

- React 18
- Vite (build tool)
- TailwindCSS
- Axios (API requests)
- React Router
- Lucide React (icons)

**DevOps**

- Docker
- Docker Compose
- Nginx (frontend serving)
- Docker internal networking

---

## 📂 Project Structure

```
reading-dashboard/
│
├── backend/              # Node.js API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, error handling
│   │   ├── models/       # SQLite models
│   │   ├── routes/       # Express routes
│   │   └── utils/        # Database, logger
│   ├── data/             # SQLite database files
│   ├── logs/             # Application logs
│   └── Dockerfile
│
├── frontend/             # React + TailwindCSS app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Landing, Dashboard
│   │   ├── contexts/     # Auth context
│   │   └── services/     # API calls
│   ├── public/           # Static assets
│   └── Dockerfile
│
├── docker-compose.yml    # Multi-service config
├── README.md
└── TODO.md
```

---

## 🔄 How It Works

### 1. **Architecture Flow**

```
User Browser → Frontend (Port 80) → Nginx → React App
                                    ↓
                              API Proxy → Backend (Port 3002) → SQLite Database
```

### 2. **Development vs Production**

- **Development**: Frontend runs on Vite dev server (Port 3000) with API proxy to backend (Port 3002)
- **Production**: Frontend built and served by Nginx (Port 80) with API proxy to backend (Port 3002)

### 3. **Authentication Flow**

1. User signs up/logs in via frontend forms
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. All subsequent API calls include JWT in Authorization header
5. Backend middleware validates JWT for protected routes

### 4. **Book Management Flow**

1. User adds book via dashboard modal
2. Frontend sends POST to `/api/books` with JWT
3. Backend saves to SQLite database
4. Dashboard fetches and displays user's books
5. User can delete books or update progress

---

## ⚡ Running Locally (Docker)

### Quick Start

1️⃣ **Clone repo**

```bash
git clone https://github.com/YOUR_USERNAME/reading-dashboard.git
cd reading-dashboard
```

2️⃣ **Build & start services**

```bash
docker-compose up --build
```

3️⃣ **Access the application**

- **Frontend**: [http://localhost](http://localhost) (Port 80)
- **Backend API**: [http://localhost:3002](http://localhost:3002) (Direct access)

### Development Mode

For development with hot reload:

```bash
# Terminal 1: Start backend
cd backend
npm install
npm run dev

# Terminal 2: Start frontend
cd frontend
npm install
npm run dev
```

Then access:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:3001](http://localhost:3001)

---

## 🔒 Security

- **JWT Auth**: All API requests require a valid token
- **Docker internal network**: Backend only accessible via frontend proxy
- **CORS**: Configured for local development
- **Environment variables**: Sensitive data stored in `.env` files

---

## 📌 Current Status

- ✅ **Backend**: 100% Complete - All core features implemented
- ✅ **Frontend**: 90% Complete - Core features implemented, ready for testing
- ✅ **DevOps**: 95% Complete - Docker setup ready for both services
- 🎯 **Overall**: ~85% Complete

See [TODO.md](TODO.md) for detailed progress and upcoming features.

---

## 📝 License

MIT License
