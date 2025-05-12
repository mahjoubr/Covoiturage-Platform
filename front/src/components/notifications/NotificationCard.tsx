/*import React from 'react';
import { formatTimeAgo } from './utils';
import { Notification } from '../../types';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'message':
      return '✉️';
    case 'like':
      return '❤️';
    case 'comment':
      return '💬';
    case 'follow':
      return '👤';
    case 'mention':
      return '@';
    default:
      return '🔔';
  }
};

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const {
    id,
    type,
    title,
    message,
    timestamp,
    read,
    sender,
    actionUrl
  } = notification;

  const handleClick = () => {
    console.log(`Clicked notification ${id}`);
    if (actionUrl) {
      console.log(`Navigating to ${actionUrl}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={`flex gap-4 p-4 rounded-md cursor-pointer shadow-sm transition
        bg-white dark:bg-gray-800 
        text-gray-800 dark:text-gray-100 
        ${!read ? 'border-l-4 border-blue-500' : 'border border-gray-200 dark:border-gray-700'}`}
    >
      <div className="text-2xl">{getNotificationIcon(type)}</div>

      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimeAgo(timestamp)}
          </span>
        </div>
        <p className="text-sm">{message}</p>

        {sender && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            From: {sender.name}
          </div>
        )}
      </div>

      {!read && (
        <span className="w-2 h-2 rounded-full bg-blue-500 self-center" aria-label="Unread notification"></span>
      )}
    </div>
  );
};

export default NotificationCard;
*/// NotificationCard.tsx
import React from 'react';
import { formatTimeAgo } from './utils';
import { Notification } from '../../types';
import { useNotifications } from './Notifications';
import { EventType } from '../../types/events';

const getNotificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    [EventType.POST_UPDATED]: '📝',
    [EventType.NEW_COMMENT]: '💬',
    [EventType.JOIN_REQUEST]: '🙋',
    [EventType.JOIN_ACCEPT]: '✅',
    [EventType.RIDE_DELETE]: '❌',
    [EventType.RIDE_START]: '🚗',
    [EventType.REVIEW_ADDED]: '⭐',
  };
  return icons[type] || '🔔';
};

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={`flex gap-4 p-4 rounded-md cursor-pointer shadow-sm transition
        bg-white dark:bg-gray-800 
        text-gray-800 dark:text-gray-100 
        ${!notification.read ? 'border-l-4 border-blue-500' : 'border border-gray-200 dark:border-gray-700'}`}
    >
      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{notification.title}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimeAgo(notification.timestamp)}
          </span>
        </div>
        <p className="text-sm">{notification.message}</p>
      </div>

      {!notification.read && (
        <span className="w-2 h-2 rounded-full bg-blue-500 self-center" aria-label="Unread notification"></span>
      )}
    </div>
  );
};

export default NotificationCard;