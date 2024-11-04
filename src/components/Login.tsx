import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import styles from "../styles/Login.module.css";
import { toast, ToastContainer } from "react-toastify"; // Import Toast functions
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  name: string;
}

const Login: React.FC = () => {
  const { login } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"mentor" | "mentee">(
    "mentee"
  );
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:5001/users")
      .then((res) => res.json())
      .then((users: User[]) => {
        const user = users.find(
          (u: User) => u.username === username && u.role === selectedRole
        );

        if (!user) {
          toast.error("User does not exist."); // Show error if user doesn't exist
          return;
        }

        if (user.password !== password) {
          toast.error("Incorrect password."); // Show error if password is wrong
          return;
        }

        login(user.id, user.role, user.username);
        navigate(
          user.role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard"
        );
      })
      .catch((err) => {
        console.error("Login failed", err);
        toast.error("An error occurred during login."); // General error handling
      });
  };

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className={styles.banner}>
        <img
          src={require("../assets/MC.webp")}
          alt="Community"
          className={styles.bannerImage}
        />
      </div>
      <div className={styles.loginSection}>
        <h2>Login</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              selectedRole === "mentee" ? styles.active : ""
            }`}
            onClick={() => setSelectedRole("mentee")}
          >
            I’m a Mentee
          </button>
          <button
            className={`${styles.tab} ${
              selectedRole === "mentor" ? styles.active : ""
            }`}
            onClick={() => setSelectedRole("mentor")}
          >
            I’m a Mentor
          </button>
        </div>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
        <div className={styles.signupLinks}>
          <div className={styles.signupButtonContainer}>
            {/* Updated buttons to pass role via query parameters */}
            <button
              className={styles.signupButton}
              onClick={() => navigate("/register?role=mentee")}
            >
              Signup as Mentee
            </button>
            <span> or </span>
            <button
              className={styles.signupButton}
              onClick={() => navigate("/register?role=mentor")}
            >
              Signup as Mentor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
