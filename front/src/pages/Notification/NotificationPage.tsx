// src/pages/NotificationPage.tsx
import React from 'react';
import Notifications from '../../components/notifications/Notifications';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const NotificationPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="mx-auto max-w-full pt-1 p-4 md:pt-4 md:p-6">
      {/* Breadcrumb + Dark Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 mt-0 pt-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Notifications</h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <a
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                href="/"
              >
                Home
                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">Notifications</li>
          </ol>
        </nav>
      </div>

      {/* Notifications Component */}
      <Notifications />
    </div>
  );
};

export default NotificationPage;
