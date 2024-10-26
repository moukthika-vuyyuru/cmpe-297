import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import styles from "../styles/Navbar.module.css";

const Navbar: React.FC = () => {
  const { userId, logout } = useUserContext(); // Get userId and logout function from context
  const navigate = useNavigate();
  const isLoggedIn = Boolean(userId); // Check if userId is available

  const handleLogout = () => {
    logout(); // Call context logout function
    alert("Logged out successfully!");
    navigate("/"); // Redirect after logout
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>MentorConnect</div>
      <nav>
        <Link to="/mentors">Find Mentors</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/testimonials">Testimonials</Link>
        {isLoggedIn ? (
          <>
            <span className={styles.username}>Welcome, User!</span>{" "}
            {/* Optional: Display username */}
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
