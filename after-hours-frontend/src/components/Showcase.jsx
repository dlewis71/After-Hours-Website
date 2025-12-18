import React from "react";
import { useTheme } from "../hooks/useTheme";

export default function Showcase() {
  const { theme } = useTheme();

  // Helper to remove '#' for the placeholder image service
  const stripHex = (color) => (color ? color.replace("#", "") : "000000");

  return (
    <section
      id="showcase"
      style={{
        // 1. Align everything to the LEFT (Start)
        display: "flex",
        justifyContent: "flex-start", // Changed from center
        alignItems: "center", 
        minHeight: "60vh",
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.fontFamily,
        padding: "2rem 4rem", // Added left/right padding so it's not glued to the edge
        transition: "all 0.3s ease"
      }}
    >
      <div 
        className="showcase-content"
        style={{
          width: "100%",
          maxWidth: "1000px",
          textAlign: "left", // Changed from center
        }}
      >
        {/* Main Title */}
        <h1
          style={{
            color: theme.primary,
            fontFamily: theme.fontFamily,
            fontSize: "3.5rem",
            marginBottom: "1rem",
            fontWeight: "800"
          }}
        >
          After Hours
        </h1>

        {/* Banner Image */}
        <img
          src={`https://placehold.co/1000x300/${stripHex(theme.accent)}/${stripHex(theme.text)}?text=Featured+Artist`}
          alt="Featured banner"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "12px",
            border: `3px solid ${theme.accent}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            marginBottom: "2rem",
            marginTop: "1rem",
            display: "block", // Ensures it respects text-align left
            marginLeft: "0"   // Forces it to the left
          }}
        />

        {/* Tagline */}
        <h3
          style={{
            fontFamily: theme.fontFamily,
            fontSize: "1.75rem",
            marginBottom: "1rem",
            color: theme.text,
            fontWeight: "600"
          }}
        >
          Where your music and movies take center stage.
        </h3>

        {/* Lead Paragraph */}
        <p
          style={{
            fontSize: "1.1rem",
            fontFamily: theme.fontFamily,
            maxWidth: "800px",
            lineHeight: "1.6",
            opacity: 0.9,
            marginLeft: "0" // Ensures text starts at the left
          }}
        >
          After Hours is the best way to enjoy the music you have, shop for the
          songs you want, and converse with people who want to have fun with no
          attachments.
        </p>
      </div>
    </section>
  );
}