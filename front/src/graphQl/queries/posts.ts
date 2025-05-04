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
  query GetPostById($id: String!) {
    getPostById(id: $id) {
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
        id
        name
        lastName
      }
      comments {
        id
        text
        date
        commenter{
          id
          name
          lastName
        }
      }
      listRide {
        id
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
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
    }
  }
`;
export const CREATE_COMMENT = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      commenter {
        id
        name
        lastName
      }
      text
      post {
        id
      }
      date
    }
  }
`;


export const GET_RIDE = gql`
query GetMatchingRide($postId: Int!) {
  matchingRide(postId: $postId) {
    id
    post{
      postOwner{
      id
      }
    }
  }
}
  `;
  export const GET_JOIN_REQUESTS = gql`
  query GetJoinRequestsByRideUser($rideId: Int!, $userId: Int!) {
    getJoinRequestsByRideUser(rideId: $rideId, userId: $userId) {
      id
    }
  }
`;



