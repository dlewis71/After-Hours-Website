import React, { useState, useEffect } from "react";
// The date-fns library is great for date formatting.
// To run this code, you may need to install it: npm install date-fns
import { format } from "date-fns";

// --- MOCK DATA & USER ---
// This simulates data you would get from a database or API.
const mockUser = {
    _id: 'user1',
    username: 'CodeExplorer'
};

const mockPosts = [
    {
        _id: '1',
        title: 'A Deep Dive into Modern CSS',
        author: { username: 'CSSMaster' },
        createdAt: '2025-10-15T14:48:00.000Z',
        content: 'Modern CSS has evolved far beyond simple color and layout changes. In this post, we explore advanced topics like Grid, Flexbox, custom properties, and container queries that empower developers to build incredibly responsive and dynamic user interfaces without relying on heavy frameworks.',
        excerpt: 'Explore advanced CSS topics like Grid, Flexbox, custom properties, and container queries to build responsive and dynamic UIs.',
        thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421b436d?q=80&w=2070&auto=format&fit=crop',
    },
    {
        _id: '2',
        title: 'My Journey with React State Management',
        author: { username: 'CodeExplorer' }, // This post is by the logged-in user
        createdAt: '2025-10-14T11:20:00.000Z',
        content: 'From props drilling to the Context API, and finally to libraries like Redux and Zustand, managing state in React is a journey. This article documents my experiences, the pros and cons of each approach, and how I finally settled on a scalable solution for my projects.',
        excerpt: 'A personal journey through React state management, from Context API to Redux and Zustand, weighing the pros and cons.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    },
    {
        _id: '3',
        title: 'Backend Development with Node.js',
        author: { username: 'ServerSideDev' },
        createdAt: '2025-10-12T09:05:00.000Z',
        content: "Node.js continues to be a powerhouse for backend development due to its non-blocking I/O and vast ecosystem. We'll build a simple REST API from scratch using Express.js and connect it to a MongoDB database, covering everything from routing to middleware.",
        // This post has no excerpt, so the summary will be generated from the content.
        thumbnail: null, // This post has no thumbnail
    },
];

// --- PRESENTATIONAL COMPONENT (Your Provided Code, with minor adjustments) ---

/**
 * Displays a single blog post summary card.
 */
function BlogCard({ post, user, onView, onEdit, onDelete }) {
    // Check if the current user is the author. This is more robust
    // as it compares a unique property of the author object.
    const isAuthor = user && user.username === post.author?.username;

    // Use a fallback for the date if it's invalid
    const formattedDate = post.createdAt
        ? format(new Date(post.createdAt), 'MMM dd, yyyy')
        : 'Unknown Date';

    // Determine the post summary (prioritize excerpt, then content, then fallback)
    const summaryText = post.excerpt
        ? post.excerpt.substring(0, 100) + (post.excerpt.length > 100 ? '...' : '')
        : post.content
        ? post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')
        : "No preview available...";

    return (
        <article className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1">
            {/* Thumbnail */}
            {post.thumbnail ? (
                <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={onView}
                />
            ) : (
                <div
                    className="w-full h-48 bg-[#fcefee] flex items-center justify-center text-[#f8b195] italic cursor-pointer"
                    onClick={onView}
                >
                    No image available
                </div>
            )}

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h2
                    className="text-xl font-bold text-[#f08ea7] mb-2 cursor-pointer hover:text-[#c94f7c] transition-colors"
                    onClick={onView}
                >
                    {post.title || "Untitled Post"}
                </h2>

                <p className="text-gray-700 text-sm mb-4 leading-normal flex-grow">
                    {summaryText}
                </p>

                {/* Metadata */}
                <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                    <span className="font-medium">By {post.author?.username || "Anonymous"}</span>
                    <span>{formattedDate}</span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={onView}
                        className="flex-1 min-w-[60px] bg-[#c94f7c] text-white text-sm font-semibold py-2 rounded-lg shadow-md hover:bg-[#a83a62] transition-colors"
                    >
                        Read
                    </button>

                    {isAuthor && (
                        <>
                            <button
                                onClick={onEdit}
                                className="flex-1 min-w-[60px] border border-[#c94f7c] text-[#c94f7c] text-sm font-semibold py-2 rounded-lg hover:bg-[#fcefee] transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={onDelete}
                                className="flex-1 min-w-[60px] bg-red-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}


// --- CONTAINER COMPONENT ---
/**
 * Manages the state and logic for displaying a list of blog cards.
 */
export default function BlogCardPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Simulate fetching data when the component mounts
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setPosts(mockPosts);
            setUser(mockUser); // Simulate logging in a user
            setLoading(false);
        }, 1500); // Simulate a 1.5s network delay

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    // --- Action Handlers ---
    const handleView = (post) => alert(`Reading post: "${post.title}"`);
    const handleEdit = (post) => alert(`Editing post: "${post.title}"`);
    const handleDelete = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setPosts(currentPosts => currentPosts.filter(p => p._id !== postId));
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-5xl font-extrabold text-[#c94f7c]">The Tech Post</h1>
                    <p className="text-gray-500 mt-2">Your daily dose of development news and insights.</p>
                </header>

                {loading ? (
                    <p className="text-center text-gray-500">Loading posts...</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                            <BlogCard
                                key={post._id}
                                post={post}
                                user={user}
                                onView={() => handleView(post)}
                                onEdit={() => handleEdit(post)}
                                onDelete={() => handleDelete(post._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}