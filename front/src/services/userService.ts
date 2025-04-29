import client from "../graphQl/client";
import { UPDATE_USER } from "../graphQl/mutations/userProfile";
import { GET_APPUSER_INFO } from "../graphQl/queries/userProfile";
import { UpdateAppUserInput } from "../types";

export const fetchUserById = async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const { data } = await client.query({
      query: GET_APPUSER_INFO,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      fetchPolicy: 'network-only',
    });

  
    return data.getAppUserInfo;
  };
  
  export const updateUser = async (updateAppUserInput: UpdateAppUserInput) => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('User is not authenticated');
    }
  
    const { data } = await client.mutate({
      mutation: UPDATE_USER,
      variables: { updateAppUserInput }, 
      context: {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      },
    });
  
    return data.updateAppUser;
  };