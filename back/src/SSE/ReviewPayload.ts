export interface ReviewPayload {
    reviewId: number;
    reviewerId: number;
    reviewerName: string;
    reviewerLastName: string;
    reviewContent?: string;
    rating: number;
    date: string;
  }
  