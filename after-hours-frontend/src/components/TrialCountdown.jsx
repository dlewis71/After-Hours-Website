import React, { useEffect, useState } from "react";
import { useTrial } from "./TrialContext";

const TrialCountdown = () => {
  const { trialEnd, trialActive } = useTrial();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!trialEnd) return;

    const update = () => {
      const diff = trialEnd - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      setTimeLeft({
        days: Math.floor(totalSeconds / (3600 * 24)),
        hours: Math.floor((totalSeconds % (3600 * 24)) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [trialEnd]);

  return (
    <div style={{
      position: "sticky",
      top: "3.5rem",
      width: "100%",
      zIndex: 49,
      textAlign: "center",
      padding: "0.5rem 0",
      color: "var(--primary-color)",
      backgroundColor: "var(--background-color)",
      borderBottom: "1px solid var(--accent-color)"
    }}>
      {trialActive ? (
        <>⏱ Trial ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</>
      ) : (
        <>🔒 Trial expired — please subscribe to continue posting.</>
      )}
    </div>
  );
};

export default TrialCountdown;
