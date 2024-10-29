// FollowRequestModal.tsx
import React, { useState } from "react";
import styles from "../styles/FollowRequestModal.module.css";

interface FollowRequestModalProps {
  mentorName: string;
  onSend: (message: string) => void;
  onClose: () => void;
}

const FollowRequestModal: React.FC<FollowRequestModalProps> = ({
  mentorName,
  onSend,
  onClose,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      onClose(); // Close modal after sending
    } else {
      alert("Message cannot be empty!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Send Follow Request</h2>
        <p>Leave a message for {mentorName}</p>
        <textarea
          className={styles.messageInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
        />
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowRequestModal;
