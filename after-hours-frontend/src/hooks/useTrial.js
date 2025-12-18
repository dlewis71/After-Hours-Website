import { useState, useEffect } from "react";

// --- Default trial length in days ---
const DEFAULT_TRIAL_DAYS = 3;

const useTrial = () => {
  const [trialEnd, setTrialEnd] = useState(null);
  const [trialActive, setTrialActive] = useState(false);

  // Start a new trial
  const startTrial = (days = DEFAULT_TRIAL_DAYS) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    setTrialEnd(endDate.toISOString());
    setTrialActive(true);
    localStorage.setItem("trialEnd", endDate.toISOString());
  };

  // Resume a trial from existing end date
  const resumeTrial = (end) => {
    setTrialEnd(end);
    const isActive = new Date(end) > new Date();
    setTrialActive(isActive);
  };

  // Clear trial (on logout)
  const clearTrial = () => {
    setTrialEnd(null);
    setTrialActive(false);
    localStorage.removeItem("trialEnd");
  };

  // Check if trial is active whenever trialEnd changes
  useEffect(() => {
    const savedEnd = trialEnd || localStorage.getItem("trialEnd");
    if (savedEnd) {
      const isActive = new Date(savedEnd) > new Date();
      setTrialEnd(savedEnd);
      setTrialActive(isActive);
    }
  }, [trialEnd]);

  return { trialEnd, trialActive, startTrial, resumeTrial, clearTrial };
};

export default useTrial;
