// src/graphQl/queries/reviewQueries.ts
import { gql } from '@apollo/client';

export const GET_MY_REVIEWS = gql`
  query GetMyReviews {
    getMyReviews {
      id
      stars
      comment
      date
      reviewer {
        name
        lastName
      }
      
    }
  }
`;

export const GET_AVERAGE_RATING = gql`
  query GetAverageRating {
    getAverageRating 
  }
`;
