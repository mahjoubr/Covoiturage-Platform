import React from 'react';
import { Bell } from 'lucide-react';
import NotificationCard from './NotificationCard';
import { mockNotifications } from './mockData';

const Notifications: React.FC = () => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between border-b pb-2 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Notifications</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Bell size={20} />
          <span>{unreadCount}</span>
        </div>
      </header>

      <div className="space-y-4">
        {mockNotifications.length > 0 ? (
          mockNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
            <Bell size={48} />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
