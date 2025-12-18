import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout, onNavClick }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  const [theme, setTheme] = useState({
    primary: "#c94f7c",
    text: "#333",
    background: "#fcefee",
  });

  // Watch CSS variables for theme
  useEffect(() => {
    const updateTheme = () => {
      const root = getComputedStyle(document.documentElement);
      setTheme({
        primary: root.getPropertyValue("--primary-color") || "#c94f7c",
        text: root.getPropertyValue("--text-color") || "#333",
        background: root.getPropertyValue("--background-color") || "#fcefee",
      });
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

  const sections = ["home", "about", "music", "movie", "friendzone", "profile"];
  const extraButtons = ["blog", "auth"];
  const allButtons = [...sections, ...extraButtons];

  return (
    <nav className="navbar" style={{ backgroundColor: theme.background, color: theme.text }}>
      {allButtons.map((section) => {
        let label = section.charAt(0).toUpperCase() + section.slice(1);
        if (section === "blog") label = "Blog";
        if (section === "auth") label = user ? "Logout" : "Login";
        if (section === "friendzone") label = "Friend Zone";

        const handleClick = () => {
          setActive(section);

          if (section === "blog") {
            navigate("/blog");
          } else if (section === "auth") {
            if (user) onLogout(); // logout first if logged in
            navigate("/");         // go home
            setTimeout(() => onNavClick("profile"), 50); // scroll to profile/login
          } else {
            onNavClick(section); // scroll to section
          }
        };

        return (
          <button
            key={section}
            onClick={handleClick}
            className={`nav-button ${active === section ? "active" : ""}`}
            style={{
              backgroundColor: active === section ? theme.primary : "transparent",
              color: active === section ? "#fff" : theme.text,
              border: `2px solid ${theme.primary}`,
            }}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
