import React from 'react';
import { formatTimeAgo } from './utils';
import { Notification } from '../../types';
import './NotificationCard.css';

// Icon mapping function
const getNotificationIcon = (type: string) => {
  // In a real implementation, we'd import and use actual icons
  // For now, we'll return a simplified version
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
    // In a real implementation, this would:
    // 1. Mark the notification as read
    // 2. Navigate to actionUrl if provided
    console.log(`Clicked notification ${id}`);
    if (actionUrl) {
      console.log(`Navigating to ${actionUrl}`);
    }
  };

  return (
    <div 
      className={`notification-card ${!read ? 'unread' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="notification-icon">
        {getNotificationIcon(type)}
      </div>
      
      <div className="notification-content">
        <div className="notification-header">
          <h3>{title}</h3>
          <span className="notification-time">{formatTimeAgo(timestamp)}</span>
        </div>
        
        <p className="notification-message">{message}</p>
        
        {sender && (
          <div className="notification-sender">
            From: {sender.name}
          </div>
        )}
      </div>
      
      {!read && <div className="unread-indicator" aria-label="Unread notification"></div>}
    </div>
  );
};

export default NotificationCard;