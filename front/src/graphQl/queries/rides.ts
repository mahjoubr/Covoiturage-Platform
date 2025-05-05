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

export const GET_RIDES_DRIVER_PAGINATED = gql`
query GetRidesPaginatedByDriver($page: Int!, $limit: Int!) {
  getRidesPaginatedByDriver(page: $page, limit: $limit) {
    data {
      date
      departure
      arrival
      time
      state
      appUserRides {
      appUser {
        name
        lastName
      }
    }

    }
    totalItems
    totalPages
    currentPage
  }
}
`;

export const GET_RIDES_PASSENGER_PAGINATED = gql`
query GetRidesPaginatedByPassenger($page: Int!, $limit: Int!) {
  getRidesPaginatedByPassenger(page: $page, limit: $limit) {
    data {
      date
      departure
      arrival
      time
      state
      driver{
      
        name
        lastName
      
      }
    }
    totalItems
    totalPages
    currentPage
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