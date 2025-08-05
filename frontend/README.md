# Personal Reading Dashboard - Frontend

A modern React application for tracking your reading progress, built with Vite, TailwindCSS, and React Router.

## Features

- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS
- 🔐 **Authentication** - JWT-based login and signup
- 📚 **Book Management** - Add, edit, and delete books
- 🔍 **Search & Filter** - Find books quickly with search and status filters
- 📊 **Progress Tracking** - Monitor your reading progress
- 📱 **Mobile Friendly** - Responsive design for all devices
- ⚡ **Fast Performance** - Built with Vite for optimal development experience

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see backend README)

### Development Setup

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

**Note**: The development server is configured with a proxy to forward `/api` requests to the backend at `http://localhost:3002`.

### Production Build

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

### Docker

#### Development

```bash
docker-compose up frontend
```

#### Production

```bash
docker build -t reading-dashboard-frontend .
docker run -p 80:80 reading-dashboard-frontend
```

**Note**: When running with Docker, the frontend is served by Nginx on port 80 and proxies API requests to the backend.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   └── AddBookModal.jsx
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx
│   │   └── DashboardPage.jsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
├── nginx.conf             # Nginx configuration for Docker
└── Dockerfile             # Docker configuration
```

## API Integration

The frontend communicates with the backend API through the `api.js` service:

- **Authentication**: `/api/auth/signup`, `/api/auth/login`
- **Books**: `/api/books` (CRUD operations)
- **Progress**: `/api/books/:id/progress`

### API Proxy Configuration

#### Development (Vite)

```javascript
// vite.config.js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3002",
      changeOrigin: true,
    },
  },
}
```

#### Production (Nginx)

```nginx
# nginx.conf
location /api/ {
  proxy_pass http://backend:3001/api/;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

The app uses the following environment variables:

- `VITE_API_URL` - Backend API URL (defaults to `/api` for proxy)

### Styling

- **TailwindCSS** is used for styling
- Custom components are defined in `src/index.css`
- Icons from **Lucide React**

## Docker Configuration

### Dockerfile

- Multi-stage build (Node.js for build, Nginx for serving)
- Optimized for production with minimal image size
- Serves static files via Nginx

### Nginx Configuration

- Serves React app from `/usr/share/nginx/html`
- Proxies API requests to backend service
- Configured for single-page application routing

## Authentication Flow

1. **Signup/Login**: User submits credentials via forms
2. **Token Storage**: JWT token stored in localStorage
3. **API Requests**: Token automatically included in Authorization header
4. **Route Protection**: Protected routes redirect to login if not authenticated
5. **Logout**: Token removed from localStorage

## Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test your changes thoroughly

## License

This project is part of the Personal Reading Dashboard application.
