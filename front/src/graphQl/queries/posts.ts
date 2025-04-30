import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query {
  getPosts {
    id
      destination
      departure
      date
      time
      seatCount
      frequency
      description
      price
      contactInfo
      postOwner {
        name
        lastName
      }
      comments{
        text
        date
        commenter{
          name
          lastName
        }
      }
  }
}

`;
export const GET_POST_BY_ID = gql`
  query {
  getPostById {
    id
      destination
      departure
      date
      time
      seatCount
      frequency
      description
      price
      contactInfo
      postOwner {
        name
        lastName
      }
      comments{
        text
        date
        commenter{
          name
          lastName
        }
      }
  }
}

`;

