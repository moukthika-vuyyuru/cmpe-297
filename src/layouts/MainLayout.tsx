import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";

const MainLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.content}>
        <Outlet /> {/* Renders the child routes here */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
