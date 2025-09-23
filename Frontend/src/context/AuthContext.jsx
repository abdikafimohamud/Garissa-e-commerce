// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000"; // Flask backend

  // ✅ Check if there’s a valid Flask session on mount
  const checkAuthStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        credentials: "include", // <— send/receive cookies
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ✅ Login (buyer or seller)
  const login = async (email, password, accountType) => {
    try {
      const endpoint =
        accountType === "buyer" ? "/login/buyer" : "/login/seller";

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <— crucial
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, redirect: data.redirect, user: data.user };
      }
      return { success: false, message: data.error || "Login failed" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        setIsAuthenticated(false);
        return { success: true };
      }
      const data = await res.json();
      return { success: false, message: data.error || "Logout failed" };
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // Optional: refetch profile if needed later
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error("Profile fetch error:", err);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuthStatus,
        fetchCurrentUser,
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
