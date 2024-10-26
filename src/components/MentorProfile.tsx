import React, { useEffect, useState } from "react";
import styles from "../styles/MentorProfile.module.css";
import { useUserContext } from "./UserContext";
import defaultAvatar from "../assets/default-avatar.jpeg";

interface Profile {
  picture: string;
  name: string;
  designation: string;
  company: string;
  location: string;
  email: string;
  skills: string;
}

const MentorProfile: React.FC = () => {
  const { userId } = useUserContext(); // Get the logged-in mentor's ID
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newPicture, setNewPicture] = useState<File | null>(null); // State for the new profile picture

  // Fetch the mentor's profile data using the logged-in user's ID
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5001/mentors/${userId}`)
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
          picture: reader.result as string,
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
        picture: newPicture
          ? URL.createObjectURL(newPicture) // Use the uploaded picture URL if available
          : profile.picture, // Otherwise, keep the existing one
      };

      fetch(`http://localhost:5001/mentors/${userId}`, {
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

  if (!profile) {
    return <p>Loading profile...</p>; // Show a loading message until the profile loads
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={profile.picture || defaultAvatar}
          alt={profile.name}
          className={styles.profileImage}
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

        <h3>Profile Picture</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />

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
