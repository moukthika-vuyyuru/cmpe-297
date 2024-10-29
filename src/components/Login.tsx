// Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import styles from "../styles/Login.module.css";

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
          (u: User) =>
            u.username === username &&
            u.password === password &&
            u.role === selectedRole
        );
        if (user) {
          login(user.id, user.role, user.username);
          navigate(
            user.role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard"
          );
        } else {
          alert("Invalid credentials or role.");
        }
      })
      .catch((err) => console.error("Login failed", err));
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
