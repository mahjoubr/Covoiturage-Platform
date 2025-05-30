// NotificationProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Notification } from '../../types/Notification';
import { EventType, SSEEventData } from '../../types/events';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
  isConnected: boolean;
  reconnect: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const reconnectAttempts = useRef(0);

  // Get user from localStorage or your auth context
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

  const getActionUrl = (data: SSEEventData): string => {
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
    setNotifications((prev) => {
      // Prevent duplicate notifications
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      // Limit to last 100 notifications to prevent memory issues
      const updated = [notification, ...prev];
      return updated.slice(0, 100);
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true })),
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  }, []);

  const connectSSE = useCallback(() => {
    if (!user?.id) {
      console.warn('No user ID available for SSE connection');
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const eventSource = new EventSource(`${apiUrl}/events/stream/${user.id}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connection established');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEventData = JSON.parse(event.data);
        
        // Handle different event types
        switch (data.type) {
          case 'connection':
            console.log('SSE connection confirmed:', data.message);
            break;
          case 'heartbeat':
            // Just log heartbeat, no need to create notification
            console.debug('SSE heartbeat received');
            break;
          default:
            // Handle actual notification events
            if (Object.values(EventType).includes(data.type as EventType)) {
              const notification: Notification = {
                id: `sse-${Date.now()}-${Math.random()}`,
                type: data.type,
                title: getNotificationTitle(data.type as EventType),
                message: data.message || 'New notification',
                timestamp: new Date(data.timestamp),
                read: false,
                actionUrl: getActionUrl(data),
                metadata: data,
              };
              addNotification(notification);
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setIsConnected(false);
      eventSource.close();
      
      // Implement exponential backoff for reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000; // 1s, 2s, 4s, 8s, 16s
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          connectSSE();
        }, delay);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };
  }, [user?.id, addNotification]);

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    connectSSE();
  }, [connectSSE]);

  // Initialize SSE connection
  useEffect(() => {
    if (user?.id) {
      connectSSE();
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user?.id, connectSSE]);

  // Handle page visibility changes to reconnect when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && user?.id) {
        console.log('Tab became visible, checking SSE connection...');
        // Small delay to ensure the connection state is accurate
        setTimeout(() => {
          if (!isConnected) {
            reconnect();
          }
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, user?.id, reconnect]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ 
        notifications, 
        addNotification, 
        markAsRead, 
        markAllAsRead,
        removeNotification,
        unreadCount,
        isConnected,
        reconnect
      }}
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

export default NotificationProvider;