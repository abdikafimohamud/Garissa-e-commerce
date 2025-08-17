import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch current user when app loads
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/get_current_user", {
          method: "GET",
          credentials: "include", // important for session cookie
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
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
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, message: error.message || "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // ✅ Register
  const register = async (name, email, password) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
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
        return { success: false, message: error.message || "Registration failed" };
      }
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/logout", {
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
