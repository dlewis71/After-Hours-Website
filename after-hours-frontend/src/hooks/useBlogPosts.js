// src/hooks/useBlogPosts.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getToken } from "@/components/services/auth.js";

const API_URL = "http://localhost:5000/api/blog"; // your backend URL

const useBlogPosts = (user) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
      setError(err.message === "Network Error" ? "Cannot reach backend." : err.response?.data?.error || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Create a post
  const addPost = useCallback(async (postData) => {
    if (!user) return setError("You must be logged in to create a post.");
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await axios.post(API_URL, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(prev => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      setError(err.message === "Network Error" ? "Cannot reach backend. Post not saved." : err.response?.data?.error || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update a post
  const updatePost = useCallback(async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await axios.put(`${API_URL}/${id}`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(prev => prev.map(p => (p._id === id ? res.data : p)));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update post.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a post
  const deletePost = useCallback(async (id) => {
    if (!user) return setError("You must be logged in to delete a post.");
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to delete post.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { posts, loading, error, addPost, updatePost, deletePost, setError, fetchPosts };
};

export default useBlogPosts;
