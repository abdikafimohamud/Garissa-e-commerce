import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000";

  // 🔍 Check authentication status via Flask session
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        credentials: "include", // ✅ send cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          return true;
        }
      }
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 👤 Fetch current user profile
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (err) {
      console.error("Network error fetching current user:", err);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // 🚀 Run once on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ✅ Login - Updated to use the correct endpoint based on account type
  const login = async (email, password, accountType) => {
    if (!email || !password) {
      return { success: false, message: "Enter both email and password" };
    }

    try {
      // Use the specific endpoint for buyer or seller login
      const endpoint = accountType === 'buyer' ? '/login/buyer' : '/login/seller';
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      // Check if response is OK before trying to parse JSON
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, redirect: data.redirect, user: data.user };
      } else {
        // Handle different HTTP error statuses
        if (res.status === 401) {
          const data = await res.json();
          return { success: false, message: data.error || "Invalid credentials" };
        } else {
          return { success: false, message: `Server error: ${res.status}` };
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error. Check if the server is running." };
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
      } else {
        const data = await res.json();
        return { success: false, message: data.error || "Logout failed" };
      }
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, message: "Network error" };
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
        fetchCurrentUser,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);