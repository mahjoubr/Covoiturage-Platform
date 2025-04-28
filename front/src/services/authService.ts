
import client from "../graphQl/client";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../graphQl/queries/auth";

export const login = async (email: string, password: string) => {
  const { data } = await client.mutate({
    mutation: LOGIN_MUTATION,
    variables: { input: { email, password } }
  });
  return data.login;
};

export async function signup(email: string, password: string, name: string, lastName: string) {
  try {
    const response = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: { email, password, name, lastName }
      }
    });

    if (!response || !response.data.register) {
      throw new Error("Signup failed");
    }

    return response.data.register;
  } catch (error) {
    throw new Error("Signup failed");
  }
}