import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser($updateAppUserInput: UpdateAppUserInput!) {
    updateAppUser(updateAppUserInput: $updateAppUserInput) {
      id
      name
      lastName
      email
      phoneNumber
      dateOfBirth
      password
    }
  }
`;