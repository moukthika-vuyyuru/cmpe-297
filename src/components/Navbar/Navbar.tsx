import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import styles from "./Navbar.module.css";
import { Home, ExitToApp, Person } from "@mui/icons-material";

const Navbar: React.FC = () => {
  const { userId, logout } = useUserContext(); // Get userId and logout function from context
  const { name } = useUserContext();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(userId); // Check if userId is available

  const handleLogout = () => {
    logout(); // Call context logout function
    alert("Logged out successfully!");
    navigate("/"); // Redirect after logout
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.iconTextContainer} onClick={() => navigate("/")}>
          <button className={styles.homeButton}>
            <Home />
          </button>
          <span>MentorConnect</span>
        </div>
        <Link to='/how-it-works'>How It Works</Link>
        <Link to='/testimonials'>Testimonials</Link>
      </div>
      <div className={styles.rightSection}>
        {isLoggedIn ? (
          <>
            <span>Welcome, {name}!</span>{" "}
            <button onClick={handleLogout} className={styles.button}>
              <ExitToApp />
            </button>
          </>
        ) : (
          <Link to='/login'>
            <Person />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
