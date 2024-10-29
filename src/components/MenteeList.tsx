import React from "react";
import styles from "../styles/MenteeList.module.css";
import defaultAvatar from "../assets/default-avatar.jpeg";

interface MenteeListProps {
  follows: { menteeId: string; id: string }[]; // Adjust according to your follow structure
  menteeMap: Record<string, string>;
  onMenteeSelect: (menteeId: string) => void;
}

const MenteeList: React.FC<MenteeListProps> = ({
  follows,
  menteeMap,
  onMenteeSelect,
}) => {
  return (
    <div className={styles.menteeList}>
      {follows.map((follow) => (
        <div
          key={follow.id}
          className={styles.menteeCard}
          onClick={() => onMenteeSelect(follow.menteeId)} // Handle mentee card click
        >
          <img
            className={styles.menteeProfilePicture}
            src="path/to/mentee/picture" // Replace with actual mentee image source
            alt={menteeMap[follow.menteeId] || "Mentee"}
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h4 className={styles.menteeName}>
            {menteeMap[follow.menteeId] || "Unknown Mentee"}
          </h4>
        </div>
      ))}
    </div>
  );
};

export default MenteeList;
