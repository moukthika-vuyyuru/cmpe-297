import React, { useEffect, useState } from "react";
import styles from "../styles/BrowseMentors.module.css";
import defaultAvatar from "../assets/default-avatar.jpeg";
import { FaMapMarkerAlt } from "react-icons/fa";
import FollowRequestModal from "./FollowRequestModal";
import { useUserContext } from "./UserContext"; // Import the hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define an interface for FollowRequest
interface FollowRequest {
  id: string; // Unique ID for the follow request
  mentorId: string;
  menteeId: string;
  status: string;
  message: string;
}

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  location: string;
}

const BrowseMentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [followedMentorIds, setFollowedMentorIds] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const { userId } = useUserContext(); // Use the useUserContext hook to get the logged-in user's ID

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

  // Fetch followed mentor IDs
  const fetchFollowedMentors = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/followRequests?menteeId=${userId}`
      );
      const data: FollowRequest[] = await res.json();
      setFollowedMentorIds(
        data
          .filter((request) => request.status === "accepted")
          .map((request) => request.mentorId)
      );
    } catch (err) {
      console.error("Failed to load followed mentors", err);
    }
  };

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/followRequests?menteeId=${userId}`
      );
      const data: FollowRequest[] = await res.json();
      setPendingRequests(
        data.filter((request) => request.status === "pending")
      );
    } catch (err) {
      console.error("Failed to load pending requests", err);
    }
  };

  useEffect(() => {
    fetchFollowedMentors(); // Call on component mount
    fetchPendingRequests(); // Call on component mount
  }, [userId]);

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
    if (followedMentorIds.includes(mentor.id)) {
      // Mentor is already followed, so do not open modal
      return;
    }
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

      toast.success("Follow request sent successfully!");
      setShowModal(false);
      setSelectedMentor(null);

      // Fetch updated mentors to reflect the new follow request
      await fetchPendingRequests(); // Refresh pending requests
      await fetchFollowedMentors(); // Refresh followed mentors
    } catch (error) {
      console.error(error);
      toast.error("Failed to send follow request. Please try again.");
    }
  };

  // New function to cancel a follow request
  const cancelFollowRequest = async (requestId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5001/followRequests/${requestId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to cancel follow request.");

      toast.success("Follow request canceled successfully!");

      // Refresh pending requests and followed mentors after cancellation
      await fetchPendingRequests();
      await fetchFollowedMentors();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel follow request. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer /> {/* Toast notifications container */}
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
          filteredMentors.map((mentor) => {
            const pendingRequest = pendingRequests.find(
              (req) => req.mentorId === mentor.id
            );
            return (
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
                  {followedMentorIds.includes(mentor.id) ? (
                    <button className={styles.followButton} disabled>
                      Following
                    </button>
                  ) : pendingRequest ? (
                    <button
                      className={styles.followButton}
                      onClick={() => cancelFollowRequest(pendingRequest.id)} // Cancel request
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <button
                      className={styles.followButton}
                      onClick={() => handleFollow(mentor)}
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            );
          })
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
