import React, { useState } from "react";
import axios from "axios";

export default function CreatePost({ onPostCreated }) {
  const [form, setForm] = useState({ title: "", content: "", author: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.author) return;

    try {
      const res = await axios.post("http://localhost:5000/posts", form);
      onPostCreated(res.data);
      setForm({ title: "", content: "", author: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "1em",
        backgroundColor: "#ffffff",
        padding: "15px",
        borderRadius: "8px",
        border: "2px solid #f8b195"
      }}
    >
      <h2 style={{ color: "#c94f7c" }}>Create New Post</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "8px",
          borderRadius: "4px",
          border: "1px solid #f8b195"
        }}
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Content"
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "8px",
          borderRadius: "4px",
          border: "1px solid #f8b195"
        }}
      />
      <input
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "8px",
          borderRadius: "4px",
          border: "1px solid #f8b195"
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: "#c94f7c",
          color: "#ffffff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Post
      </button>
    </form>
  );
}
