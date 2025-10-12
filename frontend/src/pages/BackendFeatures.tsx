import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { 
  ShieldCheckIcon, 
  DocumentCheckIcon,
  MicrophoneIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  BellIcon,
  SparklesIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const BackendFeatures: React.FC = () => {
  const featureCategories = [
    {
      name: 'Authentication & Security',
      icon: ShieldCheckIcon,
      color: 'from-blue-500 to-cyan-500',
      features: [
        { name: 'User Registration', implemented: true, endpoint: 'POST /api/v1/auth/register' },
        { name: 'User Login (Username/Email)', implemented: true, endpoint: 'POST /api/v1/auth/login' },
        { name: 'JWT Access Tokens', implemented: true, endpoint: 'All authenticated routes' },
        { name: 'Refresh Token System', implemented: true, endpoint: 'POST /api/v1/auth/refresh' },
        { name: 'Automatic Token Refresh', implemented: true, endpoint: 'Axios interceptor' },
        { name: 'Logout', implemented: true, endpoint: 'POST /api/v1/auth/logout' },
        { name: 'Get Current User', implemented: true, endpoint: 'GET /api/v1/auth/me' },
        { name: 'Update Profile', implemented: true, endpoint: 'PATCH /api/v1/auth/update' },
        { name: 'Change Password', implemented: true, endpoint: 'PATCH /api/v1/auth/change-password' },
        { name: 'Delete Account', implemented: true, endpoint: 'DELETE /api/v1/auth/delete' },
        { name: 'Email Configuration', implemented: true, endpoint: 'PATCH /api/v1/auth/email-config' },
      ],
    },
    {
      name: 'Task Management (CRUD)',
      icon: DocumentCheckIcon,
      color: 'from-green-500 to-emerald-500',
      features: [
        { name: 'Create Task', implemented: true, endpoint: 'POST /api/v1/tasks' },
        { name: 'Get All Tasks', implemented: true, endpoint: 'GET /api/v1/tasks' },
        { name: 'Get Task by ID', implemented: true, endpoint: 'GET /api/v1/tasks/:id' },
        { name: 'Update Task', implemented: true, endpoint: 'PATCH /api/v1/tasks/:id' },
        { name: 'Delete Task', implemented: true, endpoint: 'DELETE /api/v1/tasks/:id' },
        { name: 'Mark as Completed', implemented: true, endpoint: 'PATCH /api/v1/tasks/:id/complete' },
        { name: 'Mark as Pending', implemented: true, endpoint: 'PATCH /api/v1/tasks/:id/pending' },
        { name: 'Archive Task', implemented: true, endpoint: 'PATCH /api/v1/tasks/:id/archive' },
        { name: 'Unarchive Task', implemented: true, endpoint: 'PATCH /api/v1/tasks/:id/unarchive' },
        { name: 'Task Comments', implemented: true, endpoint: 'POST/GET /api/v1/tasks/:id/comments' },
        { name: 'Task Priority Levels', implemented: true, endpoint: 'low, medium, high, urgent' },
        { name: 'Task Categories', implemented: true, endpoint: 'work, personal, study, etc.' },
      ],
    },
    {
      name: 'Natural Language Processing',
      icon: SparklesIcon,
      color: 'from-purple-500 to-pink-500',
      features: [
        { name: 'Parse Natural Language', implemented: true, endpoint: 'POST /api/v1/tasks/nlp/parse' },
        { name: 'Extract Title', implemented: true, endpoint: 'NLP Service' },
        { name: 'Extract Description', implemented: true, endpoint: 'NLP Service' },
        { name: 'Extract Deadline', implemented: true, endpoint: 'Chrono-node parsing' },
        { name: 'Extract Priority', implemented: true, endpoint: 'Bayes classifier' },
        { name: 'Extract Category', implemented: true, endpoint: 'Bayes classifier' },
        { name: 'Extract Duration', implemented: true, endpoint: 'Pattern matching' },
        { name: 'Auto-categorization', implemented: true, endpoint: 'Natural library' },
        { name: 'Confidence Scoring', implemented: true, endpoint: 'NLP Service' },
      ],
    },
    {
      name: 'Voice Input',
      icon: MicrophoneIcon,
      color: 'from-orange-500 to-red-500',
      features: [
        { name: 'Audio Transcription', implemented: true, endpoint: 'POST /api/v1/voice/transcribe' },
        { name: 'Speech to Task', implemented: true, endpoint: 'POST /api/v1/voice/parse' },
        { name: 'Direct Task Creation', implemented: true, endpoint: 'POST /api/v1/voice/create-task' },
        { name: 'File Upload Support', implemented: true, endpoint: 'Multer middleware' },
        { name: 'Wit.ai Integration', implemented: true, endpoint: 'Speech service' },
      ],
    },
    {
      name: 'Recurring Tasks',
      icon: ArrowPathIcon,
      color: 'from-indigo-500 to-blue-500',
      features: [
        { name: 'Create Recurring Task', implemented: true, endpoint: 'POST /api/v1/tasks/recurring' },
        { name: 'Get Recurring Tasks', implemented: true, endpoint: 'GET /api/v1/tasks/recurring' },
        { name: 'Get Task Instances', implemented: true, endpoint: 'GET /api/v1/tasks/recurring/:id/instances' },
        { name: 'Update Recurring Task', implemented: true, endpoint: 'PUT /api/v1/tasks/recurring/:id' },
        { name: 'Delete Recurring Task', implemented: true, endpoint: 'DELETE /api/v1/tasks/recurring/:id' },
        { name: 'RRule Support', implemented: true, endpoint: 'RRule library' },
        { name: 'Daily Recurrence', implemented: true, endpoint: 'FREQ=DAILY' },
        { name: 'Weekly Recurrence', implemented: true, endpoint: 'FREQ=WEEKLY' },
        { name: 'Monthly Recurrence', implemented: true, endpoint: 'FREQ=MONTHLY' },
        { name: 'Custom Intervals', implemented: true, endpoint: 'RRule configuration' },
      ],
    },
    {
      name: 'Search, Filter & Sort',
      icon: MagnifyingGlassIcon,
      color: 'from-yellow-500 to-orange-500',
      features: [
        { name: 'Search Tasks', implemented: true, endpoint: 'GET /api/v1/tasks/search?query=' },
        { name: 'Filter by Category', implemented: true, endpoint: 'GET /api/v1/tasks/category/:cat' },
        { name: 'Filter by Status', implemented: true, endpoint: 'Query params' },
        { name: 'Filter by Priority', implemented: true, endpoint: 'Query params' },
        { name: 'Sort by Deadline', implemented: true, endpoint: 'GET /api/v1/tasks/sort/deadline' },
        { name: 'Sort by Priority', implemented: true, endpoint: 'GET /api/v1/tasks/sort/priority' },
        { name: 'Sort by Creation Date', implemented: true, endpoint: 'GET /api/v1/tasks/sort/created' },
        { name: 'Sort by Time Required', implemented: true, endpoint: 'GET /api/v1/tasks/sort/time-required' },
        { name: 'Pagination Support', implemented: true, endpoint: 'Query params' },
      ],
    },
    {
      name: 'Smart Scheduling',
      icon: ClockIcon,
      color: 'from-teal-500 to-green-500',
      features: [
        { name: 'Conflict Detection', implemented: true, endpoint: 'NLP Service' },
        { name: 'Time Slot Suggestions', implemented: true, endpoint: 'NLP Service' },
        { name: 'Working Hours Detection', implemented: true, endpoint: 'NLP Service' },
        { name: 'Free Slot Finding', implemented: true, endpoint: 'NLP Service' },
        { name: 'Task Duration Analysis', implemented: true, endpoint: 'NLP Service' },
      ],
    },
    {
      name: 'Reminders & Notifications',
      icon: BellIcon,
      color: 'from-pink-500 to-rose-500',
      features: [
        { name: 'Get Reminder Stats', implemented: true, endpoint: 'GET /api/v1/tasks/reminders/stats' },
        { name: 'Schedule Reminder', implemented: true, endpoint: 'POST /api/v1/tasks/:id/reminder' },
        { name: 'Check Deadlines', implemented: true, endpoint: 'GET /api/v1/tasks/deadlines/check' },
        { name: 'Email Reminders', implemented: true, endpoint: 'Cron jobs' },
        { name: 'Overdue Detection', implemented: true, endpoint: 'Reminder service' },
        { name: 'Upcoming Deadlines', implemented: true, endpoint: 'Reminder service' },
        { name: 'Background Jobs', implemented: true, endpoint: 'Node-cron' },
      ],
    },
    {
      name: 'Email Services',
      icon: EnvelopeIcon,
      color: 'from-cyan-500 to-blue-500',
      features: [
        { name: 'Send Welcome Email', implemented: true, endpoint: 'POST /api/v1/tasks/send-welcome-email' },
        { name: 'Deadline Reminders', implemented: true, endpoint: 'Email service' },
        { name: 'Overdue Notifications', implemented: true, endpoint: 'Email service' },
        { name: 'User Email Config', implemented: true, endpoint: 'User model' },
        { name: 'Nodemailer Integration', implemented: true, endpoint: 'Email service' },
      ],
    },
    {
      name: 'Analytics & Statistics',
      icon: ChartBarIcon,
      color: 'from-violet-500 to-purple-500',
      features: [
        { name: 'Task Statistics', implemented: true, endpoint: 'Frontend calculation' },
        { name: 'Completion Rate', implemented: true, endpoint: 'Frontend calculation' },
        { name: 'Priority Distribution', implemented: true, endpoint: 'Frontend calculation' },
        { name: 'Category Breakdown', implemented: true, endpoint: 'Frontend calculation' },
        { name: 'Time Tracking', implemented: true, endpoint: 'Task model' },
      ],
    },
    {
      name: 'Role-Based Access',
      icon: UserGroupIcon,
      color: 'from-red-500 to-pink-500',
      features: [
        { name: 'User Roles', implemented: true, endpoint: 'User model (user/admin)' },
        { name: 'Protected Routes', implemented: true, endpoint: 'Auth middleware' },
        { name: 'JWT Verification', implemented: true, endpoint: 'Auth middleware' },
        { name: 'Token Expiry Handling', implemented: true, endpoint: 'JWT configuration' },
      ],
    },
  ];

  const totalFeatures = featureCategories.reduce((sum, cat) => sum + cat.features.length, 0);
  const implementedFeatures = featureCategories.reduce(
    (sum, cat) => sum + cat.features.filter(f => f.implemented).length,
    0
  );
  const completionRate = Math.round((implementedFeatures / totalFeatures) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Backend Features Coverage
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Complete integration of all backend API endpoints and services
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-2xl">
              <div className="text-4xl font-bold">{completionRate}%</div>
              <div className="text-sm">Completion Rate</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-2xl">
              <div className="text-4xl font-bold">{implementedFeatures}</div>
              <div className="text-sm">Features Implemented</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl">
              <div className="text-4xl font-bold">{featureCategories.length}</div>
              <div className="text-sm">Feature Categories</div>
            </div>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="grid gap-6">
          {featureCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <category.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-white/80">
                      {category.features.filter(f => f.implemented).length} / {category.features.length} features
                    </p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-3">
                  {category.features.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 hover:scale-105 transition-transform"
                    >
                      {feature.implemented ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {feature.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                          {feature.endpoint}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">✅ 100% Backend Integration Complete!</h3>
          <p className="text-lg text-white/90">
            All {totalFeatures} backend features have been fully implemented and integrated into the frontend.
          </p>
        </div>
      </div>
    </div>
  );
};
