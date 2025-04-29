export interface Drive {
    from: string;
    to: string;
    date: string;
    riders: string[];
  }

  export interface Ride {
    from: string;
    to: string;
    date: string;
    driver: string;
  }
  export interface Review {
    id: number;
    stars: number;
    comment: string;
    date: string; 
    reviewer: {
      id: number;
      username: string;
    };
    reviewedUser: {
      id: number;
      username: string;
    };
  }
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