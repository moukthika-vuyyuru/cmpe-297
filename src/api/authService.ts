import axios from "axios";
import {APIURL} from "../Utilities/Apiurl";


const API_URL = `${APIURL}/users`;

// Login API
export const login = async (username: string, password: string) => {
  const response = await axios.get(API_URL);
  const user = response.data.find(
    (u: { username: string; password: string }) =>
      u.username === username && u.password === password
  );
  if (!user) throw new Error("Invalid credentials");
  return user;
};

// Register API
export const register = async (username: string, password: string) => {
  const newUser = { username, password, loggedIn: false };
  const response = await axios.post(API_URL, newUser);
  return response.data;
};
