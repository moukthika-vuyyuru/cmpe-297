// src/components/MenteeCard.tsx
import React, { useState } from "react";
import styles from "../styles/MenteeCard.module.css"; // Import your CSS module
interface Mentee {
  id: string;
  name: string;
  image: string;
}

const defaultAvatar = "https://mentorapplication.s3.us-west-2.amazonaws.com/default-avatar.jpeg";

const MenteeCard: React.FC<{
  mentee: Mentee;
  onChatOpen: (id: string) => void;
}> = ({ mentee, onChatOpen }) => {
  const [imgSrc, setImgSrc] = useState(mentee.image || defaultAvatar); // Use defaultAvatar if mentee.image is not available

  const handleImageError = () => {
    setImgSrc(defaultAvatar); // Set to default avatar if there's an error loading the image
  };

  return (
    <div className={styles.menteeCard} onClick={() => onChatOpen(mentee.id)}>
      <img
        src={imgSrc}
        alt={mentee.name}
        onError={handleImageError}
        loading="lazy"
        className={styles.menteeImage}
      />
      <div className={styles.menteeInfo}>
        <h3 className={styles.menteeName}>{mentee.name}</h3>
      </div>
    </div>
  );
};

export default MenteeCard;
