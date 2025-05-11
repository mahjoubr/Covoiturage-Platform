import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getUsers = async () => {
  return axios.get(`${API_URL}/users`);
};
