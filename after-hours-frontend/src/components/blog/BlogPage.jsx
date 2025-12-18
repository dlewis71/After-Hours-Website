import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
// import PostList from "./PostList"; // Removed: We are rendering list here to add buttons
import { useTheme } from "../../hooks/useTheme";

export default function BlogPage({ user }) {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // --- EDITING STATE ---
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const token = user?.token || localStorage.getItem("token");

  // 1. Fetch Posts
  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (isMounted) setPosts(res.data.reverse()); // Newest first
      } catch (err) {
        console.error(err);
        if (isMounted) setMessage("Failed to load posts.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPosts();
    return () => { isMounted = false; };
  }, [token]);

  const handlePostCreated = (newPost) => setPosts([newPost, ...posts]);

  // 2. DELETE Function
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };

  // 3. EDIT Functions
  const startEditing = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdate = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}`, 
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPosts(posts.map((p) => (p._id === postId ? res.data : p)));
      cancelEditing();
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post.");
    }
  };

  // --- STYLES ---
  const containerStyle = {
    backgroundColor: theme.background,
    color: theme.text,
    fontFamily: theme.fontFamily,
    border: `2px solid ${theme.accent}`,
    borderRadius: "12px",
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    minHeight: "500px",
    boxSizing: "border-box"
  };

  return (
    <div
      className="blogpage-wrapper"
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        padding: "2rem 1rem",
        transition: "background-color 0.3s ease"
      }}
    >
      <div className="blog-page" style={containerStyle}>
        
        <h1 style={{ 
          color: theme.primary, 
          textAlign: "center", 
          fontSize: "3rem", 
          marginBottom: "2rem", 
          fontWeight: "800" 
        }}>
          After Hours Blog
        </h1>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", opacity: 0.7 }}>
            <div style={{
              width: "50px", height: "50px",
              border: `4px solid ${theme.accent}`,
              borderTop: `4px solid ${theme.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <p style={{ marginTop: "20px", color: theme.text, fontWeight: "bold" }}>Loading posts...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {user && <CreatePost onPostCreated={handlePostCreated} user={user} />}
            
            {/* RENDER POSTS LIST HERE MANUALLY */}
            <div className="posts-list">
              {posts.map((post) => {
                // Check if current user is the author
                const isAuthor = user && (user.username === post.author || user.firstName === post.author);
                const isEditing = editingId === post._id;

                return (
                  <div key={post._id} style={{
                    border: `1px solid ${theme.accent}`,
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1.5rem",
                    backgroundColor: "rgba(255,255,255,0.05)" // Subtle contrast
                  }}>
                    {isEditing ? (
                      /* --- EDIT MODE --- */
                      <div className="edit-mode">
                        <input 
                          type="text" 
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "8px", border: `1px solid ${theme.accent}` }}
                        />
                        <textarea 
                          value={editContent} 
                          onChange={(e) => setEditContent(e.target.value)}
                          rows="4"
                          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "8px", border: `1px solid ${theme.accent}` }}
                        />
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button onClick={() => handleUpdate(post._id)} style={{ backgroundColor: theme.primary, color: "white", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Save</button>
                          <button onClick={cancelEditing} style={{ backgroundColor: "gray", color: "white", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      /* --- VIEW MODE --- */
                      <div>
                        <h2 style={{ color: theme.primary, marginTop: 0 }}>{post.title}</h2>
                        <p style={{ whiteSpace: "pre-wrap", margin: "1rem 0", lineHeight: "1.6" }}>{post.content}</p>
                        
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          fontSize: "0.85rem",
                          borderTop: `1px solid ${theme.accent}50`,
                          paddingTop: "10px",
                          marginTop: "10px"
                        }}>
                          <span style={{ opacity: 0.8 }}>
                            By <strong>{post.author || "Unknown"}</strong> on {post.date ? new Date(post.date).toLocaleDateString() : "Recent"}
                          </span>

                          {/* BUTTONS: ONLY SHOW IF AUTHOR */}
                          {isAuthor && (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button 
                                onClick={() => startEditing(post)}
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
                                  color: "#ff4d4d",
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
                      </div>
                    )}
                  </div>
                );
              })}
              
              {posts.length === 0 && !loading && (
                <p style={{ textAlign: "center", opacity: 0.7 }}>No posts yet. Be the first!</p>
              )}
            </div>

            {message && (
              <p style={{ textAlign: "center", color: theme.accent, marginTop: "20px" }}>
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}