import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogPage from "./components/blog/BlogPage";
import SinglePost from "./components/blog/SinglePost";
import NewPost from "./components/blog/NewPost";

function App() {
  const currentUser = {
    _id: "123",
    username: "Derrick",
    token: "fake-jwt-token",
    isSubscriberActive: true
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogPage user={currentUser} />} />
        <Route path="/new" element={<NewPost user={currentUser} />} />
        <Route path="/post/:slug" element={<SinglePost user={currentUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
