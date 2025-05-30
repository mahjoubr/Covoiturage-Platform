import { EventType } from './events';
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  sender?: User;
  metadata?: Record<string, any>;
}




export interface SSEEventData {
  type: EventType | 'connection' | 'heartbeat';
  message?: string;
  timestamp: string;
  postId?: number;
  commentId?: number;
  groupId?: number;
  rideId?: number;
  userId?: number;
  [key: string]: any;
}