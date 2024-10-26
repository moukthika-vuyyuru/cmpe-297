import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenteeDashboard.module.css";
import { FollowRequest } from "../types";
import defaultAvatar from "../assets/default-avatar.jpeg";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  location: string; // Add location property
}

const MenteeDashboard: React.FC = () => {
  const { userId: menteeId } = useUserContext(); // Get menteeId from context
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [followedMentors, setFollowedMentors] = useState<Mentor[]>([]);
  const [activeTab, setActiveTab] = useState<
    "yourMentors" | "pendingRequests" | "searchForMentors"
  >("yourMentors");
  const navigate = useNavigate();

  // Fetch mentors from the backend
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

  // Fetch pending follow requests for the mentee
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!menteeId) return;

      try {
        const res = await fetch(
          `http://localhost:5001/followRequests?menteeId=${menteeId}`
        );
        const data: FollowRequest[] = await res.json();
        setPendingRequests(data);
      } catch (err) {
        console.error("Failed to load follow requests", err);
      }
    };

    fetchPendingRequests();
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

    const sendFollowRequest = async () => {
      try {
        const res = await fetch(`http://localhost:5001/followRequests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            menteeId,
            mentorId,
            status: "pending",
            message,
          }),
        });

        const newRequest: FollowRequest = await res.json();
        alert("Follow request sent!");
        setPendingRequests((prev) => [...prev, newRequest]);
      } catch (err) {
        console.error("Failed to send follow request", err);
      }
    };

    sendFollowRequest();
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

  return (
    <div className={styles.menteeDashboardContainer}>
      <h2>Mentee Dashboard</h2>
      <div className={styles.tabs}>
        <button
          className={activeTab === "yourMentors" ? styles.activeTab : ""}
          onClick={() => setActiveTab("yourMentors")}
        >
          Your Mentors
        </button>
        <button
          className={activeTab === "pendingRequests" ? styles.activeTab : ""}
          onClick={() => setActiveTab("pendingRequests")}
        >
          Pending Requests
        </button>
        <button
          className={activeTab === "searchForMentors" ? styles.activeTab : ""}
          onClick={() => setActiveTab("searchForMentors")}
        >
          Search for Mentors
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "yourMentors" && (
          <>
            <h3>Your Mentors</h3>
            <div className={styles.mentorList}>
              {followedMentors.length > 0 ? (
                followedMentors.map((mentor) => (
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
                        className={styles.messageButton}
                        onClick={() => navigate(`/chat/${mentor.id}`)}
                      >
                        Message
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>You are not following any mentors yet.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "pendingRequests" && (
          <>
            <h3>Pending Requests</h3>
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
                        <div key={request.id} className={styles.mentorCard}>
                          <p>Request to {mentor.name} is pending.</p>
                        </div>
                      )
                    );
                  })
              ) : (
                <p>No pending follow requests.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "searchForMentors" && (
          <>
            <h3>Search for Mentors</h3>
            <input
              type="text"
              placeholder="Search by name or specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.mentorList}>
              {availableMentors
                .filter(
                  (mentor) =>
                    mentor.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    mentor.specialty
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((mentor) => (
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
                        onClick={() => handleFollow(mentor.id)}
                      >
                        Follow
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenteeDashboard;
