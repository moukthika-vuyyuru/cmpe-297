import React from "react";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const heroImage = "https://mentorapplication.s3.us-west-2.amazonaws.com/hero-image.png";
const Hero: React.FC = () => {
  return (
    <section className={styles.hero_section}>
      <div className={styles.hero_content}>
        <h1>
          Book 1:1 calls with
          <br /> the world's top mentors.
        </h1>
        <Link to="/login" className={styles.cta_button}>
          {" "}
          {/* Use Link for navigation */}
          Become a Member
        </Link>
      </div>
      <img src={heroImage} alt="Mentoring" className={styles.hero_image} />
    </section>
  );
};

export default Hero;
