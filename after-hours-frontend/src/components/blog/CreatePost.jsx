import React, { useState } from "react";
import axios from "axios";
import { useTheme } from "../../hooks/useTheme";

export default function CreatePost({ onPostCreated, user }) {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const token = user?.token || localStorage.getItem("token");
      
      // --- THE FIX IS HERE ---
      // We explicitly send 'author' using the logged-in user's username
      const payload = {
        title,
        content,
        author: user.username || user.firstName || "Anonymous" 
      };

      const res = await axios.post("http://localhost:5000/api/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onPostCreated(res.data);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="create-post-card"
      style={{
        border: `2px solid ${theme.accent}`,
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "3rem",
        backgroundColor: "rgba(255,255,255,0.05)" // Subtle transparency
      }}
    >
      <h2 style={{ color: theme.primary, marginTop: 0, fontFamily: theme.fontFamily }}>
        Create a New Post
      </h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: `1px solid ${theme.accent}`,
            backgroundColor: theme.background,
            color: theme.text,
            fontFamily: theme.fontFamily,
            outline: "none"
          }}
          required
        />
        <textarea
          placeholder="Write your post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: `1px solid ${theme.accent}`,
            backgroundColor: theme.background,
            color: theme.text,
            fontFamily: theme.fontFamily,
            outline: "none"
          }}
          required
        />
        <button 
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: theme.primary,
            color: theme.text,
            border: "none",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            float: "right",
            fontFamily: theme.fontFamily,
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
        <div style={{ clear: "both" }}></div>
      </form>
    </div>
  );
}