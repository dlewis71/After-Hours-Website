// src/TrialContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const TrialContext = createContext();
export const useTrial = () => useContext(TrialContext);

export const TrialProvider = ({ children, user }) => {
  const [trialActive, setTrialActive] = useState(false);
  const [trialEnd, setTrialEnd] = useState(null);

  // Update trial state whenever user changes
  useEffect(() => {
    if (!user || !user.trialEnd) {
      setTrialActive(false);
      setTrialEnd(null);
      return;
    }

    const endDate = new Date(user.trialEnd);
    setTrialEnd(endDate);
    setTrialActive(endDate > new Date());
  }, [user]);

  // Auto-expire trial every second
  useEffect(() => {
    if (!trialEnd) return;
    const interval = setInterval(() => {
      setTrialActive(trialEnd > new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [trialEnd]);

  return (
    <TrialContext.Provider value={{ trialActive, trialEnd }}>
      {children}
    </TrialContext.Provider>
  );
};
