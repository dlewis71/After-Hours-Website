import React from "react";
import "./Footer.css"; 

export default function Footer({ onNavClick }) {
  const sections = ["home", "about", "music", "movie", "friendzone", "profile", "blog"];

  // Updated helper function to handle special cases like "FriendZone"
  const getLabel = (s) => {
    if (s === "friendzone") return "Friend Zone";
    // Default capitalization for everything else
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <footer className="footer">
      <div className="footer-links flex flex-wrap justify-center gap-4 mb-4">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => onNavClick(s)}
            className="footer-link px-3 py-1 text-sm font-semibold rounded"
          >
            {/* Use the new helper function here */}
            {getLabel(s)}
          </button>
        ))}
      </div>
      <p className="footer-text">
        © 2025 After Hours. All rights reserved.
      </p>
    </footer>
  );
}