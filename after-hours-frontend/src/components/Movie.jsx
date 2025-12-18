import React, { forwardRef, useState } from "react";
import LockedMessageBox from "./LockedMessageBox.jsx";
import { useTheme } from "../hooks/useTheme.jsx";

const Movie = forwardRef(({ locked }, ref) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState(null);

  const stripHex = (color) => (color ? color.replace("#", "") : "000000");

  const categories = [
    { name: "Action", link: "https://tubitv.com/category/action" },
    { name: "Comedy", link: "https://tubitv.com/category/comedy" },
    { name: "Horror", link: "https://tubitv.com/category/horror" },
    { name: "Romance", link: "https://tubitv.com/category/romance" },
  ];

  const handleCategoryClick = (link) => {
    if (locked) {
      setMessage("🔒 Subscribe to browse this category.");
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={ref}
      className="movie-container"
      style={{
        width: "100%",
        minHeight: "60vh", // Reduced from 80vh so the section isn't forced to be huge
        padding: "0",
        backgroundColor: theme.background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.fontFamily,
        transition: "background-color 0.3s ease",
      }}
    >
      <section
        style={{
          width: "95%",
          maxWidth: "1000px", // Reduced from 1200px to keep content tighter
          padding: "2rem",
          textAlign: "center",
          backgroundColor: theme.background,
          color: theme.text,
          fontFamily: theme.fontFamily,
        }}
      >
        <h2
          style={{
            color: theme.primary,
            fontSize: "1.75rem", // Reduced from 2rem
            marginBottom: "1rem", // Tightened spacing
            fontFamily: theme.fontFamily,
          }}
        >
          🍿 Featured Movies
        </h2>

        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          {/* CHANGED DIMENSIONS HERE: 1200x300 makes it a slim banner */}
          <img
            src={`https://placehold.co/1200x300/${stripHex(theme.accent)}/${stripHex(theme.text)}?text=Featured+Movie`}
            alt="Featured Movie"
            style={{
              width: "100%",
              borderRadius: "12px",
              border: `3px solid ${theme.accent}`, // Slightly thinner border
              objectFit: "cover",
              maxHeight: "300px" // Ensures it never grows taller than this
            }}
          />
          {locked && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem", // Smaller lock text
                fontWeight: 600,
                cursor: "not-allowed",
                color: "#ffffff",
                fontFamily: theme.fontFamily,
                borderRadius: "12px" // Matches the image corners
              }}
            >
              🔒 Subscribe to interact
            </div>
          )}
        </div>

        {/* Buttons Container */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.8rem", // Slightly tighter gap
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.link)}
              disabled={locked}
              className="movie-category-btn"
              style={{
                backgroundColor: theme.primary,
                color: theme.text,
                fontSize: theme.fontSize,
                fontFamily: theme.fontFamily,
                // Add padding here if you want to control button bulkiness
                padding: "8px 16px" 
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {message && (
          <LockedMessageBox message={message} onUnlock={() => setMessage(null)} />
        )}
      </section>
    </div>
  );
});

export default Movie;