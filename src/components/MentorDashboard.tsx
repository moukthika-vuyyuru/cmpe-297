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
  const { userId } = useUserContext();
  const [activeTab, setActiveTab] = useState<
    "mentees" | "requests" | "profile"
  >("mentees");
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);

  // Fetch follow requests
  useEffect(() => {
    fetch(
      `http://localhost:5001/followRequests?mentorId=${userId}&status=pending`
    )
      .then((res) => res.json())
      .then((data: FollowRequest[]) => setFollowRequests(data))
      .catch((err) => console.error("Failed to load follow requests", err));
  }, [userId]);

  // Fetch followed mentees
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

          setFollowRequests((prev) =>
            prev.filter((req) => req.id !== requestId)
          );

          const newFollow = { menteeId, mentorId: userId ?? "" };
          setFollows((prev) => [...prev, newFollow]);

          return fetch(`http://localhost:5001/follows`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFollow),
          });
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
      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "mentees" ? styles.activeTab : ""}
          onClick={() => setActiveTab("mentees")}
        >
          Your Mentees
        </button>
        <button
          className={activeTab === "requests" ? styles.activeTab : ""}
          onClick={() => setActiveTab("requests")}
        >
          Follow Requests
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
        {activeTab === "mentees" && <MenteeList follows={follows} />}
        {activeTab === "requests" && (
          <MentorRequests
            followRequests={followRequests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
        {activeTab === "profile" && <MentorProfile />}
      </div>
    </div>
  );
};

export default MentorDashboard;
