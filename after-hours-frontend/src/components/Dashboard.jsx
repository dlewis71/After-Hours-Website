import React from "react";
import ThemeCustomizer from "./ThemeCustomizer.jsx";
import Profile from "./Profile.jsx";

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-flex">
      <Profile user={user} />
      <ThemeCustomizer />
    </div>
  );
};

export default Dashboard;