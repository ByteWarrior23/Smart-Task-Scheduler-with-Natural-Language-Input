# Smart Task Scheduler - Full Stack Application

A production-ready full-stack task management application with natural language processing, voice input, smart scheduling, and real-time notifications.

## 🎯 Overview

This project consists of a **Node.js/Express backend** with MongoDB and a **React/TypeScript frontend** that together provide a comprehensive task management solution with AI-powered features.

### Key Features

#### Backend Features
- ✅ **JWT Authentication** with refresh tokens
- ✅ **Natural Language Processing** (NLP) for task creation using chrono-node and natural
- ✅ **Voice Input** with audio transcription via Wit.ai
- ✅ **Smart Scheduling** with conflict detection and time slot suggestions
- ✅ **Recurring Tasks** using RRule for flexible recurrence patterns
- ✅ **Email Reminders** with cron-based background jobs
- ✅ **Full CRUD** operations for tasks and users
- ✅ **Search, Filter, Sort** with MongoDB indexing
- ✅ **Comments System** on tasks
- ✅ **Role-Based Access** (user/admin roles)
- ✅ **Security** best practices (helmet, rate limiting, input validation)

#### Frontend Features
- ✅ **Modern React** with TypeScript, hooks, and functional components
- ✅ **TanStack Query** for state management and caching
- ✅ **React Hook Form** + Zod for form validation
- ✅ **Tailwind CSS** + Headless UI for beautiful, responsive design
- ✅ **Dark Mode** with system preference detection
- ✅ **Optimistic Updates** for instant UI feedback
- ✅ **Voice Recording** with microphone access
- ✅ **Natural Language Input** with AI-powered parsing preview
- ✅ **Analytics Dashboard** with charts and statistics
- ✅ **Comprehensive Testing** (Vitest + Playwright)
- ✅ **CI/CD** with GitHub Actions
- ✅ **Docker** support for easy deployment

## 🏗️ Architecture

```
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middlewares/  # Auth, error handling
│   │   ├── utils/        # Helper functions
│   │   └── db/           # Database connection
│   └── ...
├── frontend/             # React/TypeScript SPA
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── context/      # React contexts
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utilities
│   └── ...
└── .github/              # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 5.0+
- npm or yarn

### Backend Setup

1. **Navigate to backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Database
MONGODB_URL=mongodb://localhost:27017/task-scheduler

# JWT Secrets (use long random strings)
JWT_ACCESS_TOKEN=your_access_token_secret_here
JWT_REFRESH_TOKEN=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Email (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Speech/NLP (Optional)
WIT_API_KEY=your_wit_ai_key
```

4. **Start backend**
```bash
npm start
```

Backend runs at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Smart Task Scheduler
```

4. **Start frontend**
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login user
POST   /api/v1/auth/refresh       # Refresh access token
POST   /api/v1/auth/logout        # Logout user
GET    /api/v1/auth/me            # Get current user
PATCH  /api/v1/auth/update        # Update profile
PATCH  /api/v1/auth/change-password  # Change password
PATCH  /api/v1/auth/email-config  # Update email config
DELETE /api/v1/auth/delete        # Delete account
```

### Tasks
```
POST   /api/v1/tasks              # Create task
GET    /api/v1/tasks              # Get all tasks
GET    /api/v1/tasks/:id          # Get task by ID
PATCH  /api/v1/tasks/:id          # Update task
DELETE /api/v1/tasks/:id          # Delete task
PATCH  /api/v1/tasks/:id/complete # Mark as completed
PATCH  /api/v1/tasks/:id/pending  # Mark as pending
PATCH  /api/v1/tasks/:id/archive  # Archive task
GET    /api/v1/tasks/search       # Search tasks
GET    /api/v1/tasks/category/:cat # Filter by category
```

### Natural Language & Voice
```
POST   /api/v1/tasks/nlp/parse   # Parse natural language
POST   /api/v1/voice/transcribe  # Transcribe audio to text
POST   /api/v1/voice/parse       # Parse voice to task data
POST   /api/v1/voice/create-task # Create task from voice
```

### Recurring Tasks
```
POST   /api/v1/tasks/recurring             # Create recurring task
GET    /api/v1/tasks/recurring             # Get recurring tasks
GET    /api/v1/tasks/recurring/:id/instances  # Get instances
PUT    /api/v1/tasks/recurring/:id         # Update recurring task
DELETE /api/v1/tasks/recurring/:id         # Delete recurring task
```

### Reminders
```
GET    /api/v1/tasks/reminders/stats      # Get reminder statistics
POST   /api/v1/tasks/:id/reminder         # Schedule reminder
GET    /api/v1/tasks/deadlines/check      # Check deadlines
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
node test-backend.js
```

