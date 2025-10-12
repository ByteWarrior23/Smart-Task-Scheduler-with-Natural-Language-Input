import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'All Tasks', href: '/tasks', icon: CheckCircleIcon, color: 'text-green-600 dark:text-green-400' },
  { name: 'Recurring Tasks', href: '/tasks/recurring', icon: ArrowPathIcon, color: 'text-purple-600 dark:text-purple-400' },
  { name: 'Archived', href: '/tasks/archived', icon: ArchiveBoxIcon, color: 'text-orange-600 dark:text-orange-400' },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, color: 'text-pink-600 dark:text-pink-400' },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, color: 'text-gray-600 dark:text-gray-400' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-xl">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/50 scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'p-2 rounded-lg transition-all',
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                  )}>
                    <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : item.color)} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom decoration */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 p-4 shadow-xl">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-white mb-1">
                🚀 Pro Tip
              </h3>
              <p className="text-xs text-white/90">
                Use voice input for hands-free task creation!
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </aside>
    </>
  );
};
