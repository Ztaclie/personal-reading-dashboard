# 📚 Personal Reading Dashboard

A self-hosted personal reading tracker and dashboard for novels, manga, and webtoons.
Runs locally on your Ubuntu laptop with **Node.js**, **SQLite**, **Docker**, and a **React + TailwindCSS** frontend.

The dashboard can load your reading sites in an iframe and automatically track your reading progress (chapter number) for both novels and manga.  
Supports **multi-user accounts** with **JWT authentication**.

---

## 🚀 Features

- 📖 **Track novels, manga, and webtoons**
- 🔄 **Auto-progress tracking** via chapter number detection in iframe URLs
- 🎯 **Resume reading** from the last saved chapter
- 🔐 **JWT Authentication** for secure, user-based data
- 📜 **Logging with Winston**
- ⚡ **Fast search** with Elasticsearch integration
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

- React
- TailwindCSS
- Axios (API requests)
- React Router

**DevOps**

- Docker
- Docker Compose
- Docker internal networking
- Traefik / Caddy (optional HTTPS reverse proxy)

---

## 📂 Project Structure

```

reading-dashboard/
│
├── backend/              # Node.js API
│   ├── src/
│   │   ├── models/       # SQLite models
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Core logic
│   │   └── utils/        # JWT, Winston, helpers
│   └── Dockerfile
│
├── frontend/             # React + TailwindCSS app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Landing, Dashboard, Book Reader
│   │   └── services/     # API calls
│   └── Dockerfile
│
├── docker-compose.yml    # Multi-service config
├── README.md
└── TODO.md

```

---

## ⚡ Running Locally (Docker)

1️⃣ **Clone repo**

```bash
git clone https://github.com/YOUR_USERNAME/reading-dashboard.git
cd reading-dashboard
```

2️⃣ **Build & start services**

```bash
docker-compose up --build
```

3️⃣ **Access services**

- API: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:8080](http://localhost:8080)

---

## 🔒 Security

- **JWT Auth**: All API requests require a valid token
- **Docker internal network**: API not directly exposed, only via frontend or reverse proxy
- **Optional HTTPS**: Use Traefik or Caddy in Docker for TLS

---

## 📌 Roadmap

- [ ] Multi-device sync with HTTPS
- [ ] Auto-detect page numbers for sites with numeric URLs
- [ ] Proxy support for iframe-restricted sites
- [ ] Search books via Elasticsearch
- [ ] Mobile PWA support

---

## 📝 License

MIT License
