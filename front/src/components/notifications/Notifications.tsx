/*import React from 'react';
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

export default Notifications;*/

// NotificationProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Notification } from '../../types';
import { EventType } from '../../types/events';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const Notifications: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

   const getNotificationTitle = (type: EventType): string => {
    const titles: Record<EventType, string> = {
      [EventType.POST_UPDATED]: 'Post Updated',
      [EventType.NEW_COMMENT]: 'New Comment',
      [EventType.JOIN_REQUEST]: 'Join Request',
      [EventType.JOIN_ACCEPT]: 'Join Accepted',
      [EventType.RIDE_DELETE]: 'Ride Deleted',
      [EventType.RIDE_START]: 'Ride Started',
      [EventType.REVIEW_ADDED]: 'New Review',
    };
    return titles[type] || 'New Notification';
  };

  const getActionUrl = (data: { type: EventType } & Record<string, any>): string => {
    switch (data.type) {
      case EventType.POST_UPDATED:
      case EventType.NEW_COMMENT:
        return `/posts/${data.postId}`;
      case EventType.RIDE_DELETE:
      case EventType.RIDE_START:
        return `/rides/${data.rideId}`;
      case EventType.JOIN_REQUEST:
      case EventType.JOIN_ACCEPT:
        return `/groups/${data.groupId}`;
      case EventType.REVIEW_ADDED:
        return `/users/${data.userId}`;
      default:
        return '/notifications';
    }
  };

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const eventSource = new EventSource(
      `http://localhost:3000/events/stream/${user.id}`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const notification: Notification = {
        id: `sse-${Date.now()}`,
        type: data.type,
        title: getNotificationTitle(data.type),
        message: data.message,
        timestamp: new Date(),
        read: false,
        actionUrl: getActionUrl(data),
      };
      addNotification(notification);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      // Implement reconnection logic here
    };

    return () => {
      eventSource.close();
    };
  }, [user?.id, addNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};
export default Notifications;