import { gql } from "@apollo/client";

export const GET_REVIEW_FORM_DATA = gql`
  query GetReviewFormData($rideId: Int!, $reviewedUserId: Int!) {
    reviewFormData(rideId: $rideId, reviewedUserId: $reviewedUserId) {
      reviewedUser {
        id
        name
        imageUrl
      }
      ride {
        id
        departure
        date
        arrival
        price
        time
      }
    }
  }
`;


export const GET_MY_REVIEWS = gql`
  query GetMyReviews {
    getMyReviews {
      id rating comment createdAt
      ride { id departure arrival date time price }
      reviewedUser { id name lastName imageUrl }
    }
  }
`;

export const GET_USER_REVIEWS = gql`
  query GetUserReviews($userId: Int!) {
    getUserReviews(userId: $userId) {
      id rating comment createdAt
      ride { id departure arrival date time price }
      reviewerUser { id name lastName imageUrl }
    }
  }
`;