import React, { forwardRef, useRef, useState, useEffect } from "react";
import LockedMessageBox from "./LockedMessageBox.jsx";
import { useTheme } from "../hooks/useTheme.jsx";

const Music = forwardRef(({ locked }, ref) => {
  const iframeRef = useRef(null);
  const [message, setMessage] = useState(null);
  
  // 1. GET THEME VALUES
  const { theme } = useTheme();

  // Force re-render on theme change
  const [, setRender] = useState(0);
  useEffect(() => setRender((r) => r + 1), [theme]);

  const postPlayerCommand = (command) => {
    if (locked) {
      setMessage("🔒 Subscribe to use the player controls.");
      return false;
    }
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.contentWindow.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        "*"
      );
    }
    return true;
  };

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        minHeight: "60vh", 
        padding: 0,
        // 2. DYNAMIC BACKGROUND
        backgroundColor: theme.background, 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // 3. DYNAMIC FONT
        fontFamily: theme.fontFamily, 
        transition: "background-color 0.3s ease",
      }}
    >
      <section
        style={{
          width: "95%",
          maxWidth: "1000px", 
          padding: "2rem",
          textAlign: "center",
          backgroundColor: theme.background, // Ensures inner section matches
          color: theme.text,
          fontFamily: theme.fontFamily,
          position: "relative"
        }}
      >
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
              zIndex: 10,
              fontSize: "1.25rem",
              fontWeight: 600,
              cursor: "not-allowed",
              color: "#ffffff",
              borderRadius: "12px",
            }}
          >
            🔒 Subscribe to use player
          </div>
        )}

        <h2
          style={{
            // 4. PRIMARY COLOR FOR TITLE
            color: theme.primary, 
            fontSize: "1.75rem", 
            marginBottom: "1rem", 
            fontFamily: theme.fontFamily,
          }}
        >
          🎵 Featured Music
        </h2>

        <iframe
          ref={iframeRef}
          src="https://www.youtube.com/embed/videoseries?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI&enablejsapi=1"
          title="Music Playlist"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            width: "100%",
            height: "350px", 
            borderRadius: "12px",
            // 5. ACCENT COLOR FOR BORDER
            border: `3px solid ${theme.accent}`, 
            marginBottom: "1.5rem",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.8rem", 
          }}
        >
          {["playVideo", "pauseVideo", "stopVideo"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => postPlayerCommand(cmd)}
              disabled={locked}
              style={{
                padding: "0.5rem 1.2rem", 
                borderRadius: "12px",
                fontWeight: 600,
                cursor: locked ? "not-allowed" : "pointer",
                
                // 6. PRIMARY COLOR FOR BUTTONS
                backgroundColor: theme.primary, 
                color: theme.text, 
                
                border: "none",
                fontSize: "1rem",
                fontFamily: theme.fontFamily,
                transition: "all 0.2s ease"
              }}
            >
              {cmd === "playVideo"
                ? "▶ Play"
                : cmd === "pauseVideo"
                ? "⏸ Pause"
                : "⏹ Stop"}
            </button>
          ))}
        </div>

        {message && (
          <LockedMessageBox text={message} onClose={() => setMessage(null)} />
        )}
      </section>
    </div>
  );
});

export default Music;