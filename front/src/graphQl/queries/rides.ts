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
          username
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
        lasname
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
    lasname
      
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