import React from "react";
import { FollowRequest } from "../types";

interface MentorRequestsProps {
  followRequests: FollowRequest[];
  onAccept: (requestId: string, menteeId: string) => void;
  onReject: (requestId: string) => void;
}

const MentorRequests: React.FC<MentorRequestsProps> = ({
  followRequests,
  onAccept,
  onReject,
}) => {
  return (
    <div>
      <h2>Follow Requests</h2>
      <ul>
        {followRequests.map((request) => (
          <li key={request.id}>
            <p>Mentee ID: {request.menteeId}</p>
            <p>Message: {request.message}</p>
            <button onClick={() => onAccept(request.id, request.menteeId)}>
              Accept
            </button>
            <button onClick={() => onReject(request.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentorRequests;
