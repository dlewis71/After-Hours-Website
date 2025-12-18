import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewPost({ user }) {
  const [form, setForm] = useState({ title: "", content: "", author: user.username });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.content) {
      setError("Title and content are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/posts", form);
      setForm({ title: "", content: "", author: user.username });
      navigate("/"); // redirect to blog page
    } catch (err) {
      console.error(err);
      setError("Failed to create post. Make sure the backend is running.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Write your post here..."
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
