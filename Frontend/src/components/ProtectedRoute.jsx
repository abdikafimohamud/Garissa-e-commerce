import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // If no user, redirect to the correct login page
  if (!user) {
    // if role is passed, redirect to that role's login
    if (role) {
      return <Navigate to={`/${role}-login`} replace />;
    }
    // fallback if no role specified
    return <Navigate to="/login" replace />;
  }

  // If role is required but doesn't match the logged-in user
  if (role && user.account_type !== role) {
    // redirect to the correct dashboard of the logged-in user
    return <Navigate to={`/${user.account_type}/dashboard-home`} replace />;
  }

  // Otherwise, render the requested page
  return children;
}
