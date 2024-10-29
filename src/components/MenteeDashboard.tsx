// MenteeDashboard.tsx

import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenteeDashboard.module.css";
import { FollowRequest } from "../types";
import defaultAvatar from "../assets/default-avatar.jpeg";
import { FaMapMarkerAlt } from "react-icons/fa";
import Chat from "./Chat";
import UserProfile from "./UserProfile";
import FollowRequestModal from "./FollowRequestModal";

interface Mentor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  location: string;
}

const MenteeDashboard: React.FC = () => {
  const { userId: menteeId, name: menteeName } = useUserContext();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [followedMentors, setFollowedMentors] = useState<Mentor[]>([]);
  const [activeTab, setActiveTab] = useState<
    "home" | "applications" | "inquiries"
  >("home");
  const [recommendedMentors, setRecommendedMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showUserProfile, setShowUserProfile] = useState<boolean>(false);
  const [selectedMentorForRequest, setSelectedMentorForRequest] =
    useState<Mentor | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleFollow = (mentor: Mentor) => {
    setSelectedMentorForRequest(mentor);
    setShowModal(true);
  };

  const sendFollowRequest = async (message: string) => {
    if (!selectedMentorForRequest || !menteeId) return;

    try {
      const res = await fetch(`http://localhost:5001/followRequests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menteeId,
          mentorId: selectedMentorForRequest.id,
          status: "pending",
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send follow request.");

      alert("Follow request sent successfully!");
      setShowModal(false);
      setSelectedMentorForRequest(null);
    } catch (error) {
      console.error(error);
      alert("Failed to send follow request. Please try again.");
    }
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor); // Set the selected mentor
  };

  const handleBack = () => {
    setSelectedMentor(null); // Reset the selected mentor
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.profileCard}>
          <img
            className={styles.profilePicture}
            src="path/to/profile/picture" // Replace with mentee's image source
            alt="Default Avatar"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h3
            className={styles.username}
            onClick={() => setShowUserProfile(!showUserProfile)}
          >
            {menteeName || "Loading..."}
          </h3>
        </div>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("applications")}
        >
          Pending Requests
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("inquiries")}
        >
          Your Mentors
        </button>
      </div>

      <div className={styles.content}>
        {showUserProfile ? (
          <UserProfile />
        ) : (
          <>
            {activeTab === "home" && (
              <div className={styles.banner}>
                <h2 className={styles.heroTitle}>Welcome, {menteeName}!</h2>
                <p className={styles.heroSubtitle}>
                  Start connecting with mentors and take your career to the next
                  level!
                </p>
                <button
                  className={styles.browseButton}
                  onClick={() => navigate("/browse-mentors")}
                >
                  Browse Mentors
                </button>

                {recommendedMentors.length > 0 && (
                  <div className={styles.recommendedSection}>
                    <h3>Recommended for You</h3>
                    <div className={styles.recommendedMentors}>
                      {recommendedMentors.slice(0, 5).map((mentor) => (
                        <div
                          key={mentor.id}
                          className={styles.recommendedMentorCard}
                        >
                          <img
                            src={mentor.image || defaultAvatar}
                            alt={mentor.name}
                            className={styles.recommendedMentorImage}
                          />
                          <div className={styles.recommendedMentorDetails}>
                            <h4 className={styles.recommendedMentorName}>
                              {mentor.name}
                            </h4>
                            <p className={styles.recommendedMentorSpecialty}>
                              {mentor.specialty}
                            </p>
                            <div className={styles.recommendedMentorLocation}>
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "applications" && (
              <div className={styles.mentorList}>
                {pendingRequests.filter(
                  (request) => request.status === "pending"
                ).length > 0 ? (
                  pendingRequests
                    .filter((request) => request.status === "pending")
                    .map((request) => {
                      const mentor = mentors.find(
                        (mentor) => mentor.id === request.mentorId
                      );
                      return (
                        mentor && (
                          <div key={request.id} className={styles.mentorCard}>
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
                              <br />
                              <p className={styles.pendingStatus}>
                                Request is pending
                              </p>
                            </div>
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
                {selectedMentor ? (
                  <div className={styles.chatContainer}>
                    <button className={styles.backButton} onClick={handleBack}>
                      {"<"} {/* Left arrow character */}
                    </button>
                    <Chat recipientId={selectedMentor.id} />
                  </div>
                ) : (
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
                      <p>No followed mentors to chat with.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Follow Request Modal */}
        {showModal && selectedMentorForRequest && (
          <FollowRequestModal
            mentorName={selectedMentorForRequest.name}
            onSend={sendFollowRequest}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MenteeDashboard;
