import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "./UserContext";
import styles from "../styles/Chat.module.css";

interface ChatProps {
  recipientId: string; // Define recipientId as a required prop
}

const Chat: React.FC<ChatProps> = ({ recipientId }) => {
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
    </div>
  );
};

export default Chat;
