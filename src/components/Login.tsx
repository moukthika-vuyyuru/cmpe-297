import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import styles from "../styles/Login.module.css"; // Import the new styles

interface User {
  id: string;
  username: string;
  password: string;
  role: string;
}

const Login: React.FC = () => {
  const { login } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:5001/users")
      .then((res) => res.json())
      .then((users: User[]) => {
        const user = users.find(
          (user) => user.username === username && user.password === password
        );

        if (user) {
          login(user.id, user.role); // Call context login
          alert("Login successful!");
          navigate(
            user.role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard"
          );
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((err) => console.error("Login failed", err));
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login</h2>
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
    </div>
  );
};

export default Login;
