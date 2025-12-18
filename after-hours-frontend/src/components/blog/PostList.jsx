import React, { useState } from "react";
import axios from "axios";
import { useTheme } from "../../hooks/useTheme";

export default function PostList({ posts, user, token, onPostUpdated, onPostDeleted }) {
  const { theme } = useTheme();
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = async (postId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdated(res.data);
      setEditingPostId(null);
      setEditedContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to save edit.");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onPostDeleted(postId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  if (!posts || posts.length === 0)
    return <p style={{ textAlign: "center", color: theme.text, opacity: 0.7 }}>No posts yet.</p>;

  return (
    <div className="post-list">
      {posts.map((post) => {
        // --- THE FIX: COMPARE NAMES INSTEAD OF IDS ---
        // We check if the logged-in username matches the post's author name
        const isOwner = user && (user.username === post.author || user.firstName === post.author);

        return (
          <div 
            key={post._id} 
            className="post-card"
            style={{
              border: `1px solid ${theme.accent}`,
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              backgroundColor: "rgba(255,255,255,0.05)", // Subtle dark background
              color: theme.text,
              fontFamily: theme.fontFamily
            }}
          >
            <h3 style={{ color: theme.primary, marginTop: 0 }}>{post.title || ""}</h3>

            {editingPostId === post._id ? (
              /* --- EDIT MODE --- */
              <div style={{ marginTop: "10px" }}>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${theme.accent}`,
                    fontFamily: theme.fontFamily,
                    marginBottom: "10px"
                  }}
                  rows="4"
                />
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button 
                    onClick={() => handleEdit(post._id)}
                    style={{ backgroundColor: theme.primary, color: "white", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingPostId(null)}
                    style={{ backgroundColor: "gray", color: "white", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* --- VIEW MODE --- */
              <>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", margin: "10px 0" }}>
                  {post.content || ""}
                </p>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  fontSize: "0.85rem",
                  borderTop: `1px solid ${theme.accent}50`,
                  paddingTop: "10px",
                  marginTop: "10px",
                  color: theme.text
                }}>
                  {/* --- THE FIX: DISPLAY AUTHOR NAME DIRECTLY --- */}
                  <span style={{ opacity: 0.8 }}>
                    By <strong>{post.author || "Unknown"}</strong> on{" "}
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                  </span>

                  {isOwner && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditedContent(post.content || "");
                        }}
                        style={{
                          background: "transparent",
                          color: theme.primary,
                          border: `1px solid ${theme.primary}`,
                          borderRadius: "6px",
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "bold"
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(post._id)}
                        style={{
                          background: "transparent",
                          color: "#ff4d4d", // Red for delete
                          border: "1px solid #ff4d4d",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "bold"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}