import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";

// --- Helper Components ---

// Displays loading, error, or empty states
const StatusDisplay = ({ isLoading, error, onBack }) => {
  if (isLoading) {
    return <div className="text-center py-20 text-xl font-semibold text-[#c94f7c]">Loading post details...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-20 text-lg font-medium text-red-600">
        <p>Error: {error}</p>
        <button onClick={onBack} className="mt-4 text-[#c94f7c] underline font-semibold">Return to Blog List</button>
      </div>
    );
  }
  return null;
};

// Renders a single comment
const Comment = ({ comment, user, onDelete }) => {
  const isCommentAuthor = user && user.id === comment.author?._id;
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800">{comment.author?.username || "Anonymous"}</p>
          <p className="text-sm text-gray-500">{format(new Date(comment.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}</p>
        </div>
        {isCommentAuthor && (
          <button onClick={() => onDelete(comment._id)} className="text-xs text-red-500 hover:underline">Delete</button>
        )}
      </div>
      <p className="mt-2 text-gray-700">{comment.content}</p>
    </div>
  );
};

// Form for submitting a new comment
const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    await onSubmit(content);
    setContent("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c94f7c] transition"
        rows="4"
        required
      />
      <button type="submit" disabled={isSubmitting} className="mt-2 px-6 py-2 bg-[#c94f7c] text-white font-semibold rounded-lg hover:bg-[#f8b195] transition disabled:opacity-50">
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};


// --- Main BlogPost Component ---

export default function BlogPost({ postId, user, onBack, onEdit, onDelete }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch the post and its comments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/blog/${postId}`),
          axios.get(`${API_BASE_URL}/blog/${postId}/comments`)
        ]);
        
        if (!postResponse.data) throw new Error("Post not found.");
        
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const isAuthor = post && user && post.author?._id === user.id;

  // --- Comment Handlers ---
  const handleCommentSubmit = async (content) => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token"); // Assuming token is in localStorage
      const response = await axios.post(
        `${API_BASE_URL}/blog/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data, ...comments]); // Add new comment to the top
    } catch (err) {
      alert("Failed to post comment. Please try again."); // Simple error handling
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };

  if (isLoading || error) {
    return <StatusDisplay isLoading={isLoading} error={error} onBack={onBack} />;
  }
  if (!post) {
    return <StatusDisplay error="Post could not be found." onBack={onBack} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center mb-6 px-4 py-2 bg-[#f8b195] text-white font-semibold rounded-lg hover:bg-[#c94f7c] transition duration-300 shadow-md"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Blog
      </button>

      <article className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-xl mb-8 shadow-lg" />
        )}
        <header>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#c94f7c] mb-3 leading-tight">{post.title}</h1>
          <p className="text-gray-500 text-lg mb-8 border-b pb-4 border-gray-100">
            By <span className="font-bold text-gray-700">{post.author?.username || "Unknown"}</span> on{" "}
            {post.createdAt ? format(new Date(post.createdAt), 'MMMM dd, yyyy') : '...'}
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</div>

        {isAuthor && (
          <footer className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
            <button onClick={onEdit} className="px-6 py-2 border border-[#c94f7c] text-[#c94f7c] font-semibold rounded-lg hover:bg-[#fcefee]">Edit</button>
            <button onClick={onDelete} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">Delete</button>
          </footer>
        )}
      </article>

      {/* --- NEW: Comments Section --- */}
      <section className="mt-12 bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Comments ({comments.length})</h2>
        {user ? (
          <CommentForm onSubmit={handleCommentSubmit} />
        ) : (
          <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg">Please <a href="#" onClick={(e) => { e.preventDefault(); /* TODO: Show login modal */ }} className="text-[#c94f7c] font-semibold hover:underline">log in</a> to post a comment.</p>
        )}
        <div className="mt-8 space-y-6">
          {comments.length > 0 ? (
            comments.map(comment => <Comment key={comment._id} comment={comment} user={user} onDelete={handleDeleteComment} />)
          ) : (
            <p className="text-center text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>
    </div>
  );
}