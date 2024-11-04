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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MentorCard from "./MentorCard";
import { Mentor } from "../types";

const MenteeDashboard: React.FC = () => {
  const { userId: menteeId, name: menteeName } = useUserContext();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [followedMentors, setFollowedMentors] = useState<Mentor[]>([]);
  const [activeTab, setActiveTab] = useState<
    "home" | "applications" | "inquiries" | "profile"
  >("home");
  const [recommendedMentors, setRecommendedMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
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

  // Define fetchPendingRequests here
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

  useEffect(() => {
    fetchPendingRequests(); // Call on component mount
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

      toast.success("Follow request sent successfully!");
      setShowModal(false);
      setSelectedMentorForRequest(null);

      // Refresh the pending requests
      await fetchPendingRequests(); // Now correctly calls the defined function

      // Remove the followed mentor from the recommended list
      setRecommendedMentors((prev) =>
        prev.filter((mentor) => mentor.id !== selectedMentorForRequest.id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to send follow request. Please try again.");
    }
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor); // Set the selected mentor
  };

  const handleBack = () => {
    setSelectedMentor(null); // Reset the selected mentor
  };

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

      // Update the state to remove the canceled request
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel follow request. Please try again.");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <ToastContainer /> {/* Toast notifications container */}
      <div className={styles.sidebar}>
        <div className={styles.profileCard}>
          <img
            className={styles.profilePicture}
            src="path/to/profile/picture" // Replace with mentee's image source
            alt="Default Avatar"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h3 className={styles.username}>{menteeName || "Loading..."}</h3>
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
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "profile" && <UserProfile />}{" "}
        {/* Render UserProfile based on activeTab */}
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
                      <MentorCard mentor={mentor} />
                      <button
                        className={styles.followButton}
                        onClick={() => handleFollow(mentor)}
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
                          <p className={styles.pendingStatus}>
                            Request is pending
                          </p>
                          <button
                            className={styles.browseButton}
                            onClick={() => cancelFollowRequest(request.id)}
                          >
                            Cancel Request
                          </button>
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
                <Chat
                  recipientId={selectedMentor.id}
                  recipientName={selectedMentor.name}
                  onBack={handleBack} // Pass the back handler here
                />
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
