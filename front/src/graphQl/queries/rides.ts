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
