import React from "react";
import styles from "../styles/MentorProfileModal.module.css";
import { Mentor } from "../types";
import { FaMapMarkerAlt } from "react-icons/fa";

interface MentorProfileModalProps {
  mentor: Mentor;
  onClose: () => void;
  onFollow: () => void;
}

const defaultAvatar = "https://mentorapplication.s3.us-west-2.amazonaws.com/default-avatar.jpeg"

const MentorProfileModal: React.FC<MentorProfileModalProps> = ({
  mentor,
  onClose,
  onFollow,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>

        <div className={styles.profileHeader}>
          <img
            src={mentor.profilePicture || defaultAvatar}
            alt={mentor.name}
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <div className={styles.nameAndFollow}>
              <h1>{mentor.name}</h1>
            </div>
            <p className={styles.location}>
              <FaMapMarkerAlt /> {mentor.location}
            </p>
            <div className={styles.followButtonContainer}>
              <button className={styles.followButton} onClick={onFollow}>
                Follow
              </button>
            </div>
          </div>
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.detailRow}>
            <span className={styles.key}>Company:</span>
            <span className={styles.value}>{mentor.company}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.key}>Designation:</span>
            <span className={styles.value}>{mentor.designation}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.key}>Skills:</span>
            <span className={styles.value}>{mentor.skills}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.key}>Bio:</span>
            <span className={styles.value}>{mentor.bio}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.key}>Email:</span>
            <span className={styles.value}>{mentor.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileModal;
