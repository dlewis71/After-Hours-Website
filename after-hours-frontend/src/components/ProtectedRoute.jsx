import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, children }) {
  const location = useLocation();

  // Log the user prop to the developer console to see what's being passed in.
  console.log("ProtectedRoute user:", user);

  if (!user) {
    // If a user is not logged in, redirect them to the home page.
    // We pass the current location in the state so we can redirect them
    // back to the page they were trying to access after they log in.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the component they were trying to access.
  return children;
}