import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/common/Button';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Button onClick={toggleTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <p className="text-gray-600 dark:text-gray-400">Email: {user?.email}</p>
          <p className="text-gray-600 dark:text-gray-400">Username: {user?.username}</p>
        </div>
      </div>
    </div>
  );
};
