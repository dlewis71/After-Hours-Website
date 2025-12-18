import React, { useEffect, useRef, useState } from "react";
import "./About.css";

export default function About() {
  const aboutRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  const paragraphs = [
    <>
      Welcome to <strong>After Hours</strong>, your go-to social club for music, connections, and unforgettable experiences. Whether you're here to discover new sounds, meet like-minded people, or just unwind after a long day, we’ve created a space where creativity and friendship thrive.
    </>,
    <>
      Explore curated playlists, watch exclusive music videos, and chat with others in our <strong>Friend Zone</strong>. Our goal is simple: to bring people together in a fun, safe, and stylish environment.
    </>,
    <>
      Join the community and make the most of your <em>after hours</em> — because life is better with music, conversation, and a little bit of magic.
    </>
  ];

  return (
    <section
      id="about"
      className="section"
      ref={aboutRef}
      style={{
        // 1. CONTAINER: Center everything, but make it invisible
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        backgroundColor: "transparent",
        padding: "2rem 0",
        
        // 2. FORCE REMOVE OUTER BORDER (Overrides CSS class)
        border: "none",
        boxShadow: "none",
        outline: "none" 
      }}
    >
      <div 
        className="about-wrapper"
        style={{
          // 3. THE CARD: This remains visible
          width: "90%",
          maxWidth: "800px", 
          
          backgroundColor: "var(--background-color)", 
          border: "2px solid var(--accent-color)",    
          borderRadius: "12px",                       
          
          padding: "2.5rem",
          textAlign: "left",
          boxSizing: "border-box",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h2 
          className="about-heading" 
          style={{ 
            color: "var(--primary-color)", 
            marginBottom: "1.5rem",
            fontSize: "2rem",
            fontWeight: "800",
            textAlign: "center"
          }}
        >
          💖 About After Hours
        </h2>
        
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`fade-paragraph ${visible ? "visible" : ""}`}
            style={{
              transitionDelay: `${i * 0.3}s`,
              color: "var(--text-color)",
              marginBottom: "1rem",
              lineHeight: "1.6", 
              fontSize: "1.1rem"
            }}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}