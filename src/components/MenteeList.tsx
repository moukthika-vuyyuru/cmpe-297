// src/components/MenteeList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MenteeList.module.css"; // Adjust the path as needed
import defaultAvatar from "../assets/default-avatar.jpeg";

interface Mentee {
  id: string;
  name: string;
  image?: string;
}

interface MenteeListProps {
  follows: { menteeId: string; mentorId: string }[]; // Define the follows prop type
}

const MenteeList: React.FC<MenteeListProps> = ({ follows }) => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const navigate = useNavigate();

  // Fetch mentees dynamically with optional query parameter
  useEffect(() => {
    const url = searchTerm
      ? `http://localhost:5001/mentees?name_like=${searchTerm}` // Using query param for filtering
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
  }, [searchTerm]); // Re-fetch data when searchTerm changes

  const handleChatOpen = (menteeId: string) => {
    navigate(`/chat/${menteeId}`);
  };

  // Filter mentees to show only those that have been accepted
  const menteesToShow = mentees.filter((mentee) =>
    follows.some((follow) => follow.menteeId === mentee.id)
  );

  return (
    <div className="menteeListContainer">
      <h2>Your Mentees</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search mentees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />

      {loading ? (
        <p>Loading mentees...</p>
      ) : menteesToShow.length > 0 ? (
        <div className="menteeList">
          {menteesToShow.map((mentee) => (
            <div
              className="menteeItem"
              key={mentee.id}
              onClick={() => handleChatOpen(mentee.id)}
            >
              <div className="menteeDetails">
                <img
                  src={mentee.image || defaultAvatar} // Use default image if mentee image is not available
                  alt={`${mentee.name}'s profile`}
                  className="menteeImage"
                />
                <div>
                  <div className="menteeName">{mentee.name}</div>
                  <button className="chatButton">Chat</button>
                </div>
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
