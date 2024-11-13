import React from "react";
import { Modal, Box, Typography } from "@mui/material";

interface MentorDetails {
  id: string;
  name: string;
  email: string;
  location: string;
  skills: string[];
  profilePicture: string;
  specialty: string;
  designation: string;
  company: string;
  bio: string;
}

interface MentorDetailsModalProps {
  open: boolean;
  onClose: () => void;
  mentor: MentorDetails;
}

const MentorDetailsModal: React.FC<MentorDetailsModalProps> = ({
  open,
  onClose,
  mentor,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: 24,
          width: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Mentor Details
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Name:</strong> {mentor.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Email:</strong> {mentor.email}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Location:</strong> {mentor.location}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Skills:</strong> {mentor.skills.join(", ")}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Specialty:</strong> {mentor.specialty}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Designation:</strong> {mentor.designation}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Company:</strong> {mentor.company}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Bio:</strong> {mentor.bio}
        </Typography>
      </Box>
    </Modal>
  );
};

export default MentorDetailsModal;
