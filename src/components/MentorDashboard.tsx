import React, { useEffect, useState } from "react";
import styles from "../styles/MentorDashboard.module.css";
import MentorRequests from "./MentorRequests";
import MentorProfile from "./MentorProfile";
import MenteeList from "./MenteeList";
import { useUserContext } from "./UserContext";
import { FollowRequest } from "../types";

interface Follow {
  menteeId: string;
  mentorId: string;
}

const MentorDashboard: React.FC = () => {
  const { userId } = useUserContext(); // Get userId from context
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home");
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]); // Track followed mentees

  // Fetch follow requests for the mentor
  useEffect(() => {
    fetch(
      `http://localhost:5001/followRequests?mentorId=${userId}&status=pending`
    )
      .then((res) => res.json())
      .then((data: FollowRequest[]) => setFollowRequests(data))
      .catch((err) => console.error("Failed to load follow requests", err));
  }, [userId]);

  // Fetch existing follows (persisted mentees) from the backend
  useEffect(() => {
    fetch(`http://localhost:5001/follows?mentorId=${userId}`)
      .then((res) => res.json())
      .then((data: Follow[]) => setFollows(data))
      .catch((err) => console.error("Failed to load follows", err));
  }, [userId]);

  const handleAccept = (requestId: string, menteeId: string) => {
    fetch(`http://localhost:5001/followRequests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Request accepted!");

          // Update the local state for requests
          setFollowRequests(
            (prev) => prev.filter((req) => req.id !== requestId) // Remove the accepted request
          );

          // Prepare the new follow object
          const newFollow = { menteeId, mentorId: userId ?? "" };

          // Update the follows in state and backend
          setFollows((prev) => [...prev, newFollow]);

          fetch(`http://localhost:5001/follows`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFollow),
          }).catch((err) => console.error("Failed to update follows", err));
        } else {
          throw new Error("Failed to accept the request");
        }
      })
      .catch((err) => console.error("Failed to accept the request", err));
  };

  const handleReject = (requestId: string) => {
    fetch(`http://localhost:5001/followRequests/${requestId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Request rejected!");

          // Remove the rejected request from state
          setFollowRequests((prev) =>
            prev.filter((req) => req.id !== requestId)
          );
        } else {
          throw new Error("Failed to reject the request");
        }
      })
      .catch((err) => console.error("Failed to reject the request", err));
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Requests Section */}
      <MentorRequests
        followRequests={followRequests}
        onAccept={handleAccept}
        onReject={handleReject}
      />

      {/* Tabs for Home and Profile */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "home" ? styles.activeTab : ""}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={activeTab === "profile" ? styles.activeTab : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "home" ? (
          <MenteeList follows={follows} />
        ) : (
          <MentorProfile />
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
