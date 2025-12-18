import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CreatePost from "./CreatePost";

export default function BlogPage({ user }) {
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add new post to list
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fcefee",
        color: "#333",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ color: "#c94f7c" }}>After Hours Blog</h1>

      {/* Show CreatePost form if user is logged in */}
      {user && (
        <div style={{ marginBottom: "20px" }}>
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Optional link to separate new post page */}
      {user && (
        <Link
          to="/new"
          style={{ marginBottom: "20px", display: "inline-block", color: "#c94f7c" }}
        >
          Or go to the Create New Post page
        </Link>
      )}

      {/* Posts list */}
      {posts.length === 0 ? (
        <p>There are currently no posts.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #f8b195",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#ffffff",
              color: "#333"
            }}
          >
            <h3 style={{ color: "#c94f7c" }}>
              <Link
                to={`/post/${post.id}`}
                style={{ color: "#c94f7c", textDecoration: "none" }}
              >
                {post.title}
              </Link>
            </h3>
            <p>{post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content}</p>
            <small>
              By {post.author} on {post.date}
            </small>
          </div>
        ))
      )}
    </div>
  );
}
