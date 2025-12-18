import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function SinglePost() {
  const { slug } = useParams(); // slug is the post id
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/posts/${slug}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [slug]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <small>By {post.author} on {post.date}</small>
      <br />
      <Link to="/">Back to Blog</Link>
    </div>
  );
}
