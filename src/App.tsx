import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./components/Home/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import MentorTimeline from "./components/MentorTimeline";
import MentorDashboard from "./components/MentorDashboard";
import MenteeDashboard from "./components/MenteeDashboard";
import { UserProvider } from "./components/UserContext";
import BrowseMentors from "./components/BrowseMentors";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Main layout handling navbar, footer, and common pages */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/mentor-timeline" element={<MentorTimeline />} />
            <Route path="/browse-mentors" element={<BrowseMentors />} />
          </Route>

          {/* Render MenteeDashboard without MainLayout */}
          <Route path="/mentee-dashboard" element={<MenteeDashboard />} />

          {/* Login and Register are separate pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
