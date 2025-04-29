import React from 'react';
import { Bell } from 'lucide-react';
import NotificationCard from './NotificationCard';
import { Notification } from '../../types';
import { mockNotifications } from './mockData';
import './Notifications.css';

const Notifications: React.FC = () => {
  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-count">
          <Bell size={20} />
          <span>{mockNotifications.filter(n => !n.read).length}</span>
        </div>
      </header>
      
      <div className="notifications-list">
      {mockNotifications.map((notification) => (
  <NotificationCard key={notification.id} notification={notification} />
))}

      </div>
      
      {mockNotifications.length === 0 && (
        <div className="empty-state">
          <Bell size={48} />
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;