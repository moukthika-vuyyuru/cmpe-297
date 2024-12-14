import axios from "axios";
import {APIURL} from "../Utilities/Apiurl";

const API_URL = '${APIURL}/mentors';

// Get All Mentors
export const getAllMentors = async () => {
  const response = await axios.get(API_URL);
  console.log("Mentors fetched:", response.data);
  return response.data;
};
