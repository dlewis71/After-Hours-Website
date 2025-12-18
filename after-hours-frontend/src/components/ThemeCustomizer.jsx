import React, { forwardRef } from "react";
import { useTheme } from "../hooks/useTheme";
import "./ThemeCustomizer.css";

const ThemeCustomizer = forwardRef((props, ref) => {
  const { theme, updateTheme, setTheme } = useTheme();

  // Helper function to calculate a readable text color based on background
  const getReadableTextColor = (bg) => {
    const hex = bg.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? "#333333" : "#ffffff";
  };

  // Background color change handler
  const changeBackground = (bg) => {
    const text = theme.text || getReadableTextColor(bg);
    setTheme((prev) => ({ ...prev, background: bg, text }));
  };

  const backgroundOptions = [
    { bg: "#F5F5F5", label: "Light" },
    { bg: "#7FFFD4", label: "Dim" },
    { bg: "#0D1A4C", label: "Dark" },
    { bg: "#000000", label: "Black" },
  ];

  const colorsText = ["#32F35A", "#3A7BFF", "#FF4F9A", "#FF7A3D", "#A45CFF"];
  const colorsPrimary = ["#0E7A45", "#2B2C7C", "#D11378", "#B84412", "#6E22C7"];
  const colorsAccent = ["#7CFF91", "#66C3FF", "#FF9AD6", "#FFB35C", "#C49AFF"];

  // Standard JS Style Objects (No Tailwind classes here)
  const sectionStyle = { marginBottom: "1rem" };
  const headerStyle = { 
    marginBottom: "0.5rem", 
    fontWeight: "bold", 
    color: theme.primary,
    fontSize: "0.95rem" 
  };
  const containerStyle = { display: "flex", flexWrap: "wrap", gap: "8px" }; 

  return (
    <section
      ref={ref}
      className="customize-theme theme-profile-widget"
      style={{
        border: `2px solid ${theme.accent}`,
        borderRadius: "12px",
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.fontFamily,
        
        // Layout Controls
        maxWidth: "600px",
        width: "100%",
        height: "100%", // Ensures it stretches to match Profile height
        
        padding: "1.5rem", 
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h2 style={{ 
        marginBottom: "1.5rem", 
        color: theme.primary, 
        borderBottom: `1px solid ${theme.accent}`, 
        paddingBottom: "8px",
        fontSize: "1.5rem", 
        marginTop: 0
      }}>
        Customize Your View
      </h2>

      {/* Font Size Selector */}
      <div className="theme-option" style={sectionStyle}>
        <h4 style={headerStyle}>Font Size</h4>
        <div className="choose-size tp-container" style={containerStyle}>
          {["12px", "14px", "16px", "18px", "20px"].map((size) => (
            <span
              key={size}
              className={theme.fontSize === size ? "active" : ""}
              onClick={() => updateTheme("fontSize", size)}
              style={{ 
                padding: "4px 10px", 
                cursor: "pointer", 
                border: `1px solid ${theme.accent}`, 
                borderRadius: "6px",
                fontSize: "0.9rem"
              }}
            >
              {size}
            </span>
          ))}
        </div>
      </div>

      {/* Font Family Selector */}
      <div className="theme-option" style={sectionStyle}>
        <h4 style={headerStyle}>Font Style</h4>
        <select
          value={theme.fontFamily}
          onChange={(e) => updateTheme("fontFamily", e.target.value)}
          className="font-select"
          style={{
            width: "100%",
            padding: "6px", 
            borderRadius: "6px",
            border: `2px solid ${theme.accent}`,
            backgroundColor: theme.background,
            color: theme.text,
            fontFamily: theme.fontFamily,
            fontSize: "0.9rem"
          }}
        >
          <option value="'Sofia', cursive">Sofia</option>
          <option value="'Arial', sans-serif">Arial</option>
          <option value="'Pacifico', cursive">Pacifico</option>
          <option value="'Comic Neue', cursive">Comic Fun</option>
          <option value="'Indie Flower', cursive">Handwritten</option>
          <option value="'Press Start 2P', monospace">Pixel Arcade</option>
          <option value="'Luckiest Guy', cursive">Luckiest Guy</option>
        </select>
      </div>

      {/* Text Color Selector */}
      <div className="theme-option" style={sectionStyle}>
        <h4 style={headerStyle}>Font Color</h4>
        <div className="choose-color tp-container" style={containerStyle}>
          {colorsText.map((c) => (
            <span
              key={c}
              className={`color-circle ${theme.text === c ? "active" : ""}`}
              style={{ 
                backgroundColor: c, 
                width: "28px", 
                height: "28px", 
                borderRadius: "50%", 
                cursor: "pointer", 
                border: theme.text === c ? `3px solid ${theme.primary}` : "2px solid transparent",
                transform: theme.text === c ? "scale(1.1)" : "scale(1)"
              }}
              onClick={() => updateTheme("text", c)}
            />
          ))}
        </div>
      </div>

      {/* Primary Color Selector */}
      <div className="theme-option" style={sectionStyle}>
        <h4 style={headerStyle}>Primary Color</h4>
        <div className="choose-color tp-container" style={containerStyle}>
          {colorsPrimary.map((c) => (
            <span
              key={c}
              className={`color-circle ${theme.primary === c ? "active" : ""}`}
              style={{ 
                backgroundColor: c, 
                width: "28px", 
                height: "28px", 
                borderRadius: "50%", 
                cursor: "pointer", 
                border: theme.primary === c ? `3px solid ${theme.text}` : "2px solid transparent",
                transform: theme.primary === c ? "scale(1.1)" : "scale(1)"
              }}
              onClick={() => updateTheme("primary", c)}
            />
          ))}
        </div>
      </div>

      {/* Accent Color Selector */}
      <div className="theme-option" style={sectionStyle}>
        <h4 style={headerStyle}>Accent Color</h4>
        <div className="choose-color tp-container" style={containerStyle}>
          {colorsAccent.map((c) => (
            <span
              key={c}
              className={`color-circle ${theme.accent === c ? "active" : ""}`}
              style={{ 
                backgroundColor: c, 
                width: "28px", 
                height: "28px", 
                borderRadius: "50%", 
                cursor: "pointer", 
                border: theme.accent === c ? `3px solid ${theme.text}` : "2px solid transparent",
                transform: theme.accent === c ? "scale(1.1)" : "scale(1)"
              }}
              onClick={() => updateTheme("accent", c)}
            />
          ))}
        </div>
      </div>

      {/* Background Selector */}
      <div className="theme-option" style={sectionStyle}>
        <h4 style={headerStyle}>Background</h4>
        <div className="choose-bg tp-container" style={containerStyle}>
          {backgroundOptions.map((b) => (
            <span
              key={b.bg}
              className={`bg-option ${theme.background === b.bg ? "active" : ""}`}
              style={{
                backgroundColor: b.bg,
                color: b.bg === "#000000" || b.bg === "#0D1A4C" ? "#fff" : "#333",
                padding: "6px 12px", 
                borderRadius: "6px",
                fontSize: "0.85rem",
                cursor: "pointer",
                border: theme.background === b.bg ? `2px solid ${theme.primary}` : "1px solid #ccc",
                fontWeight: "bold"
              }}
              onClick={() => changeBackground(b.bg)}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ThemeCustomizer;