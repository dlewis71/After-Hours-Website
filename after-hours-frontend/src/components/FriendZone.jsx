import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useSocket } from "./SocketContext.jsx";
import LockedMessageBox from "./LockedMessageBox.jsx";
import { useTheme } from "../hooks/useTheme.jsx"; // 1. Import useTheme
import "./FriendZone.css";

const FriendZone = forwardRef(({ locked }, ref) => {
  const { theme } = useTheme(); // 2. Get the theme
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [message, setMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const users = [
    { name: "Destiny", img: "/images/prettywoman1.png" },
    { name: "Abby", img: "/images/prettywoman2.png" },
    { name: "baby_doll", img: "/images/prettywoman12.png" },
    { name: "Shay", img: "/images/prettywoman3.png" },
    { name: "Stone Fox", img: "/images/prettywoman4.png" },
    { name: "Melanie", img: "/images/prettywoman5.png" },
    { name: "Ramona", img: "/images/prettywoman9.png" },
  ];

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const handleIncoming = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("chatMessage", handleIncoming);
    socket.on("privateMessage", handleIncoming);
    return () => {
      socket.off("chatMessage", handleIncoming);
      socket.off("privateMessage", handleIncoming);
    };
  }, [socket]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || locked) {
      if (locked) setMessage("🔒 Subscribe to chat with friends.");
      return;
    }

    const newMsg = {
      text: input,
      sender: "You",
      recipient: chatUser?.name || null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (socket) {
      if (chatUser) socket.emit("privateMessage", newMsg);
      else socket.emit("chatMessage", newMsg);
    }

    setInput("");
  };

  const handleSelectUser = (u) => {
    if (locked) {
      setMessage("🔒 Subscribe to chat with this user.");
      return;
    }
    setChatUser(u);
  };

  const backToGroup = () => setChatUser(null);
  const clearMessages = () => setMessages([]);

  return (
    <section className="friendzone-section" ref={ref} style={{ fontFamily: theme.fontFamily }}>
      <h2 className="friendzone-title" style={{ color: theme.primary }}>👥 Friend Zone</h2>

      {!locked && messages.length === 0 && (
        <p className="locked-message" style={{ color: theme.text }}>No messages yet. Start chatting!</p>
      )}

      <div className="friendzone-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <h3 style={{ color: theme.primary }}>Users</h3>
          <ul>
            {users.map((u, i) => (
              <li
                key={i}
                className={`user-item ${chatUser?.name === u.name ? "selected" : ""}`}
                onClick={() => handleSelectUser(u)}
                style={{ borderColor: theme.accent, color: theme.text }}
              >
                <img src={u.img} alt={u.name} style={{ borderColor: theme.accent }} />
                <span>{u.name}</span>
              </li>
            ))}
          </ul>
          {chatUser && (
            <button
              type="button"
              className="profile-btn back-to-group-btn"
              onClick={backToGroup}
              style={{ backgroundColor: theme.primary, color: theme.text }}
            >
              Back to Group Chat
            </button>
          )}
        </div>

        {/* Main chat area */}
        <div className="chat-main">
          <h4 style={{ color: theme.primary }}>
            {chatUser ? `💬 Chatting with ${chatUser.name}` : "Group Chat"}
          </h4>

          <div className="messages-box" style={{ borderColor: theme.accent }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className="message"
                style={{ 
                  // 3. APPLY FONT COLOR TO MESSAGE TEXT
                  color: theme.text, 
                  fontFamily: theme.fontFamily,
                  marginBottom: "8px"
                }}
              >
                <strong style={{ color: theme.primary }}>{msg.sender}</strong>
                {msg.recipient ? ` → ${msg.recipient}:` : ":"} {msg.text}
                
                {/* 4. APPLY FONT COLOR TO TIMESTAMP (SAME AS TEXT) */}
                <span 
                  className="time" 
                  style={{ 
                    color: theme.text, // Same color as message!
                    marginLeft: "10px", 
                    fontSize: "0.85rem", 
                    fontStyle: "italic" 
                  }}
                >
                  ({msg.time})
                </span>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={locked}
              placeholder={locked ? "Subscription required" : "Type your message..."}
              style={{ 
                fontFamily: theme.fontFamily, 
                borderColor: theme.accent,
                color: "#333" // Keep input text dark for readability
              }}
            />
            <button
              type="submit"
              className="profile-btn send-btn"
              disabled={locked || !input.trim()}
              style={{ backgroundColor: theme.primary, color: theme.text }}
            >
              Send
            </button>
            <button
              type="button"
              className="profile-btn clear-btn"
              onClick={clearMessages}
              style={{ backgroundColor: theme.primary, color: theme.text }}
            >
              Clear
            </button>
          </form>
        </div>
      </div>

      {message && <LockedMessageBox text={message} onClose={() => setMessage(null)} />}
    </section>
  );
});

export default FriendZone;