import React, { useEffect, useState } from "react";
import styles from "../styles/MentorDashboard.module.css";
import MentorProfile from "./MentorProfile";
import { useUserContext } from "./UserContext";
import { FollowRequest } from "../types"; // Ensure this type is defined correctly
import defaultAvatar from "../assets/default-avatar.jpeg";
import Chat from "./Chat"; // Ensure you are using this component correctly if needed
import { FaMapMarkerAlt } from "react-icons/fa"; // Import the map icon if needed

const MentorDashboard: React.FC = () => {
  const { userId } = useUserContext();
  const [activeTab, setActiveTab] = useState<
    "mentees" | "requests" | "profile"
  >("mentees");
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [follows, setFollows] = useState<any[]>([]);
  const [menteeMap, setMenteeMap] = useState<
    Record<
      string,
      { name: string; location: string; companyOrUniversity: string }
    >
  >({});
  const [mentorName, setMentorName] = useState<string>("");
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch mentor details
    fetch(`http://localhost:5001/mentors/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setMentorName(data.name);
      })
      .catch((err) => console.error("Failed to load mentor data", err));
  }, [userId]);

  useEffect(() => {
    fetch(`http://localhost:5001/mentees`)
      .then((res) => res.json())
      .then((data) => {
        const menteeData = data.reduce(
          (
            map: Record<
              string,
              { name: string; location: string; companyOrUniversity: string }
            >,
            mentee: {
              id: string;
              name: string;
              location: string;
              companyOrUniversity: string;
            }
          ) => {
            map[mentee.id] = {
              name: mentee.name,
              location: mentee.location,
              companyOrUniversity: mentee.companyOrUniversity,
            };
            return map;
          },
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
      .then((data) => setFollowRequests(data))
      .catch((err) => console.error("Failed to load follow requests", err));

    fetch(`http://localhost:5001/follows?mentorId=${userId}`)
      .then((res) => res.json())
      .then((data) => setFollows(data))
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

          const newFollow = {
            id: `${userId}-${menteeId}`,
            menteeId,
            mentorId: userId,
          };

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

  const handleMenteeSelect = (menteeId: string) => {
    setSelectedMenteeId(menteeId);
  };

  const handleBack = () => {
    setSelectedMenteeId(null);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.profileCard}>
          <img
            className={styles.profilePicture}
            src="path/to/profile/picture" // Replace with the actual profile picture source
            alt="Default Avatar"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h3 className={styles.username}>{mentorName || "Loading..."}</h3>
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
        {selectedMenteeId ? (
          <div className={styles.chatContainer}>
            <button onClick={handleBack} className={styles.backButton}>
              ← Back
            </button>
            <Chat recipientId={selectedMenteeId} />
          </div>
        ) : activeTab === "mentees" ? (
          <div className={styles.chatContainer}>
            {follows.length > 0 ? (
              follows.map((mentee) => (
                <div
                  key={mentee.id}
                  className={styles.menteeCard}
                  onClick={() => handleMenteeSelect(mentee.menteeId)}
                >
                  <img
                    src={mentee.image || defaultAvatar}
                    alt={menteeMap[mentee.menteeId]?.name || "Unknown Mentee"} // Access name from the updated menteeMap
                    className={styles.menteeImage}
                  />
                  <div className={styles.menteeDetails}>
                    <h3>{menteeMap[mentee.menteeId]?.name || "Loading..."}</h3>{" "}
                    {/* Access name */}
                    <p>
                      {menteeMap[mentee.menteeId]?.companyOrUniversity ||
                        "University not specified"}{" "}
                      {/* Access university */}
                    </p>
                    <div className={styles.menteeLocation}>
                      <FaMapMarkerAlt />
                      <span>
                        {menteeMap[mentee.menteeId]?.location ||
                          "Location not specified"}{" "}
                        {/* Access location */}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No followed mentees to chat with.</p>
            )}
          </div>
        ) : activeTab === "requests" ? (
          // Inside the `requests` tab rendering
          <div className={styles.requestsContainer}>
            {followRequests.map((request) => (
              <div key={request.id} className={styles.requestCard}>
                <img
                  className={styles.menteeProfilePicture}
                  src={`http://localhost:5001/mentees/${request.menteeId}/picture`}
                  alt="Mentee"
                  onError={(e) => (e.currentTarget.src = defaultAvatar)}
                />
                <div className={styles.menteeDetails}>
                  <h3 className={styles.menteeName}>
                    {menteeMap[request.menteeId]?.name || "Unknown Mentee"}
                  </h3>
                  <p className={styles.university}>
                    {menteeMap[request.menteeId]?.companyOrUniversity || "N/A"}
                  </p>
                  <div className={styles.location}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <span>
                      {menteeMap[request.menteeId]?.location ||
                        "Location not specified"}
                    </span>
                  </div>
                  <p className={styles.requestMessage}>
                    "{request.message || "No message provided."}"
                  </p>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.acceptButton}
                    onClick={() => handleAccept(request.id, request.menteeId)}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MentorProfile />
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
