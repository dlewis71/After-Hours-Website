import React, { useState, useEffect } from "react";

// --- MOCK DATA & API SIMULATION ---
// In a real app, this data would come from a backend API.
const mockPosts = [
    {
        _id: 'post1',
        title: 'Exploring the Mountains',
        content: 'There is nothing quite like the fresh air and stunning views from a mountain peak. Our latest trip took us to the Rockies, where we witnessed breathtaking sunrises and challenging trails...',
        author: { _id: 'user1', username: 'Alex' },
        createdAt: '2025-10-15T14:48:00.000Z',
    },
    {
        _id: 'post2',
        title: 'The Art of Minimalist Design',
        content: 'Minimalism is not about what you lack, but about making room for what truly matters. This principle applies beautifully to web design, creating clean, intuitive, and fast user experiences...',
        author: { _id: 'user2', username: 'Brianna' },
        createdAt: '2025-10-14T11:20:00.000Z',
    },
    {
        _id: 'post3',
        title: 'A Culinary Journey Through Italy',
        content: 'From the rich pastas of Rome to the fresh seafood of Sicily, our two-week journey was a feast for the senses. We discovered that the secret ingredient is always simplicity and fresh, local produce.',
        author: { _id: 'user2', username: 'Brianna' },
        createdAt: '2025-10-12T09:05:00.000Z',
    },
     {
        _id: 'post4',
        title: 'Getting Started with React Hooks',
        content: 'useState, useEffect, useContext... The world of React Hooks can be daunting at first, but they unlock powerful ways to manage state and side effects in your functional components.',
        author: { _id: 'user1', username: 'Alex' },
        createdAt: '2025-10-11T18:30:00.000Z',
    },
];

// Mock user object. In a real app, this would come from an authentication context.
const mockUser = { _id: 'user1', username: 'Alex' };

// --- PRESENTATIONAL COMPONENTS ---

/**
 * A skeleton loader component to show while content is fetching.
 */
const BlogCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="h-40 bg-gray-300"></div>
        <div className="p-6">
            <div className="h-6 w-3/4 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded mt-2"></div>
        </div>
    </div>
);


/**
 * Renders a single blog post in a card format.
 * This is a presentational component that receives all data and handlers via props.
 */
const BlogCard = ({ post, user, onView, onEdit, onDelete }) => {
    // Check if the current user is the author of the post
    const isAuthor = user && user._id === post.author?._id;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
            {/* Card Image Placeholder */}
            <div className="h-40 bg-pink-100 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#c94f7c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                    <p className="text-sm font-semibold text-[#f8b195] uppercase tracking-wide">
                        {post.author?.username || 'Anonymous'}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">{post.title}</h3>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-3 flex-grow">
                        {post.content}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                     <button onClick={onView} className="text-sm font-semibold text-[#c94f7c] hover:underline">
                        Read More
                    </button>
                    {/* Show Edit/Delete buttons only if the user is the author */}
                    {isAuthor && (
                        <div className="flex space-x-3">
                            <button onClick={onEdit} className="text-gray-400 hover:text-blue-500" title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={onDelete} className="text-gray-400 hover:text-red-500" title="Delete">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Renders the main blog list container, managing the grid layout and header.
 */
const BlogList = ({ posts, user, onNewPost, onPostSelect, onPostEdit, onPostDelete, loading }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-5xl font-extrabold text-[#c94f7c] text-center sm:text-left">
                    After Hours Blog
                </h1>
                {user && (
                    <button
                        onClick={onNewPost}
                        className="px-6 py-3 bg-[#c94f7c] text-white font-bold rounded-lg shadow-md hover:bg-[#f8b195] hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                    >
                        + New Post
                    </button>
                )}
            </header>

            {loading ? (
                 <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Render 4 skeleton loaders */}
                    {[...Array(4)].map((_, i) => <BlogCardSkeleton key={i} />)}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                     <p className="text-gray-500 text-lg">
                        No posts yet. Be the first to write one!
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {posts.map((post) => (
                        <BlogCard
                            key={post._id}
                            post={post}
                            user={user}
                            onView={() => onPostSelect(post)}
                            onEdit={() => onPostEdit(post)}
                            onDelete={() => onPostDelete(post._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


// --- CONTAINER COMPONENT ---
/**
 * Manages state and logic for the blog page.
 * It fetches data and passes it down to presentational components.
 */
export default function BlogListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Simulate fetching data on component mount
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            try {
                // Simulate a successful API call
                setPosts(mockPosts);
                setUser(mockUser); // Set the logged-in user
                setError(null);
            } catch (err) {
                // Simulate an error
                setError("Failed to fetch blog posts.");
            } finally {
                setLoading(false);
            }
        }, 1500); // Simulate a 1.5-second network delay

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    // --- Action Handlers ---
    // These functions would typically make API calls to a backend.
    
    const handleNewPost = () => {
        alert("Opening editor for a new post...");
        // In a real app, this would likely navigate to a new page or open a modal editor.
    };
    
    const handlePostSelect = (post) => {
        alert(`Viewing post: "${post.title}"`);
        // In a real app, this would navigate to a detailed view of the post.
    };

    const handlePostEdit = (post) => {
        alert(`Editing post: "${post.title}"`);
    };

    const handlePostDelete = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
            alert("Post deleted successfully.");
        }
    };
    
    if (error) {
        return <div className="text-center text-red-500 font-bold mt-20">{error}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <BlogList
                posts={posts}
                user={user}
                loading={loading}
                onNewPost={handleNewPost}
                onPostSelect={handlePostSelect}
                onPostEdit={handlePostEdit}
                onPostDelete={handlePostDelete}
            />
        </div>
    );
}