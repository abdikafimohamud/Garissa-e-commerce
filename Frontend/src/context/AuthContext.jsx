import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000"; // ✅ Single base URL

  // ✅ Fetch current user when app loads
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_URL}/get_current_user`, {
          method: "GET",
          credentials: "include", // important for session cookie
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    if (!email || !password)
      return { success: false, message: "Enter both email and password" };

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.error || "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // ✅ Register
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return { success: true };
      } else {
        const error = await res.json();
        return {
          success: false,
          message: error.message || "Registration failed",
        };
      }
    } catch (err) {
      console.error("Register error:", err);
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
        return { success: true };
      } else {
        return { success: false, message: "Logout failed" };
      }
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, message: "Network error" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
