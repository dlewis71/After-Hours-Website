// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Outlet, useNavigate, useLocation, useOutletContext } from "react-router-dom";

// Components
import Navbar from "./Navbar";
import Footer from "./Footer";
import Profile from "./Profile";
import AuthProfile from "./AuthProfile";
import ThemeCustomizer from "./ThemeCustomizer";
import Showcase from "./Showcase";
import About from "./About";
import Music from "./Music";
import Movie from "./Movie";
import FriendZone from "./FriendZone";
import BlogPage from "./blog/BlogPage";
import TrialCountdown from "./TrialCountdown";

// Contexts
import { SocketProvider } from "./SocketContext";
import { TrialProvider, useTrial } from "./TrialContext";
import { ThemeProvider, useTheme } from "../hooks/useTheme.jsx";

// --------------------------
// App Layout
// --------------------------
// --------------------------
// App Layout
// --------------------------
const AppLayout = ({ user, handleLogout, onNavClick, sections, handleLogin, setUser }) => {
  const location = useLocation();
  const topPadding = user ? "130px" : "80px";

  // We don't need to check "isBlogPage" for the timer anymore
  // because you want the timer ALWAYS visible at the top.

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} onNavClick={onNavClick} />
      
      {/* UPDATE: Show Trial Countdown on ALL pages (including Blog) if user is logged in */}
      {user && <TrialCountdown />}

      <main
        className="app-main"
        style={{
          paddingTop: topPadding,
          minHeight: "100vh",
          transition: "padding-top 0.3s ease",
        }}
      >
        <Outlet context={{ user, sections, handleLogin, setUser }} />
      </main>
      <Footer onNavClick={onNavClick} />
    </div>
  );
};

// --------------------------
// Home Page
// --------------------------
const HomePage = () => {
  const { user, sections, handleLogin, setUser } = useOutletContext();
  const { trialActive } = useTrial();
  const { theme } = useTheme();

  const isLocked = !user || !trialActive;

  return (
    <div className="container">
      <section ref={sections.home}><Showcase /></section>
      <section ref={sections.about}><About /></section>
      <section ref={sections.music}><Music user={user} locked={isLocked} theme={theme} /></section>
      <section ref={sections.movie}><Movie user={user} locked={isLocked} theme={theme} /></section>
      <section ref={sections.friendzone}><FriendZone user={user} locked={isLocked} theme={theme} /></section>

      {/* Profile + ThemeCustomizer */}
      <section 
        ref={sections.profile} 
        className="profile-theme-section"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          // REMOVED: alignItems: "flex-start" 
          // Default behavior is "stretch", which ensures equal height!
          
          gap: "2rem",
          padding: "4rem 1rem",
          minHeight: "60vh"
        }}
      >
        {/* Profile Wrapper */}
        <div 
          className="profile-wrapper"
          style={{ width: "100%", maxWidth: "600px" }} 
        >
          {user ? (
            <Profile key={user.id || user.name} user={user} setUser={setUser} />
          ) : (
            <AuthProfile onLogin={handleLogin} />
          )}
        </div>

        {/* Theme Wrapper */}
        <div 
          className="theme-wrapper"
          style={{ width: "100%", maxWidth: "600px" }} 
        >
          <ThemeCustomizer />
        </div>
      </section>
    </div>
  );
};

// --------------------------
// App Content
// --------------------------
const AppContent = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const sections = {
    home: useRef(null),
    about: useRef(null),
    music: useRef(null),
    movie: useRef(null),
    friendzone: useRef(null),
    profile: useRef(null),
  };

  const [pendingScroll, setPendingScroll] = useState(null);

  const scrollToSection = (id) => {
    const el = sections[id]?.current;
    if (!el) return;
    const navbarHeight = document.querySelector("nav.navbar")?.offsetHeight || 0;
    const timerHeight = document.querySelector(".trial-timer")?.offsetHeight || 0;
    
    // Add extra buffer so titles aren't hidden
    const extraBuffer = 30; 
    
    const offset = navbarHeight + timerHeight + extraBuffer; 

    const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementTop - offset, behavior: "smooth" });
  };

  const handleNavClick = (id) => {
    if (location.pathname !== "/") {
      setPendingScroll(id);
      navigate("/");
    } else {
      scrollToSection(id);
    }
  };

  useEffect(() => {
    if (pendingScroll && location.pathname === "/") {
      requestAnimationFrame(() => {
        scrollToSection(pendingScroll);
        setPendingScroll(null);
      });
    }
  }, [location, pendingScroll]);

  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [setUser]);

  useEffect(() => {
    if (!theme) return;
    const root = document.body;
    root.style.setProperty('--theme-font-size', theme.fontSize || '16px');
    root.style.setProperty('--theme-font-family', theme.fontFamily || 'Arial, sans-serif');
    root.style.setProperty('--theme-text-color', theme.text || '#333333');
    root.style.setProperty('--theme-primary-color', theme.primary || '#c94f7c');
    root.style.setProperty('--theme-accent-color', theme.accent || '#f8b195');
    root.style.setProperty('--theme-background-color', theme.background || '#fcefee');
  }, [theme]);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    localStorage.setItem("userProfile", JSON.stringify(loggedUser));
    setTimeout(() => scrollToSection("profile"), 100);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  return (
    <SocketProvider>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout
              user={user}
              handleLogout={handleLogout}
              onNavClick={handleNavClick}
              sections={sections}
              handleLogin={handleLogin}
              setUser={setUser}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/blog" element={<BlogPage user={user} />} />
        </Route>
      </Routes>
    </SocketProvider>
  );
};

// --------------------------
// Full App Wrapper
// --------------------------
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider>
      <TrialProvider user={user}>
        <AppContent user={user} setUser={setUser} />
      </TrialProvider>
    </ThemeProvider>
  );
}