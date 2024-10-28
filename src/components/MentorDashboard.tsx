import React, { useEffect, useState } from "react";
import styles from "../styles/MentorDashboard.module.css";
import MentorProfile from "./MentorProfile";
import MenteeList from "./MenteeList";
import { useUserContext } from "./UserContext";
import { FollowRequest } from "../types";
import defaultAvatar from "../assets/default-avatar.jpeg";

interface Follow {
  menteeId: string;
  mentorId: string;
}

interface Mentee {
  id: string;
  name: string;
  email: string;
}

interface Mentor {
  id: string;
  name: string;
  email: string;
}

const MentorDashboard: React.FC = () => {
  const { userId } = useUserContext();
  const [activeTab, setActiveTab] = useState<
    "mentees" | "requests" | "profile"
  >("mentees");
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [menteeMap, setMenteeMap] = useState<Record<string, string>>({});
  const [mentorName, setMentorName] = useState<string>("");

  useEffect(() => {
    // Fetch mentor details
    fetch(`http://localhost:5001/mentors/${userId}`)
      .then((res) => res.json())
      .then((data: Mentor) => {
        setMentorName(data.name); // Store the mentor's name
      })
      .catch((err) => console.error("Failed to load mentor data", err));
  }, [userId]);

  useEffect(() => {
    fetch(`http://localhost:5001/mentees`)
      .then((res) => res.json())
      .then((data: Mentee[]) => {
        const menteeData = data.reduce(
          (map, mentee) => ({ ...map, [mentee.id]: mentee.name }),
          {}
        );
        setMenteeMap(menteeData);
      })
      .catch((err) => console.error("Failed to load mentees", err));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5001/followRequests?mentorId=${userId}&status=pending`
    )
      .then((res) => res.json())
      .then((data: FollowRequest[]) => setFollowRequests(data))
      .catch((err) => console.error("Failed to load follow requests", err));

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
      <div className={styles.sidebar}>
        <div className={styles.profileCard}>
          <img
            className={styles.profilePicture}
            src="path/to/profile/picture"
            alt="Default Avatar"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h3 className={styles.username}>{mentorName || "Loading..."}</h3>{" "}
          {/* Render mentor name */}
        </div>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("mentees")}
        >
          Your Mentees
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("requests")}
        >
          Follow Requests
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "mentees" && <MenteeList follows={follows} />}
        {activeTab === "requests" && (
          <div className={styles.requestsContainer}>
            {followRequests.map((request) => (
              <div key={request.id} className={styles.requestCard}>
                <img
                  className={styles.menteeProfilePicture}
                  src="path/to/mentee/picture"
                  alt="Mentee"
                  onError={(e) => (e.currentTarget.src = defaultAvatar)}
                />
                <span>{menteeMap[request.menteeId] || "Unknown Mentee"}</span>
                <button
                  onClick={() => handleAccept(request.id, request.menteeId)}
                >
                  Accept
                </button>
                <button onClick={() => handleReject(request.id)}>Reject</button>
              </div>
            ))}
          </div>
        )}
        {activeTab === "profile" && <MentorProfile />}
      </div>
    </div>
  );
};

export default MentorDashboard;
