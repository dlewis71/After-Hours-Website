// LockedMessageBox.jsx
import React from "react";
import "./FriendZone.css";
import "./LockedMessageBox.css";

const LockedMessageBox = ({ title, message, onUnlock }) => {
  return (
    <div className="locked-box">
      <h3 className="locked-title">{title}</h3>
      <p className="locked-message">{message}</p>
      <button className="unlock-btn" onClick={onUnlock}>
        Unlock
      </button>
    </div>
  );
};

export default LockedMessageBox;
