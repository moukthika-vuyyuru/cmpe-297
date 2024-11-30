import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/MentorTimeline.module.css";
import { APIURL } from "../Utilities/Apiurl";

const MentorTimeline: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch(APIURL+"/mentee-requests");
      const data = await response.json();
      setRequests(data);
    };

    fetchRequests();
  }, []);

  const handleAccept = async (menteeId: number) => {
    // Call API to accept the request
    await fetch(`${APIURL}/mentee-requests/${menteeId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "accepted" }), // Adjust as necessary
      headers: { "Content-Type": "application/json" },
    });
    setRequests((prev) => prev.filter((request) => request.id !== menteeId)); // Update state
  };

  const handleReject = async (menteeId: number) => {
    // Call API to reject the request
    await fetch(`${APIURL}/mentee-requests/${menteeId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected" }), // Adjust as necessary
      headers: { "Content-Type": "application/json" },
    });
    setRequests((prev) => prev.filter((request) => request.id !== menteeId)); // Update state
  };

  return (
    <div className={styles.timeline}>
      <h2>Your Mentee Requests</h2>
      {requests.length === 0 ? (
        <p>No requests at the moment.</p>
      ) : (
        requests.map((request) => (
          <div key={request.id} className={styles.request}>
            <Link to={`/mentees/${request.menteeId}`}>
              {request.menteeName}
            </Link>
            <button onClick={() => handleAccept(request.id)}>Accept</button>
            <button onClick={() => handleReject(request.id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MentorTimeline;
