import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "../styles/MentorCard.module.css";
import { Mentor } from "../types";
import defaultAvatar from "../assets/default-avatar.jpeg";

const MentorCard: React.FC<{ mentor: Mentor }> = ({ mentor }) => {
  const [imgSrc, setImgSrc] = useState(mentor.image || defaultAvatar);

  const handleImageError = () => {
    setImgSrc(defaultAvatar);
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
        <p className={styles.mentorDesignation}>
          {mentor.designation} at {mentor.company}
        </p>
        <div className={styles.locationContainer}>
          <FaMapMarkerAlt className={styles.locationIcon} />
          <p className={styles.mentorLocation}>{mentor.location}</p>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
