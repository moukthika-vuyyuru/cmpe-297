import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenteeList.module.css"; // Adjust the path as needed
import defaultAvatar from "../assets/default-avatar.jpeg";

interface Mentee {
  id: string;
  name: string;
  image?: string;
  latestMessage?: string; // Latest message property
}

interface MenteeListProps {
  follows: { menteeId: string; mentorId: string }[];
}

const MenteeList: React.FC<MenteeListProps> = ({ follows }) => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const url = searchTerm
      ? `http://localhost:5001/mentees?name_like=${searchTerm}`
      : "http://localhost:5001/mentees";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMentees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mentees:", error);
        setLoading(false);
      });
  }, [searchTerm]);

  const handleChatOpen = (menteeId: string) => {
    navigate(`/chat/${menteeId}`);
  };

  const menteesToShow = mentees.filter((mentee) =>
    follows.some((follow) => follow.menteeId === mentee.id)
  );

  return (
    <div className={styles.menteeListContainer}>
      <h2>Your Mentees</h2>
      <input
        type="text"
        placeholder="Search mentees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {loading ? (
        <p>Loading mentees...</p>
      ) : menteesToShow.length > 0 ? (
        <div className={styles.menteeList}>
          {menteesToShow.map((mentee) => (
            <div
              className={styles.menteeItem}
              key={mentee.id}
              onClick={() => handleChatOpen(mentee.id)}
            >
              <img
                src={mentee.image || defaultAvatar}
                alt={`${mentee.name}'s profile`}
                className={styles.menteeImage}
              />
              <div className={styles.menteeDetails}>
                <div className={styles.menteeName}>{mentee.name}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No mentees found.</p>
      )}
    </div>
  );
};

export default MenteeList;
