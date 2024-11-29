import React, { useState } from "react";
import styles from "../styles/MentorCard.module.css";
import { Mentor } from "../types";

const defaultAvatar = "https://mentorapplication.s3.us-west-2.amazonaws.com/default-avatar.jpeg";

const MentorCard: React.FC<{ mentor: Mentor }> = ({ mentor }) => {
  const [imgSrc, setImgSrc] = useState(mentor.image || defaultAvatar); // Use defaultAvatar if mentor.image is not available

  const handleImageError = () => {
    setImgSrc(defaultAvatar); // Set to default avatar if there's an error loading the image
  };

  return (
    <div className={styles.mentorCard}>
      <img
        src={imgSrc}
        alt={mentor.name}
        onError={handleImageError}
        loading="lazy"
        className={styles.mentorImage}
      />
      <div className={styles.mentorInfo}>
        <h3 className={styles.mentorName}>{mentor.name}</h3>
        <p className={styles.mentorSpecialty}>{mentor.specialty}</p>
      </div>
    </div>
  );
};

export default MentorCard;
