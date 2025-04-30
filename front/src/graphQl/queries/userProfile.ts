import { gql } from '@apollo/client';

export const GET_APPUSER_INFO = gql`
  query getAppUserInfo {
    getAppUserInfo {
      name
      lastName
      email
      phoneNumber
      dateOfBirth
      imageUrl
    }
  }
`;

export const GET_APPUSER_PHOTO = gql`
  query getAppUserPhoto {
    getAppUserInfo {
      imageUrl
      name
      lastName
    }
  }
`;
