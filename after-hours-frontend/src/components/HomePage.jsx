import React from "react";
import { useOutletContext } from "react-router-dom";
import { Showcase, About, Music, Movie, FriendZone, Profile, AuthProfile, ThemeCustomizer } from "./components";
import { useTrial } from "./hooks/useTrial";

export default function HomePage({ sections }) {
  const { user, handleLogin, setUser } = useOutletContext();
  const { trialActive } = useTrial();
  const isLocked = !user || !trialActive;

  return (
    <div className="container">
      <section ref={sections.home}><Showcase /></section>
      <section ref={sections.about}><About /></section>
      <section ref={sections.music}><Music user={user} locked={isLocked} /></section>
      <section ref={sections.movie}><Movie user={user} locked={isLocked} /></section>
      <section ref={sections.friendzone}><FriendZone user={user} locked={isLocked} /></section>

      <section ref={sections.profile} className="profile-theme-section">
        <div className="profile-wrapper">
          {user ? (
            <Profile key={user.id || user.name} user={user} setUser={setUser} />
          ) : (
            <AuthProfile onLogin={handleLogin} />
          )}
        </div>

        <div className="theme-wrapper">
          <ThemeCustomizer />
        </div>
      </section>
    </div>
  );
}
