// ThemeProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create context
const ThemeContext = createContext();

// 2️⃣ Provider
export const ThemeProvider = ({ children }) => {
  const defaultTheme = {
    background: "#000000",
    text: "#ffffff",
    primary: "#c94f7c",
    accent: "#f8b195",
    cardBg: "#111111",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
  };

  // Initialize theme from localStorage or default
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved ? { ...defaultTheme, ...JSON.parse(saved) } : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // Apply theme to CSS variables and body
  useEffect(() => {
    const root = document.documentElement;

    Object.entries(theme).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`;
      root.style.setProperty(cssVar, value);
    });

    // Also apply basic global styles
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = theme.fontFamily;

    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  // Helper to update a single theme property
  const updateTheme = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3️⃣ Hook for consuming the context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
