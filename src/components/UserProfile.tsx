import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/UserProfile.module.css";
import { useUserContext } from "./UserContext";
import defaultAvatar from "../assets/default-avatar.jpeg";

interface UserProfileData {
  profilePicture: string;
  name: string;
  email: string;
  location: string;
  companyOrUniversity: string;
  skills: string;
  bio: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useUserContext(); // Get logged-in user's ID
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for hidden input

  // Fetch user profile details on load
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5001/mentees/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data: UserProfileData = await res.json();
        setUserProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (userProfile) {
      const { name, value } = e.target;
      setUserProfile({ ...userProfile, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prevProfile) => ({
          ...prevProfile!,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        profilePicture: newProfilePicture
          ? URL.createObjectURL(newProfilePicture)
          : userProfile.profilePicture,
      };

      try {
        const res = await fetch(`http://localhost:5001/mentees/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });

        if (!res.ok) throw new Error("Failed to update profile");
        alert("Profile updated successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to save changes.");
      }
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  const triggerFileInput = () => {
    fileInputRef.current?.click(); // Open file dialog when avatar is clicked
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={userProfile?.profilePicture || defaultAvatar}
          alt={userProfile?.name}
          className={styles.profileImage}
          onClick={triggerFileInput} // Click handler to open file input
          style={{ cursor: "pointer" }} // Make the avatar clickable
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }} // Hidden input field
          onChange={handleFileChange}
        />
        <div className={styles.profileInfo}>
          <h1>{userProfile?.name}</h1>
          <p className={styles.location}>{userProfile?.location}</p>
          <p className={styles.companyOrUniversity}>
            {userProfile?.companyOrUniversity}
          </p>
        </div>
      </div>

      <div className={styles.profileDetails}>
        <h3>Skills</h3>
        <textarea
          name="skills"
          value={userProfile?.skills}
          onChange={handleInputChange}
          className={styles.skillsInput}
          placeholder="Enter your skills"
        />

        <h3>Bio</h3>
        <textarea
          name="bio"
          value={userProfile?.bio}
          onChange={handleInputChange}
          className={styles.bioInput}
          placeholder="Tell us about yourself"
        />

        <h3>Email</h3>
        <input
          type="email"
          name="email"
          value={userProfile?.email}
          onChange={handleInputChange}
          className={styles.inputField}
        />

        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={!userProfile?.name || !userProfile?.email}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
