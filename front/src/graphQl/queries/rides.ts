import { gql } from '@apollo/client';

export const GET_RIDES_BY_DRIVER = gql`
query {
    getRidesByDriver {
      id
      departure
      arrival
      date
      post {
        id
        postOwner {
          id
          name
          lastName
        }
      }
    }
  }
`;

export const GET_RIDES_BY_PASSENGER = gql`
query {
  getRidesByPassenger {
    id
    departure
    arrival
    date
    appUserRides {
      appUser {
        id
        name
        lastName
      }
    }
  }
}
`;
export const GET_USER = gql`
query {
  getAppUserInfo {
    id
    name
    lastName
  }
}
  `;


  export const CREATE_JOIN_REQUEST = gql`
  mutation CreateJoinRequest($postId: Int!) {
    createJoinRequest(postId: $postId) {
      id
      date
      ride {
        id
        departure
        arrival
      }
      user {
        id
        name
        lastName
      }
    }
  }
`;

export const DELETE_JOIN_REQUEST = gql`
  mutation DeleteJoinRequest($postId: Int!) {
    deleteJoinRequest(postId: $postId)
  }
`;


export const DELETE_POST = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(id: $postId)
  }
`;

export const UPDATE_POST_STATUS = gql`
  mutation UpdatePostStatus($id: Int!, $status: String!) {
    updatePost(id: $id, updatePostInput: { status: $status }) {
      id
      status
    }
  }
`;