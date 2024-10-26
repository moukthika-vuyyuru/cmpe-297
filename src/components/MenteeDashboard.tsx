import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenteeDashboard.module.css"; // Ensure to use CSS modules
import { FollowRequest } from "../types";
import defaultAvatar from "../assets/default-avatar.jpeg"; // Default avatar import

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

const MenteeDashboard: React.FC = () => {
  const { userId: menteeId } = useUserContext(); // Get menteeId from context
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [followedMentors, setFollowedMentors] = useState<Mentor[]>([]);
  const navigate = useNavigate();
  const mentorListRef = useRef<HTMLDivElement>(null); // Ref for mentor list

  // Fetch mentors from the backend
  useEffect(() => {
    fetch(`http://localhost:5001/mentors`)
      .then((res) => res.json())
      .then((data) => setMentors(data))
      .catch((err) => console.error("Failed to load mentors", err));
  }, []);

  // Fetch pending follow requests for the mentee
  useEffect(() => {
    if (!menteeId) return;

    fetch(`http://localhost:5001/followRequests?menteeId=${menteeId}`)
      .then((res) => res.json())
      .then((data: FollowRequest[]) => {
        setPendingRequests(data);
      })
      .catch((err) => console.error("Failed to load follow requests", err));
  }, [menteeId]);

  // Filter followed mentors based on accepted requests
  useEffect(() => {
    const acceptedMentorIds = pendingRequests
      .filter((request) => request.status === "accepted")
      .map((request) => request.mentorId);

    const followed = mentors.filter((mentor) =>
      acceptedMentorIds.includes(mentor.id)
    );

    setFollowedMentors(followed);
  }, [mentors, pendingRequests]);

  // Handle follow request
  const handleFollow = (mentorId: string) => {
    const message = prompt("Enter a message for the mentor:");
    if (!message) return;

    fetch(`http://localhost:5001/followRequests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menteeId,
        mentorId,
        status: "pending",
        message,
      }),
    })
      .then((res) => res.json())
      .then((newRequest: FollowRequest) => {
        alert("Follow request sent!");
        setPendingRequests((prev) => [...prev, newRequest]);
      })
      .catch((err) => console.error("Failed to send follow request", err));
  };

  // Filter mentors that haven't been requested yet
  const availableMentors = mentors.filter(
    (mentor) =>
      !pendingRequests.some((req) => req.mentorId === mentor.id) &&
      !followedMentors.some((followed) => followed.id === mentor.id)
  );

  const handleViewAll = () => {
    navigate("/all-mentors"); // Navigate to all mentors page
  };

  // Scroll to the right
  const scrollRight = () => {
    if (mentorListRef.current) {
      mentorListRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Scroll to the left
  const scrollLeft = () => {
    if (mentorListRef.current) {
      mentorListRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.menteeDashboardContainer}>
      <h2>Your Mentors</h2>
      <div className={styles.mentorCarousel}>
        <button className={styles.arrowButton} onClick={scrollLeft}>
          &lt;
        </button>
        <div className={styles.mentorList} ref={mentorListRef}>
          {followedMentors.length > 0 ? (
            followedMentors.map((mentor) => (
              <div key={mentor.id} className={styles.mentorItem}>
                <img src={mentor.image || defaultAvatar} alt={mentor.name} />
                <div>
                  <h3>{mentor.name}</h3>
                  <p>{mentor.specialty}</p>
                  <button onClick={() => navigate(`/chat/${mentor.id}`)}>
                    Message
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>You are not following any mentors yet.</p>
          )}
        </div>
        <button className={styles.arrowButton} onClick={scrollRight}>
          &gt;
        </button>
      </div>

      <button className={styles.viewAll} onClick={handleViewAll}>
        View All Mentors
      </button>

      <h2>Pending Requests</h2>
      <div className={styles.mentorList}>
        {pendingRequests.filter((request) => request.status === "pending")
          .length > 0 ? (
          pendingRequests
            .filter((request) => request.status === "pending")
            .map((request) => {
              const mentor = mentors.find(
                (mentor) => mentor.id === request.mentorId
              );
              return (
                mentor && (
                  <div key={request.id} className={styles.mentorItem}>
                    <p>Request to {mentor.name} is pending.</p>
                  </div>
                )
              );
            })
        ) : (
          <p>No pending follow requests.</p>
        )}
      </div>

      <h2>Search for Mentors</h2>
      <input
        type="text"
        placeholder="Search by name or specialty"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.mentorList}>
        {availableMentors
          .filter(
            (mentor) =>
              mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((mentor) => (
            <div key={mentor.id} className={styles.mentorItem}>
              <img src={mentor.image || defaultAvatar} alt={mentor.name} />
              <div>
                <h3>{mentor.name}</h3>
                <p>{mentor.specialty}</p>
                <button onClick={() => handleFollow(mentor.id)}>Follow</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MenteeDashboard;
