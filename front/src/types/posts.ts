export interface CarpoolPost {
    id: string;
    destination: string;
    departure: string;
    date: string;
    time: string;
    seatCount: number;
    driverName: string;
    frequency: string;
    description?: string;
    price?: number;
    contactInfo?: string;
    comments? : Comment[];
  }
  
  export interface CreatePostFormData {
    destination: string;
    departure: string;
    date: string;
    time: string;
    seatCount: number;
    driverName: string;
    frequency: string;
    description?: string;
    price?: number;
    contactInfo?: string;
  }
 export interface Comment {
    id: string;
    author: string;
    text: string;
    timestamp: Date;
    postId: string; 
  }