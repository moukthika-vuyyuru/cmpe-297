import React, { useEffect, useState } from "react";
import MentorCard from "./MentorCard";
import { Mentor } from "../types";
import styles from "../styles/MentorList.module.css";

const API_URL = "http://localhost:8080/mentors"; // Your API endpoint

const MentorList: React.FC = React.memo(() => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("MentorList component rendered");

  // Fetch mentors from the API
  useEffect(() => {
    let isMounted = true; // Track if component is mounted to prevent state updates on unmounted component

    const fetchMentors = async () => {
      console.log("Fetching mentors from API...");
      try {
        const response = await fetch(API_URL); // Make a GET request to the API
        if (!response.ok) {
          throw new Error(`Error fetching mentors: ${response.statusText}`); // Handle non-2xx responses
        }
        const data: Mentor[] = await response.json(); // Parse the JSON data
        console.log("Mentors fetched:", data);
        if (isMounted) {
          setMentors(data); // Set the fetched mentors to state
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        if (isMounted) {
          setLoading(false); // Stop loading on success or error
        }
      }
    };

    fetchMentors(); // Call the function once

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false on unmount
    };
  }, []); // Empty dependency array to ensure it only runs once

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <div className={styles.mentorList}>
      {mentors.slice(0, 6).map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  );
});

export default MentorList;
