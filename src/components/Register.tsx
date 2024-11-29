import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Register.module.css";

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
    companyOrUniversity: "", // Updated field name for mentee
    location: "",
    skills: "",
    specialty: "", // Added for mentor
    designation: "", // Added for mentor
    company: "", // Added for mentor
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const commonData = {
        id: userData.id,
        name: formData.name,
        email: formData.email,
        location: formData.location,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        profilePicture: "",
        bio: "",
      };

      // Save to mentees or mentors based on the role
      if (formData.role === "mentor") {
        const mentorData = {
          ...commonData,
          specialty: formData.specialty,
          designation: formData.designation,
          company: formData.company,
        };

        await fetch("http://localhost:8080/mentors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mentorData),
        });
      } else {
        // For mentees, use companyOrUniversity field
        const menteeData = {
          ...commonData,
          companyOrUniversity: formData.companyOrUniversity,
        };

        await fetch("http://localhost:8080/mentees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menteeData),
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
          src="https://mentorapplication.s3.us-west-2.amazonaws.com/MC.webp"
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

          {formData.role === "mentor" && (
            <>
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

          {formData.role === "mentee" && (
            <>
              <input
                type="text"
                name="companyOrUniversity"
                placeholder="Company or University"
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
