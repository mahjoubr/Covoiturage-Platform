import { Review, Ride } from "../types";

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
    commenter: AppUser;
    text: string;
    timestamp: Date;
    postId: string; 
  }
  export interface User {
    id: number;
    email: string;
    password: string;
    role: 'user' | 'admin';
  }
  
  export interface AppUser extends User {
    name: string;
    lastName: string;
    dateOfBirth: string; // ISO string (as Date is usually serialized)
    phoneNumber: string;
    imageUrl: string;
    rating: number;
    posts: CarpoolPost[];
    reviews: Review[];
    appUserRides: AppUserRide[];
  }
  
export interface AppUserRide {
  id: number;
  ride: Ride;
  appUser: AppUser;
}