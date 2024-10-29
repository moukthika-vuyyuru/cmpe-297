import React, { useEffect, useState } from "react";
import MentorList from "../MentorList";
import Hero from "../Hero/Hero";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("isLoggedIn:", userLoggedIn);
    setIsLoggedIn(userLoggedIn);
  }, []);

  return (
    <div className="home">
      {/* Conditionally render Hero Section */}
      {!isLoggedIn && <Hero />}

      {/* Mentor Preview Section */}
      <section className={styles.mentor_preview}>
        <h2>Meet Our Mentors</h2>
        <MentorList />
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophy_section}>
        <h2>Our Philosophy</h2>
        <div className={styles.philosophy_cards}>
          <div className={styles.card}>
            <h3>Wealthy</h3>
            <p>Create value for society and build freedom with leverage.</p>
          </div>
          <div className={styles.card}>
            <h3>Healthy</h3>
            <p>Optimize your mind and body for peak performance.</p>
          </div>
          <div className={styles.card}>
            <h3>Happy</h3>
            <p>
              Align your passions with your business to make an impact on the
              world.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className={styles.steps_section}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <h3>Step 01</h3>
            <p>Become a Member and unlock access to top mentors.</p>
          </div>
          <div className={styles.step}>
            <h3>Step 02</h3>
            <p>Build a brief to share your goals with mentors.</p>
          </div>
          <div className={styles.step}>
            <h3>Step 03</h3>
            <p>Meet with mentors and achieve your business goals.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
