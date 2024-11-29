import axios from "axios";

const API_URL = "http://localhost:8080/mentors";

// Get All Mentors
export const getAllMentors = async () => {
  const response = await axios.get(API_URL);
  console.log("Mentors fetched:", response.data);
  return response.data;
};
