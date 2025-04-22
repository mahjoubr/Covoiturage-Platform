export interface RidePost {
  id: string;
  date: string;
  from: string;
  to: string;
  riders?: string[];
  driver?: string;
  isYourRide: boolean;
  isRideYouTook: boolean;
  postId: string;
}