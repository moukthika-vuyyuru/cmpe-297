import React from "react";
import styles from "../styles/Testimonials.module.css";

const Testimonials: React.FC = () => (
  <section id="testimonials" className={styles.testimonials}>
    <h2>What People Say</h2>
    <blockquote>"This platform helped me land my dream job!"</blockquote>
    <p>- Satisfied Mentee</p>
  </section>
);

export default Testimonials;
