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
  metadata?: Record<string, any>;
  userId?: string;
}



export interface SSEEventData {
  type: EventType | 'connection' | 'heartbeat';
  message?: string;
  timestamp: string;
  userId?: string;
  postId?: string;
  rideId?: string;
  groupId?: string;
  commentId?: string;
  reviewId?: string;
  reportId?: string;
  groupName?: string;
  postTitle?: string;
  userName?: string;
  rideTitle?: string;
  [key: string]: any;
}
