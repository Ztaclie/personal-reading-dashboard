# Reading Dashboard Backend

A Node.js backend API for the Personal Reading Dashboard application.

## Features

- 🔐 JWT Authentication (signup, login, profile)
- 📚 Book management (CRUD operations)
- 📖 Reading progress tracking
- 🔍 Book search functionality
- 📝 Comprehensive logging with Winston
- 🗄️ SQLite database with automatic table creation
- 🐳 Docker support
- 🛡️ Error handling and validation

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: SQLite3
- **Authentication**: JWT + bcrypt
- **Logging**: Winston
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

### Docker

```bash
# Build and run with Docker Compose (recommended)
docker-compose up backend

# Or build individually
docker build -t reading-dashboard-backend .
docker run -p 3002:3001 reading-dashboard-backend
```

**Note**: When running with Docker Compose, the backend is accessible on port 3002 from the host, but internally runs on port 3001.

## API Endpoints

### Authentication

| Method | Endpoint            | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| POST   | `/api/auth/signup`  | Register new user | No            |
| POST   | `/api/auth/login`   | Login user        | No            |
| GET    | `/api/auth/profile` | Get user profile  | Yes           |

### Books

| Method | Endpoint                  | Description             | Auth Required |
| ------ | ------------------------- | ----------------------- | ------------- |
| POST   | `/api/books`              | Create new book         | Yes           |
| GET    | `/api/books`              | List user's books       | Yes           |
| GET    | `/api/books/:id`          | Get book details        | Yes           |
| PUT    | `/api/books/:id`          | Update book             | Yes           |
| PUT    | `/api/books/:id/progress` | Update reading progress | Yes           |
| DELETE | `/api/books/:id`          | Delete book             | Yes           |

### Health Check

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/api/health` | Server health status |

## Request/Response Examples

### Signup

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Book

```bash
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "reading_url": "https://example.com/book/123",
  "cover_url": "https://example.com/cover.jpg",
  "total_chapters": 9,
  "notes": "Classic American novel"
}
```

### Update Progress

```bash
PUT /api/books/1/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_chapter": 5,
  "current_page": 120,
  "status": "reading"
}
```

## Environment Variables

| Variable      | Default     | Description         |
| ------------- | ----------- | ------------------- |
| `PORT`        | 3001        | Server port         |
| `NODE_ENV`    | development | Environment mode    |
| `JWT_SECRET`  | -           | JWT signing secret  |
| `LOG_LEVEL`   | info        | Logging level       |
| `CORS_ORIGIN` | -           | CORS allowed origin |

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Books Table

```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  reading_url TEXT NOT NULL,
  current_chapter INTEGER DEFAULT 1,
  current_page INTEGER DEFAULT 1,
  total_chapters INTEGER,
  total_pages INTEGER,
  status TEXT DEFAULT 'reading',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utilities (logger, database)
├── data/                # SQLite database files
├── logs/                # Application logs
├── server.js            # Main server file
├── package.json         # Dependencies
├── Dockerfile           # Docker configuration
└── README.md           # This file
```

## Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Create route in `src/routes/`
3. Add route to main server file
4. Update this README

### Database Changes

1. Update schema in `src/utils/database.js`
2. Test with existing data
3. Consider migration strategy for production

## Docker Configuration

### Dockerfile

- Multi-stage build for production optimization
- Uses Node.js 18 Alpine for smaller image size
- Copies only necessary files

### Docker Compose

- Runs on internal port 3001
- Exposed on host port 3002
- Volume mounts for data and logs persistence
- Health check included

## Troubleshooting

### Common Issues

1. **Port already in use**: Change `PORT` in `.env` or use different host port in Docker
2. **Database errors**: Check `data/` directory permissions
3. **JWT errors**: Verify `JWT_SECRET` is set
4. **CORS errors**: Configure `CORS_ORIGIN` in `.env`

### Logs

Logs are stored in `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

## Security Considerations

- Change default JWT secret in production
- Use HTTPS in production
- Implement rate limiting for production
- Consider adding input validation middleware
- Regular security updates for dependencies

## License

ISC
