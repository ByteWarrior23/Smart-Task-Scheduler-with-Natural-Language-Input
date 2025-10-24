# TaskMaster - Smart Task Scheduling Application

A full-stack task management application with AI-powered natural language processing, voice input, and intelligent scheduling.

## Tech Stack

### Backend
- Node.js with Express
- MongoDB (Mongoose)
- JWT Authentication
- Natural Language Processing (Wit.ai, Chrono-node)
- OAuth (GitHub, Google)

### Frontend
- React 18
- Material-UI (MUI)
- React Query (TanStack Query)
- React Router v6
- Framer Motion

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd scheduling_project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
PORT=3001
JWT_ACCESS_TOKEN=your_access_token_secret
JWT_REFRESH_TOKEN=your_refresh_token_secret
MONGODB_URL=your_mongodb_connection_string
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
WIT_API_KEY=your_wit_api_key
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Method 1: Using provided scripts

#### On Windows:
```bash
start.bat
```

#### On Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### Method 2: Manual start

#### Terminal 1 - Backend:
```bash
cd backend
npm start
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Method 3: Development mode with auto-reload

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/v1

## Features

- User authentication (local and OAuth)
- Task management with CRUD operations
- Natural language task input
- Voice-to-text task creation
- Priority levels and recurring tasks
- Task statistics and analytics
- Email reminders
- Responsive design

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get task by ID
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Voice
- `POST /api/v1/voice/upload` - Upload voice file for transcription
- `POST /api/v1/voice/process` - Process voice input to task

## Project Structure

```
scheduling_project/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── db/              # Database configuration
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── shared/          # Shared components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## Troubleshooting

### Port already in use
If you get an error that port 3001 or 5173 is already in use:

```bash
# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# On Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Database connection issues
- Verify your MongoDB connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB service is running (if using local MongoDB)

### Frontend proxy errors
- Make sure backend is running before starting frontend
- Check that PORT in backend/.env matches the proxy target in frontend/vite.config.js

## Environment Variables

### Required Backend Variables
- `PORT` - Server port (default: 3001)
- `MONGODB_URL` - MongoDB connection string
- `JWT_ACCESS_TOKEN` - Secret for access tokens
- `JWT_REFRESH_TOKEN` - Secret for refresh tokens

### Optional Backend Variables
- `WIT_API_KEY` - Wit.ai API key for NLP
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue in the repository.
