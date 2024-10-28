import React, { useEffect, useState } from "react";
import styles from "../styles/BrowseMentors.module.css"; // Create a CSS file for styling
import defaultAvatar from "../assets/default-avatar.jpeg";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  location: string;
}

const BrowseMentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [followedMentors, setFollowedMentors] = useState<string[]>([]); // To track followed mentors

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`http://localhost:5001/mentors`);
        const data = await res.json();
        setMentors(data);
      } catch (err) {
        console.error("Failed to load mentors", err);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const name = mentor.name?.toLowerCase() || "";
    const specialty = mentor.specialty?.toLowerCase() || "";
    const location = mentor.location?.toLowerCase() || "";

    return (
      name.includes(searchQuery.toLowerCase()) ||
      specialty.includes(searchQuery.toLowerCase()) ||
      location.includes(searchQuery.toLowerCase())
    );
  });

  const handleFollowToggle = (mentorId: string) => {
    setFollowedMentors(
      (prev) =>
        prev.includes(mentorId)
          ? prev.filter((id) => id !== mentorId) // Unfollow if already followed
          : [...prev, mentorId] // Follow if not already followed
    );
  };

  return (
    <div className={styles.container}>
      <h2>Browse Mentors</h2>
      <input
        type="text"
        placeholder="Search by name, skill, or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.mentorList}>
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <div key={mentor.id} className={styles.mentorCard}>
              <img
                src={mentor.image || defaultAvatar}
                alt={mentor.name}
                className={styles.mentorImage}
              />
              <div className={styles.mentorDetails}>
                <h3>{mentor.name}</h3>
                <p>{mentor.specialty}</p>
                <div className={styles.mentorLocation}>
                  <FaMapMarkerAlt />
                  <span>{mentor.location}</span>
                </div>
                <button
                  onClick={() => handleFollowToggle(mentor.id)}
                  className={`${styles.followButton} ${
                    followedMentors.includes(mentor.id) ? styles.followed : ""
                  }`}
                >
                  {followedMentors.includes(mentor.id) ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No mentors found.</p>
        )}
      </div>
    </div>
  );
};

export default BrowseMentors;
