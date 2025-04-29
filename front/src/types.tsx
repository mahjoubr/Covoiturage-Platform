export interface Ride {
    from: string;
    to: string;
    date: string;
    riders: string[];
  }
  export interface Sender {
    id: string;
    name: string;
    avatar?: string;
  }
  
  export interface Notification {
    id: string;
    type: 'message' | 'like' | 'comment' | 'follow' | 'mention' | 'other';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    sender?: Sender;
    actionUrl?: string;
  }