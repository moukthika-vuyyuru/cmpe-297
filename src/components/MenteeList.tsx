// src/components/MenteeList.tsx
import React from "react";
import styles from "../styles/MenteeList.module.css"; // Import your CSS module
import defaultAvatar from "../assets/default-avatar.jpeg";

interface Follow {
  menteeId: string;
  mentorId: string;
}

interface MenteeListProps {
  follows: Follow[];
  menteeMap: Record<string, string>; // Mapping of mentee IDs to names
  onMenteeSelect: (menteeId: string) => void; // Prop to handle mentee selection
}

const MenteeList: React.FC<MenteeListProps> = ({
  follows,
  menteeMap,
  onMenteeSelect,
}) => {
  return (
    <div className={styles.menteesContainer}>
      {follows.map(({ menteeId }) => (
        <div
          key={menteeId}
          className={styles.menteeCard}
          onClick={() => onMenteeSelect(menteeId)} // Handle mentee selection
        >
          <img
            className={styles.menteeProfilePicture}
            src={`path/to/mentee/picture/${menteeId}`} // Adjust path as necessary
            alt="Mentee"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <span className={styles.menteeName}>
            {menteeMap[menteeId] || "Unknown"}
          </span>{" "}
          {/* Display mentee name */}
        </div>
      ))}
    </div>
  );
};

export default MenteeList;
