import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenteeDashboard.module.css";
import { FollowRequest } from "../types";
import { FaMapMarkerAlt } from "react-icons/fa";
import Chat from "./Chat";
import UserProfile from "./UserProfile";
import FollowRequestModal from "./FollowRequestModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MentorCard from "./MentorCard";
import { Mentor } from "../types";
import MentorProfileModal from "./MentorProfileModal";

const defaultAvatar = "https://mentorapplication.s3.us-west-2.amazonaws.com/default-avatar.jpeg";


const MenteeDashboard: React.FC = () => {
  const { userId: menteeId, name: menteeName } = useUserContext();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [followedMentors, setFollowedMentors] = useState<Mentor[]>([]);
  const [activeTab, setActiveTab] = useState<
    "home" | "applications" | "inquiries" | "profile"
  >("home");
  const [recommendedMentors, setRecommendedMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedMentorForRequest, setSelectedMentorForRequest] =
    useState<Mentor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "AI", text: "Hi! How can I help you find a mentor?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mentors`);
        const data = await res.json();
        setMentors(data);
      } catch (err) {
        console.error("Failed to load mentors", err);
      }
    };

    fetchMentors();
  }, []);

  // Define fetchPendingRequests here
  const fetchPendingRequests = async () => {
    if (!menteeId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/followRequests?menteeId=${menteeId}`
      );
      const data: FollowRequest[] = await res.json();
      setPendingRequests(data);
    } catch (err) {
      console.error("Failed to load follow requests", err);
    }
  };

  useEffect(() => {
    fetchPendingRequests(); // Call on component mount
  }, [menteeId]);

  useEffect(() => {
    const acceptedMentorIds = pendingRequests
      .filter((request) => request.status === "accepted")
      .map((request) => request.mentorId);
    const followed = mentors.filter((mentor) =>
      acceptedMentorIds.includes(mentor.id)
    );
    setFollowedMentors(followed);
  }, [mentors, pendingRequests]);

  useEffect(() => {
    const availableMentors = mentors.filter(
      (mentor) =>
        !pendingRequests.some((req) => req.mentorId === mentor.id) &&
        !followedMentors.some((followed) => followed.id === mentor.id)
    );
    setRecommendedMentors(availableMentors);
  }, [mentors, pendingRequests, followedMentors]);

  const handleFollow = (mentor: Mentor) => {
    setSelectedMentorForRequest(mentor);
    setShowModal(true);
  };

  const sendFollowRequest = async (message: string) => {
    if (!selectedMentorForRequest || !menteeId) return;

    try {
      const res = await fetch(`http://localhost:8080/followRequests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menteeId,
          mentorId: selectedMentorForRequest.id,
          status: "pending",
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send follow request.");

      toast.success("Follow request sent successfully!");
      setShowModal(false);
      setSelectedMentorForRequest(null);

      // Refresh the pending requests
      await fetchPendingRequests(); // Now correctly calls the defined function

      // Remove the followed mentor from the recommended list
      setRecommendedMentors((prev) =>
        prev.filter((mentor) => mentor.id !== selectedMentorForRequest.id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to send follow request. Please try again.");
    }
  };

  const handleBack = () => {
    setSelectedMentor(null); // Reset the selected mentor
  };

  const cancelFollowRequest = async (requestId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/followRequests/${requestId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to cancel follow request.");

      toast.success("Follow request canceled successfully!");

      // Update the state to remove the canceled request
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel follow request. Please try again.");
    }
  };

  const toggleChat = () => setIsChatOpen((prev) => !prev);
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessages = [...messages, { sender: "Mentee", text: inputText }];
    setMessages(newMessages); // Display the mentee's message immediately
    setInputText("");

    try {
      // const response = await fetch(
      //   "https://payload.vextapp.com/hook//catch/channel_token",
      //   {
      //     method: "POST",
      //     headers: {
      //       Apikey: "Api-Key .",
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ payload: inputText }),
      //   }
      // );

      // const responseData = await response.json();
      const responseData = { text: "Python" }; // Mock response for testing
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: formatAiResponse(responseData),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "There was an error retrieving recommendations. Please try again later.",
        },
      ]);
    }
  };
  const formatAiResponse = (response: any) => {
    console.log(response);

    if (!response || !response.text || typeof response.text !== "string") {
      return "No valid response received.";
    }
    //const text = response.text;
    const text =
      "\n\nBased on the mentor dataset, I recommend the following mentors who have experience in Python:\n\n1. **Bob Smith**\n\t* Skills: Python, Data Science, Machine Learning\n\t* Specialty: Data Science\n\t* Designation: Data Scientist\n\t* Company: Amazon\n\t* Location: San Francisco, CA, USA\n\nBob Smith is a Data Scientist at Amazon with expertise in Python, Data Science, and Machine Learning. He is a strong match for anyone looking for guidance in Python and related fields.\n\nPlease note that the dataset does not provide explicit information on the mentors' years of experience. However, based on their designations and companies, it can be inferred that they have significant experience in their respective fields.\n\nIf you would like to filter the results based on specific years of experience or location, please let me know, and I'll do my best to provide a more tailored recommendation.";

    const formattedText = text
      .replace(/\n\n/g, "<br><br>") // Double line breaks for paragraphs
      .replace(/\n/g, "<br>") // Single line breaks
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;") // Tabs as indentation
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") // Bold text with **
      .replace(/\*([^*]+)\*/g, "<strong>$1</strong>") // Bold text with *
      .replace(/(^|\n)\s*\*\s+/g, "<br>");

    return `<p>${formattedText}</p>`;
  };

  const handleMentorSelect = (mentor: Mentor) => {
    if (selectedMentor && selectedMentor.id === mentor.id) {
      setSelectedMentor(null); // If the same mentor is selected, hide the details
    } else {
      setSelectedMentor(mentor); // Show the detailed info of the selected mentor
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <ToastContainer /> {/* Toast notifications container */}
      <div className={styles.sidebar}>
        {/* Sidebar content */}
        <div className={styles.profileCard}>
          <img
            className={styles.profilePicture}
            src="path/to/profile/picture" // Replace with mentee's image source
            alt="Default Avatar"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h3 className={styles.username}>{menteeName || "Loading..."}</h3>
        </div>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("applications")}
        >
          Pending Requests
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("inquiries")}
        >
          Your Mentors
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "home" && (
          <div className={styles.banner}>
            <h2 className={styles.heroTitle}>Welcome, {menteeName}!</h2>
            <p className={styles.heroSubtitle}>
              Start connecting with mentors and take your career to the next
              level!
            </p>
            <div className={styles.buttonContainer}>
              <button
                className={styles.browseButton}
                onClick={() => navigate("/browse-mentors")}
              >
                Browse Mentors
              </button>
              <button className={styles.chatButton} onClick={toggleChat}>
                Chat with AI
              </button>
            </div>

            {recommendedMentors.length > 0 && (
              <div className={styles.recommendedSection}>
                <h3>Recommended for You</h3>
                <div className={styles.recommendedMentors}>
                  {recommendedMentors.slice(0, 5).map((mentor) => (
                    <div
                      key={mentor.id}
                      className={styles.recommendedMentorCard}
                    >
                      <div
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowProfileModal(true);
                        }}
                      >
                        <MentorCard mentor={mentor} />
                      </div>
                      <button
                        className={styles.followButton}
                        onClick={() => handleFollow(mentor)}
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showProfileModal && selectedMentor && (
              <MentorProfileModal
                mentor={selectedMentor}
                onClose={() => setShowProfileModal(false)}
                onFollow={() => handleFollow(selectedMentor)}
              />
            )}
          </div>
        )}
        {activeTab === "applications" && (
          <div className={styles.mentorList}>
            {pendingRequests.filter((request) => request.status === "pending")
              .length > 0 ? (
              pendingRequests
                .filter((request) => request.status === "pending")
                .map((request) => {
                  const mentor = mentors.find(
                    (mentor) => mentor.id === request.mentorId
                  );
                  return (
                    mentor && (
                      <div key={request.id} className={styles.mentorCard}>
                        <img
                          src={mentor.image || defaultAvatar}
                          alt={mentor.name}
                          className={styles.mentorImage}
                        />
                        <div className={styles.mentorDetails}>
                          <h3>{mentor.name}</h3>
                          <p>{mentor.specialty}</p>
                          <div className={styles.mentorLocation}>
                            <FaMapMarkerAlt />
                            <span>{mentor.location}</span>
                          </div>
                          <p className={styles.pendingStatus}>
                            Request is pending
                          </p>
                          <button
                            className={styles.browseButton}
                            onClick={() => cancelFollowRequest(request.id)}
                          >
                            Cancel Request
                          </button>
                        </div>
                      </div>
                    )
                  );
                })
            ) : (
              <p>No pending follow requests.</p>
            )}
          </div>
        )}
        {activeTab === "inquiries" && (
          <div className={styles.inquiriesContainer}>
            {selectedMentor ? (
              <div className={styles.chatContainer}>
                <Chat
                  recipientId={selectedMentor.id}
                  recipientName={selectedMentor.name}
                  onBack={handleBack} // Pass the back handler here
                />
              </div>
            ) : (
              <div className={styles.mentorList}>
                {followedMentors.length > 0 ? (
                  followedMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className={styles.mentorCard}
                      onClick={() => handleMentorSelect(mentor)}
                    >
                      <img
                        src={mentor.image || defaultAvatar}
                        alt={mentor.name}
                        className={styles.mentorImage}
                      />
                      <div className={styles.mentorDetails}>
                        <h3>{mentor.name}</h3>
                        <p>{mentor.specialty}</p>
                        <div className={styles.mentorLocation}>
                          <FaMapMarkerAlt />
                          <span>{mentor.location}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No followed mentors to chat with.</p>
                )}
              </div>
            )}
          </div>
        )}
        {/* Follow Request Modal */}
        {showModal && selectedMentorForRequest && (
          <FollowRequestModal
            mentorName={selectedMentorForRequest.name}
            onSend={sendFollowRequest}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
      {isChatOpen && (
        <div className={styles.fullPageChat}>
          <div className={styles.chatHeader}>
            <h4>Mentor Recommendations</h4>
            <button onClick={toggleChat}>X</button>
          </div>
          <div className={styles.chatContent}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "AI" ? styles.aiMessage : styles.userMessage
                }
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ))}
          </div>

          <div className={styles.chatInputContainer}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for a mentor recommendation..."
              className={styles.chatInput}
            />
            <button onClick={handleSendMessage} className={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeDashboard;