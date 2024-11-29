import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/MentorProfile.module.css";
import { useUserContext } from "./UserContext";

interface Profile {
  profilePicture: string; // Renamed to profilePicture
  name: string;
  designation: string;
  company: string;
  location: string;
  email: string;
  skills: string;
  bio: string;
}

const defaultAvatar = "https://mentorapplication.s3.us-west-2.amazonaws.com/default-avatar.jpeg";

const MentorProfile: React.FC = () => {
  const { userId } = useUserContext(); // Get the logged-in mentor's ID
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newPicture, setNewPicture] = useState<File | null>(null); // State for the new profile picture
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the file input

  // Fetch the mentor's profile data using the logged-in user's ID
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/mentors/${userId}`)
      .then((res) => res.json())
      .then((data: Profile) => setProfile(data))
      .catch((err) => console.error("Failed to load mentor profile", err));
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (profile) {
      const { name, value } = e.target;
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile!,
          profilePicture: reader.result as string, // Update to profilePicture
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewPicture(null);
    }
  };

  const handleSave = () => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        profilePicture: newPicture
          ? URL.createObjectURL(newPicture) // Use the uploaded picture URL if available
          : profile.profilePicture, // Otherwise, keep the existing one
      };

      fetch(`http://localhost:8080/mentors/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile), // Send the updated profile details
      })
        .then((res) => {
          if (res.ok) {
            alert("Profile updated successfully!");
          } else {
            throw new Error("Failed to update profile");
          }
        })
        .catch((err) => console.error("Failed to save profile", err));
    }
  };

  // Function to handle click on the avatar to open file input
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the hidden file input
    }
  };

  if (!profile) {
    return <p>Loading profile...</p>; // Show a loading message until the profile loads
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={profile.profilePicture || defaultAvatar} // Updated to profilePicture
          alt={profile.name}
          className={styles.profileImage}
          onClick={handleAvatarClick} // Handle click to upload a new picture
        />
        <div className={styles.profileInfo}>
          <h1>{profile.name}</h1>
          <p className={styles.designation}>
            {profile.designation} at {profile.company}
          </p>
          <p className={styles.location}>{profile.location}</p>
        </div>
      </div>

      <div className={styles.profileDetails}>
        <h3>Bio</h3>
        <textarea
          name="bio" // Name attribute for bio
          onChange={handleChange} // Handle changes
          className={styles.bioInput} // You can create a CSS class for styling
          placeholder="Tell us about yourself..." // Placeholder text
        />

        <h3>Skills</h3>
        <textarea
          name="skills"
          value={profile.skills}
          onChange={handleChange}
          className={styles.skillsInput}
          placeholder="Enter your skills"
        />

        <h3>Email</h3>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className={styles.inputField}
        />

        {/* Hidden file input for uploading pictures */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the file input
          ref={fileInputRef} // Assign ref to the input
        />

        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={!profile.name || !profile.email} // Disable if required fields are empty
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MentorProfile;
