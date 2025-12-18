import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

// 1. Define Defaults matching your Component's needs
const defaultTheme = {
  fontSize: "16px",
  fontFamily: "'Sofia', cursive",
  text: "#333333",        // Matches 'text' in your component
  primary: "#c94f7c",
  accent: "#f8b195",
  background: "#fcefee"
};

export const ThemeProvider = ({ children }) => {
  // 2. Safe Initialization (Crash Proof)
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const saved = localStorage.getItem("app_theme");
      if (saved) {
        // Merge saved data with defaults to fill missing keys
        return { ...defaultTheme, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Theme data corrupted, resetting.", error);
      localStorage.removeItem("app_theme");
    }
    return defaultTheme;
  });

  // 3. Apply Styles to CSS Variables
  useEffect(() => {
    const root = document.documentElement;

    // Map State Keys to CSS Variables
    root.style.setProperty("--font-size", theme.fontSize);
    root.style.setProperty("--font-family", theme.fontFamily);
    root.style.setProperty("--text-color", theme.text);
    root.style.setProperty("--primary-color", theme.primary);
    root.style.setProperty("--accent-color", theme.accent);
    root.style.setProperty("--background-light", theme.background);
    root.style.setProperty("--background-color", theme.background); // Fallback

    // Save to LocalStorage
    localStorage.setItem("app_theme", JSON.stringify(theme));
  }, [theme]);

  // 4. Helper Function: updateTheme
  // This allows updating a single key, e.g., updateTheme('fontSize', '18px')
  const updateTheme = (key, value) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};