### Frontend Tests

**Unit Tests**
```bash
cd frontend
npm test
```

**E2E Tests**
```bash
npm run test:e2e
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Create docker-compose.yml** in root:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: task-scheduler

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      MONGODB_URL: mongodb://mongodb:27017/task-scheduler
      JWT_ACCESS_TOKEN: your_secret_here
      JWT_REFRESH_TOKEN: your_refresh_secret_here
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      VITE_API_BASE_URL: http://backend:3000/api/v1
    depends_on:
      - backend

volumes:
  mongo-data:
```

2. **Start all services**
```bash
docker-compose up -d
```

## 📊 Features in Detail

### Natural Language Task Creation
Users can create tasks using plain English:
```
"Meeting with John tomorrow at 3pm for 1 hour high priority work"
```
The system extracts:
- Title: "Meeting with John"
- Deadline: Tomorrow at 3pm
- Duration: 60 minutes
- Priority: High
- Category: Work

### Smart Scheduling
- **Conflict Detection**: Checks for overlapping tasks
- **Time Slot Suggestions**: Recommends available time slots
- **Auto-Categorization**: ML-based task categorization
- **Duration Estimation**: Suggests task duration based on description

### Voice Input
- Record audio using device microphone
- Transcribe speech to text
- Parse transcription into task fields
- Create task directly from voice

### Recurring Tasks
Support for complex recurrence patterns:
- Daily, weekly, monthly, yearly
- Custom intervals (every 2 weeks, every 3 months)
- Specific weekdays (every Monday and Friday)
- Advanced patterns (first Monday of month, last Friday)

### Email Reminders
- Automatic deadline reminders (24h, 2h before)
- Overdue task notifications
- Daily summary emails
- User-configurable email settings

## 🔒 Security Features

- **Authentication**: JWT with refresh token rotation
- **Authorization**: Role-based access control
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas on frontend, Mongoose validation on backend
- **SQL Injection Protection**: MongoDB parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: SameSite cookies
- **Rate Limiting**: Express rate limiter
- **Secure Headers**: Helmet.js middleware

## 🎨 UI/UX Highlights

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode**: Automatic theme switching
- **Accessibility**: ARIA labels, keyboard navigation
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Optimistic Updates**: Instant UI feedback
- **Animations**: Smooth transitions and micro-interactions
- **Toast Notifications**: Real-time feedback

## 📈 Performance Optimizations

### Backend
- MongoDB indexing for fast queries
- Connection pooling
- Response compression
- Caching with TTL

### Frontend
- Code splitting and lazy loading
- React Query caching
- Optimized bundle size
- Image lazy loading
- Service worker (PWA ready)

## 🔄 CI/CD Pipeline

GitHub Actions workflow:
1. **Lint**: ESLint and TypeScript checks
2. **Test**: Unit and E2E tests
3. **Build**: Production build
4. **Docker**: Build and push images
5. **Deploy**: Auto-deploy to production

## 🚀 Deployment

### Frontend Deployment Options
- **Netlify**: `npm run build` → Deploy `dist/`
- **Vercel**: Connect repo → Auto-deploy
- **AWS S3 + CloudFront**: Upload `dist/` to S3
- **Docker**: Use provided Dockerfile

### Backend Deployment Options
- **Heroku**: `git push heroku main`
- **AWS EC2/ECS**: Use Docker image
- **Digital Ocean**: App Platform or Droplet
- **Railway**: Connect repo → Auto-deploy

## 📝 Environment Variables Reference

### Backend Required
- `MONGODB_URL`: MongoDB connection string
- `JWT_ACCESS_TOKEN`: Access token secret
- `JWT_REFRESH_TOKEN`: Refresh token secret
- `PORT`: Server port (default: 3000)

### Backend Optional
- `EMAIL_USER`: SMTP email address
- `EMAIL_PASS`: SMTP password
- `WIT_API_KEY`: Wit.ai API key for voice

### Frontend Required
- `VITE_API_BASE_URL`: Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

ISC License - see LICENSE file for details

## 👥 Team

- Backend: Node.js, Express, MongoDB
- Frontend: React, TypeScript, Tailwind CSS
- DevOps: Docker, GitHub Actions

## 🙏 Acknowledgments

- React Team for an amazing framework
- MongoDB for scalable database
- TanStack Query for state management
- Tailwind CSS for utility-first CSS
- All open-source contributors

## 📞 Support

- Email: support@taskflow.com
- GitHub Issues: [Issues Page]
- Documentation: [Docs Link]

---

**Built with ❤️ for productivity enthusiasts**
