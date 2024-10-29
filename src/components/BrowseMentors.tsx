import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/BrowseMentors.module.css";
import defaultAvatar from "../assets/default-avatar.jpeg";
import { FaMapMarkerAlt } from "react-icons/fa";
import FollowRequestModal from "./FollowRequestModal";
import { useUserContext } from "./UserContext"; // Import the hook

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
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  // Use the useUserContext hook to get the logged-in user's ID
  const { userId } = useUserContext(); // Correct usage

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

  const handleFollow = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowModal(true);
  };

  const sendFollowRequest = async (message: string) => {
    if (!selectedMentor) return;

    try {
      const res = await fetch(`http://localhost:5001/followRequests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menteeId: userId, // Use userId from context
          mentorId: selectedMentor.id,
          status: "pending",
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send follow request.");

      alert("Follow request sent successfully!");
      setShowModal(false);
      setSelectedMentor(null);
    } catch (error) {
      console.error(error);
      alert("Failed to send follow request. Please try again.");
    }
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
                  className={styles.followButton}
                  onClick={() => handleFollow(mentor)}
                >
                  Follow
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No mentors found.</p>
        )}
      </div>

      {/* Follow Request Modal */}
      {showModal && selectedMentor && (
        <FollowRequestModal
          mentorName={selectedMentor.name}
          onSend={sendFollowRequest}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BrowseMentors;
