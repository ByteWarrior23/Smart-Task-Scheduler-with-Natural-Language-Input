# TaskFlow Frontend

A modern, production-ready React frontend for the Smart Task Scheduler application with natural language processing, voice input, and intelligent task management.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based auth with refresh tokens, protected routes, and role-based access
- **Task Management**: Full CRUD operations with real-time updates, optimistic UI, and advanced filtering
- **Natural Language Processing**: Create tasks using plain English descriptions
- **Voice Input**: Audio recording and transcription to create tasks hands-free
- **Recurring Tasks**: RRule-based recurring task management with flexible patterns
- **Smart Scheduling**: Conflict detection, time slot suggestions, and auto-categorization
- **Comments System**: Add and manage comments on tasks
- **Search & Filter**: Advanced search, category filtering, priority sorting, and pagination
- **Analytics Dashboard**: Task statistics, completion rates, and priority distributions
- **Email Reminders**: Background reminder system with deadline notifications
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first, fully responsive UI

### Technical Features
- **TypeScript**: Full type safety across the application
- **React Query**: Efficient data fetching, caching, and state management
- **Form Validation**: Zod-based schema validation with React Hook Form
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Error Handling**: Comprehensive error boundaries and toast notifications
- **Loading States**: Skeleton screens and loading indicators
- **Accessibility**: ARIA-compliant components and keyboard navigation
- **Performance**: Code splitting, lazy loading, and optimized bundle size
- **Security**: XSS protection, CSRF tokens, secure headers

## 📋 Prerequisites

- Node.js 20+ and npm
- Backend API running (see backend README)
- Modern browser with ES6+ support

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Smart Task Scheduler
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing
```bash
npm test             # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── auth.ts       # Authentication API
│   │   ├── tasks.ts      # Tasks API
│   │   └── voice.ts      # Voice API
│   ├── components/       # React components
│   │   ├── common/       # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   └── tasks/        # Task-specific components
│   ├── context/          # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useTasks.ts
│   │   └── useVoice.ts
│   ├── pages/            # Page components
│   │   ├── auth/         # Login, Register
│   │   ├── dashboard/    # Dashboard
│   │   ├── tasks/        # Task pages
│   │   ├── analytics/    # Analytics
│   │   ├── profile/      # Profile
│   │   └── settings/     # Settings
│   ├── types/            # TypeScript types
│   │   └── api.ts        # API types
│   ├── utils/            # Utility functions
│   │   ├── cn.ts         # Class name merger
│   │   ├── date.ts       # Date formatting
│   │   └── validation.ts # Form schemas
│   ├── test/             # Test setup
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── e2e/                  # E2E tests
├── public/               # Static assets
├── .github/              # GitHub Actions
├── Dockerfile            # Production Docker image
├── docker-compose.yml    # Docker Compose config
├── nginx.conf            # Nginx configuration
├── playwright.config.ts  # Playwright config
├── vitest.config.ts      # Vitest config
├── tailwind.config.js    # Tailwind CSS config
└── vite.config.ts        # Vite configuration
```

## 🎨 Component Library

### Common Components
- **Button**: Primary, secondary, danger, success, ghost variants
- **Input**: Text, email, password, date inputs with validation
- **TextArea**: Multi-line text input
- **Select**: Dropdown selection
- **Modal**: Accessible modal dialogs
- **Badge**: Status badges with color variants
- **Loading**: Loading spinners and full-screen loaders
- **EmptyState**: Empty state placeholders

### Task Components
- **TaskCard**: Task display card with actions
- **CreateTaskModal**: Task creation form with NLP support
- **TaskDetail**: Detailed task view with comments

## 🔐 Authentication Flow

1. User logs in with username/email and password
2. Backend returns access token (15min) and refresh token (7 days)
3. Tokens stored in localStorage and sent with requests
4. Access token auto-refreshes when expired
5. User redirected to login if refresh fails

## 📡 API Integration

### API Client
The app uses a centralized Axios instance with:
- Automatic token injection
- Token refresh on 401 errors
- Request/response interceptors
- Error handling

### React Query
All API calls use React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading and error states

## 🎯 State Management

- **React Query**: Server state (API data)
- **Context API**: Global state (auth, theme)
- **React Hooks**: Local component state
- **Zustand**: (Optional) Client-side state

## 🧪 Testing

### Unit Tests
```bash
npm test
```

Tests use Vitest and React Testing Library:
- Component rendering
- User interactions
- State management
- Hooks behavior

### E2E Tests
```bash
npm run test:e2e
```

Tests use Playwright:
- User flows
- Authentication
- Task CRUD operations
- Navigation

## 🐳 Docker Deployment

### Build Docker image
```bash
docker build -t taskflow-frontend .
```

### Run container
```bash
docker run -p 80:80 -e VITE_API_BASE_URL=http://api.example.com/api/v1 taskflow-frontend
```

### Docker Compose
```bash
docker-compose up -d
```

## 🚀 Production Deployment

### Build for production
```bash
npm run build
```

The `dist/` folder contains optimized production build.

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Deploy to custom server
1. Build the application
2. Upload `dist/` folder to server
3. Configure Nginx/Apache to serve static files
4. Set up reverse proxy to backend API

## 🔧 Environment Variables

### Required
- `VITE_API_BASE_URL`: Backend API base URL

### Optional
- `VITE_APP_NAME`: Application name (default: "Smart Task Scheduler")

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: { ... },
      success: { ... },
      danger: { ... },
    }
  }
}
```

### Brand Identity
- Update logo in `public/`
- Modify app name in `.env`
- Customize colors in Tailwind config

## 🐛 Troubleshooting

### Development server not starting
- Check Node.js version (20+)
- Delete `node_modules` and reinstall
- Check port 5173 is available

### API requests failing
- Verify backend is running
- Check `VITE_API_BASE_URL` in `.env`
- Check browser console for errors

### Build failures
- Run `npm run lint` to check for errors
- Verify TypeScript types: `npx tsc --noEmit`
- Check for missing dependencies

## 📝 Best Practices

### Code Style
- Use TypeScript for all new files
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive commit messages

### Component Design
- Keep components small and focused
- Use composition over inheritance
- Implement error boundaries
- Add loading states

### Performance
- Lazy load routes
- Optimize images
- Use React.memo for expensive components
- Minimize re-renders

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

## 📄 License

ISC License

## 🆘 Support

For issues and questions:
- GitHub Issues: [Repository Issues]
- Documentation: [Docs Link]
- Email: support@example.com

## 🙏 Acknowledgments

- React Team
- Tailwind CSS
- TanStack Query
- Heroicons
- All open-source contributors
