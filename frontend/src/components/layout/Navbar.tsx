import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  Bars3Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';
import { useReminderStats } from '@/hooks/useTasks';
import { Fragment } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: reminderStats } = useReminderStats();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-xl">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Link
              to="/reminders"
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105"
            >
              <BellIcon className="h-6 w-6" />
              {reminderStats && reminderStats.total > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-[10px] font-bold text-white">
                    {reminderStats.total > 9 ? '9+' : reminderStats.total}
                  </span>
                </span>
              )}
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105 hover:rotate-12"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-indigo-600" />
              )}
            </button>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full blur opacity-60"></div>
                  <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.fullname?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
                  {user?.fullname?.split(' ')[0] || user?.username}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600">
                    <p className="text-sm font-semibold text-white">
                      {user?.fullname}
                    </p>
                    <p className="text-sm text-white/80 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={cn(
                            'flex items-center px-4 py-3 text-sm font-medium transition-colors',
                            active
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-gray-300'
                          )}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-3" />
                          Profile Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={cn(
                            'flex items-center w-full px-4 py-3 text-sm font-medium transition-colors',
                            active
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              : 'text-gray-700 dark:text-gray-300'
                          )}
                        >
                          <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};
