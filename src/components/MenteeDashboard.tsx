import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenteeDashboard.module.css";
import { FollowRequest } from "../types";
import defaultAvatar from "../assets/default-avatar.jpeg";
import { FaMapMarkerAlt } from "react-icons/fa";
import Chat from "./Chat"; // Import the Chat component

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  location: string;
}

const MenteeDashboard: React.FC = () => {
  const { userId: menteeId, name: menteeName, logout } = useUserContext();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [followedMentors, setFollowedMentors] = useState<Mentor[]>([]);
  const [activeTab, setActiveTab] = useState<
    "home" | "applications" | "inquiries"
  >("home");
  const [recommendedMentors, setRecommendedMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null); // State for selected mentor

  const navigate = useNavigate();

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

  useEffect(() => {
    const acceptedMentorIds = pendingRequests
      .filter((request) => request.status === "accepted")
      .map((request) => request.mentorId);
    const followed = mentors.filter((mentor) =>
      acceptedMentorIds.includes(mentor.id)
    );
    setFollowedMentors(followed);
  }, [mentors, pendingRequests]);

  useEffect(() => {
    const availableMentors = mentors.filter(
      (mentor) =>
        !pendingRequests.some((req) => req.mentorId === mentor.id) &&
        !followedMentors.some((followed) => followed.id === mentor.id)
    );
    setRecommendedMentors(availableMentors);
  }, [mentors, pendingRequests, followedMentors]);

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

  const handleLogout = () => {
    logout(); // Call context logout function
    alert("Logged out successfully!");
    navigate("/"); // Redirect after logout
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor); // Set the selected mentor for chat
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button
          className={styles.navButton}
          onClick={() => setActiveTab("home")}
        >
          MentorConnect
        </button>
        <button
          className={styles.navButton}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={styles.navButton}
          onClick={() => setActiveTab("inquiries")}
        >
          Inquiries
        </button>
        <button className={styles.signoutButton} onClick={handleLogout}>
          Sign Out
        </button>
      </nav>

      {activeTab === "home" && (
        <div className={styles.banner}>
          <h2>Welcome, {menteeName}!</h2>
          <p>
            Start connecting with mentors and get ready to take your career to
            the next level!
          </p>
          <button
            className={styles.browseButton}
            onClick={() => navigate("/browse-mentors")} // Update the route to your new component
          >
            Browse Mentors
          </button>
        </div>
      )}

      <div className={styles.tabContent}>
        {activeTab === "applications" && (
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
        )}

        {activeTab === "inquiries" && (
          <div className={styles.inquiriesContainer}>
            <div className={styles.mentorList}>
              {followedMentors.length > 0 ? (
                followedMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className={styles.mentorCard}
                    onClick={() => handleMentorSelect(mentor)}
                  >
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
                    </div>
                  </div>
                ))
              ) : (
                <p>You are not following any mentors yet.</p>
              )}
            </div>

            <div className={styles.chatContainer}>
              {selectedMentor ? (
                <Chat recipientId={selectedMentor.id} />
              ) : (
                <p>Select a mentor to start chatting!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "home" && recommendedMentors.length > 0 && (
          <div className={styles.recommendedSection}>
            <h3>Recommended for You</h3>
            <div className={styles.recommendedMentors}>
              {recommendedMentors.slice(0, 4).map((mentor) => (
                <div key={mentor.id} className={styles.recommendedMentorCard}>
                  <img
                    src={mentor.image || defaultAvatar}
                    alt={mentor.name}
                    className={styles.recommendedMentorImage}
                  />
                  <div className={styles.recommendedMentorDetails}>
                    <h4>{mentor.name}</h4>
                    <p>{mentor.specialty}</p>
                    <div className={styles.recommendedMentorLocation}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MenteeDashboard;
