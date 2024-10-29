import React from "react";
import { Link } from "react-router-dom";
import "../styles/Hero.module.css";
import heroImage from "../assets/hero-image.png";

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>
          Book 1:1 calls with
          <br /> the world's top mentors.
        </h1>
        <Link to="/login" className="cta-button">
          {" "}
          {/* Use Link for navigation */}
          Become a Member
        </Link>
      </div>
      <img src={heroImage} alt="Mentoring" className="hero-image" />
    </section>
  );
};

export default Hero;
