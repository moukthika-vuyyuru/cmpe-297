import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Register.module.css";
import defaultAvatar from "../assets/default-avatar.jpeg"; // Default avatar import

const Register: React.FC = () => {
  const [step, setStep] = useState(1); // Track the form step
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "mentee", // Default role
    name: "",
    email: "",
    specialty: "", // Mentor-specific
    designation: "", // Mentor-specific
    company: "", // Mentor-specific
    location: "", // Mentor-specific
    skills: "", // Mentor-specific (comma-separated)
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // State for the profile picture
  const [picturePreview, setPicturePreview] = useState<string | null>(null); // State for the preview of the picture
  const navigate = useNavigate();

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/"); // Redirect if logged in
    }
  }, [navigate]);

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
      reader.onloadend = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePicture(null);
      setPicturePreview(null);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Move to the second step
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate a unique user ID
      const userId = generateUserId();

      // Prepare the user data to be saved in the users array
      const userData = {
        id: userId, // Unique ID for the user
        username: formData.username,
        password: formData.password,
        role: formData.role,
        profilePicture: profilePicture
          ? URL.createObjectURL(profilePicture) // Use the uploaded picture
          : defaultAvatar, // Fallback to default avatar
      };

      // Save user credentials to the users array
      await axios.post("http://localhost:5001/users", userData);

      // Mentor or mentee registration
      if (formData.role === "mentor") {
        const mentorData = {
          id: userId, // Match mentor ID with user ID
          name: formData.name,
          email: formData.email,
          specialty: formData.specialty,
          designation: formData.designation,
          company: formData.company,
          location: formData.location,
          skills: formData.skills.split(",").map((skill) => skill.trim()),
          profilePicture: userData.profilePicture, // Include profile picture
        };
        await axios.post("http://localhost:5001/mentors", mentorData);
      } else if (formData.role === "mentee") {
        const menteeData = {
          id: userId, // Match mentee ID with user ID
          name: formData.name,
          email: formData.email,
          profilePicture: userData.profilePicture, // Include profile picture
        };
        await axios.post("http://localhost:5001/mentees", menteeData);
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={step === 1 ? handleNextStep : handleSubmit}
    >
      <h2>Register</h2>

      {step === 1 ? (
        // Step 1: Collect basic credentials
        <>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
          </select>
          <button type="submit">Next</button>
        </>
      ) : (
        // Step 2: Role-specific details
        <>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
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
              <input
                type="text"
                name="specialty"
                placeholder="Specialty"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="skills"
                placeholder="Skills (comma-separated)"
                onChange={handleChange}
                required
              />
            </>
          )}
          <button type="submit">Register</button>
        </>
      )}
    </form>
  );
};

export default Register;
