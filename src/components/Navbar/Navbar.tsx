import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import styles from "./Navbar.module.css";
import { Home, ExitToApp, Person, Dashboard } from "@mui/icons-material"; // Import the Dashboard icon
import { toast, ToastContainer } from "react-toastify"; // Import Toast functions
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

const Navbar: React.FC = () => {
  const { userId, logout, role, name } = useUserContext(); // Get userId, logout function, and role from context
  const navigate = useNavigate();
  const isLoggedIn = Boolean(userId); // Check if userId is available

  const handleLogout = () => {
    // Confirm logout
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      logout(); // Call context logout function
      toast.success("Logged out successfully!"); // Show success toast
      navigate("/"); // Redirect after logout
    }
  };

  const handleDashboardClick = () => {
    if (role === "mentee") {
      navigate("/mentee-dashboard"); // Navigate to mentee dashboard
    } else if (role === "mentor") {
      navigate("/mentor-dashboard"); // Navigate to mentor dashboard
    } else {
      console.error("User role is not defined."); // Handle case where role is undefined
    }
  };

  return (
    <header className={styles.navbar}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className={styles.leftSection}>
        <div className={styles.iconTextContainer} onClick={() => navigate("/")}>
          <button className={styles.homeButton}>
            <Home />
          </button>
          <span>MentorConnect</span>
        </div>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/testimonials">Testimonials</Link>
      </div>
      <div className={styles.rightSection}>
        {isLoggedIn ? (
          <>
            <button onClick={handleDashboardClick} className={styles.button}>
              <Dashboard />
              Dashboard
            </button>
            <span>Welcome, {name}!</span>{" "}
            <button onClick={handleLogout} className={styles.button}>
              <ExitToApp />
            </button>
          </>
        ) : (
          <Link to="/login">
            <Person />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
