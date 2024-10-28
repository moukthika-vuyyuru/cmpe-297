import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Register.module.css";
import defaultAvatar from "../assets/default-avatar.jpeg";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get("role") || "mentee";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: initialRole,
    name: "",
    email: "",
    specialty: "",
    designation: "",
    company: "",
    location: "",
    skills: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setPicturePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProfilePicture(null);
      setPicturePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = {
        id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };

      // Save the user
      await fetch("http://localhost:5001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const commonData = {
        id: userData.id,
        name: formData.name,
        email: formData.email,
        profilePicture: profilePicture
          ? URL.createObjectURL(profilePicture)
          : defaultAvatar,
      };

      // Save to mentees or mentors based on the role
      if (formData.role === "mentor") {
        const mentorData = {
          ...commonData,
          specialty: formData.specialty,
          designation: formData.designation,
          company: formData.company,
          location: formData.location,
          skills: formData.skills.split(",").map((skill) => skill.trim()), // Split skills into an array
        };

        await fetch("http://localhost:5001/mentors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mentorData),
        });
      } else {
        await fetch("http://localhost:5001/mentees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commonData),
        });
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img
          src={require("../assets/MC.webp")}
          alt="Community"
          className={styles.bannerImage}
        />
      </div>
      <div className={styles.loginSection}>
        <div className={styles.heading}>
          Register as{" "}
          {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {picturePreview && (
            <img
              src={picturePreview}
              alt="Profile Preview"
              className={styles.profilePreview}
            />
          )}

          {formData.role === "mentor" && (
            <>
              <div className={styles.gap}></div> {/* Add a gap here */}
              <input
                type="text"
                name="specialty"
                placeholder="Specialty"
                onChange={handleChange}
                className={styles.inputField}
                required
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                onChange={handleChange}
                className={styles.inputField}
                required
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                onChange={handleChange}
                className={styles.inputField}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleChange}
                className={styles.inputField}
                required
              />
              <input
                type="text"
                name="skills"
                placeholder="Skills (comma-separated)"
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </>
          )}

          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
