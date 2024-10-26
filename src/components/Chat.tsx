import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUserContext } from "./UserContext"; // Assuming it provides user info
import styles from "../styles/Chat.module.css";

const Chat: React.FC = () => {
  const { recipientId } = useParams<{ recipientId: string }>(); // From the URL
  const { userId: contextUserId } = useUserContext(); // From logged-in user context
  const senderId = contextUserId || localStorage.getItem("userId");

  const [messages, setMessages] = useState<
    { senderId: string; receiverId: string; text: string; timestamp: string }[]
  >([]);
  const [input, setInput] = useState("");

  const isValidChat = senderId && recipientId;

  useEffect(() => {
    if (contextUserId) {
      localStorage.setItem("userId", contextUserId);
    }
  }, [contextUserId]);

  useEffect(() => {
    if (!isValidChat) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/messages`);
        const filteredMessages = response.data.filter(
          (msg: { senderId: string; receiverId: string }) =>
            (msg.senderId === senderId && msg.receiverId === recipientId) ||
            (msg.senderId === recipientId && msg.receiverId === senderId)
        );
        setMessages(filteredMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [senderId, recipientId, isValidChat]);

  //print senderId and recipientId as p tags
  const sendMessage = async () => {
    if (!input.trim() || !isValidChat) return;

    const newMessage = {
      senderId: senderId as string,
      receiverId: recipientId!,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5001/messages", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isValidChat) {
    return (
      <div className={styles.chatContainer}>
        <p>SenderId: {senderId}</p>
        <p>ReceiverId: {recipientId || "Not available"}</p>
        <p>Invalid chat</p>
      </div>
    );
  }

  return (
    // print senderId and recipientId as p tags
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.messageBubble} ${
              msg.senderId === senderId
                ? styles.senderBubble
                : styles.receiverBubble
            }`}
          >
            <p>{msg.text}</p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
      <div>
        <p>SenderId: {senderId}</p>
        <p>ReceiverId: {recipientId || "Not available"}</p>
      </div>
    </div>
  );
};

export default Chat;
