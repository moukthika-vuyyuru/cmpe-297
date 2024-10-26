import React from "react";
import styles from "../styles/HowItWorks.module.css";

const HowItWorks: React.FC = () => (
  <section id="how-it-works" className={styles.howItWorks}>
    <h2>How It Works</h2>
    <div className={styles.steps}>
      <div className={styles.step}>1. Find a mentor</div>
      <div className={styles.step}>2. Book a session</div>
      <div className={styles.step}>3. Achieve your goals</div>
    </div>
  </section>
);

export default HowItWorks;
