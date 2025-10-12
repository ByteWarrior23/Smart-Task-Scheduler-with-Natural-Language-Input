# 🚀 Quick Start Guide - Smart Task Scheduler

Get up and running in 5 minutes!

## Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- MongoDB 5.0+ ([Download](https://www.mongodb.com/try/download/community))
- Git

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd smart-task-scheduler
```

## Step 2: Start Backend

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment
```bash
# Create .env file
cat > .env << EOF
MONGODB_URL=mongodb://localhost:27017/task-scheduler
JWT_ACCESS_TOKEN=$(openssl rand -hex 32)
JWT_REFRESH_TOKEN=$(openssl rand -hex 32)
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
EOF
```

### Start Server
```bash
npm start
```

✅ Backend running at http://localhost:3000

## Step 3: Start Frontend

### Open New Terminal
```bash
cd frontend
npm install
```

### Configure Environment
```bash
# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Smart Task Scheduler
EOF
```

### Start Dev Server
```bash
npm run dev
```

✅ Frontend running at http://localhost:5173

## Step 4: Create Your First Account

1. Open http://localhost:5173 in your browser
2. Click **"Sign up"**
3. Fill in the registration form:
   - Full Name: `John Doe`
   - Username: `johndoe`
   - Email: `john@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
4. Click **"Create account"**
5. You'll be redirected to login
6. Login with your credentials

## Step 5: Create Your First Task

### Option 1: Manual Entry
1. Click **"New Task"** button
2. Fill in the form:
   - Title: `Buy groceries`
   - Description: `Milk, eggs, bread`
   - Priority: `Medium`
   - Deadline: (select a date/time)
3. Click **"Create Task"**

### Option 2: Natural Language
1. Click **"New Task"** button
2. Toggle **"Use Natural Language"**
3. Type: `"Meeting with John tomorrow at 3pm for 1 hour high priority work"`
4. Click **"Parse & Fill Form"**
5. Review the auto-filled fields
6. Click **"Create Task"**

### Option 3: Voice Input
1. Click **"Voice"** button
2. Click **"Start Recording"**
3. Speak: `"Buy groceries tomorrow morning"`
4. Click **"Stop Recording"**
5. Click **"Create Task"**

## Step 6: Explore Features

### Dashboard
- View statistics (total, pending, completed, urgent)
- See urgent tasks highlighted
- Quick task status toggle

### All Tasks
- Search tasks
- Filter by status/priority/category
- View in card layout

### Task Details
- Click any task card
- View full details
- Add comments
- Update status
- Delete task

### Recurring Tasks
- Click **"Recurring"** button
- Set up tasks that repeat:
  - Daily standup
  - Weekly review
  - Monthly report
  - Yearly goals

### Analytics
- View completion rates
- See priority distribution
- Track productivity

### Profile
- Update your information
- Change password
- Configure email settings

### Dark Mode
- Click moon icon in navbar
- Toggle between light/dark themes

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongod --version

# Check port 3000 is available
lsof -i :3000

# View logs
cd backend && npm start
```

### Frontend won't start
```bash
# Check port 5173 is available
lsof -i :5173

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API connection errors
1. Verify backend is running: http://localhost:3000
2. Check `.env` file has correct API URL
3. Check browser console for errors
4. Verify CORS settings

### Database connection errors
```bash
# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS

# Check MongoDB is running
mongo --eval "db.version()"
```

## 📚 Next Steps

### Development
```bash
# Run tests
cd frontend && npm test
cd backend && node test-backend.js

# Run linter
cd frontend && npm run lint

# Build for production
cd frontend && npm run build
```

### Deployment
```bash
# Using Docker
docker-compose up -d

# Using deploy script
cd frontend && ./deploy.sh production
```

### Advanced Features

#### Enable Email Notifications
Add to backend `.env`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Enable Voice Transcription
Add to backend `.env`:
```env
WIT_API_KEY=your_wit_ai_api_key
```

Get API key from: https://wit.ai/

## 🎯 Common Tasks

### Create a Task with Natural Language
```
"Team meeting next Monday at 10am for 2 hours urgent work"
→ Creates task with all fields auto-filled
```

### Set Up Recurring Task
```
1. Click "Recurring" button
2. Title: "Daily Standup"
3. Start Date: Tomorrow 9:00 AM
4. Frequency: Daily
5. Duration: 15 minutes
```

### Search and Filter
```
1. Go to "All Tasks"
2. Type in search: "meeting"
3. Filter by priority: "High"
4. Sort by: "Deadline"
```

### Check Task Analytics
```
1. Go to "Analytics"
2. View completion rate
3. See priority distribution
4. Track trends over time
```

## 🆘 Need Help?

- **Documentation**: See README.md files
- **API Docs**: Check SETUP_INSTRUCTIONS.md
- **Issues**: GitHub Issues page
- **Email**: support@example.com

## 🎉 You're All Set!

Congratulations! You now have a fully functional task management system with:
- ✅ Authentication
- ✅ Task management
- ✅ Natural language input
- ✅ Voice commands
- ✅ Smart scheduling
- ✅ Analytics
- ✅ Dark mode

Enjoy managing your tasks efficiently! 🚀
