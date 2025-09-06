import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000";

  // ✅ Fetch current user when app loads
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log("Fetching current user from backend...");
        const res = await fetch(`${API_URL}/get_current_user`, {
          method: "GET",
          credentials: "include", // important for session cookie
        });

        console.log("Response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("User data received:", data);
          
          if (data.user) {
            setUser(data.user);
          } else {
            console.log("No user object in response");
            setUser(null);
          }
        } else if (res.status === 401) {
          // 401 is normal when no user is logged in
          console.log("User is not authenticated (normal behavior)");
          setUser(null);
        } else {
          console.log("Unexpected error status:", res.status);
          setUser(null);
        }
      } catch (err) {
        console.error("Network error fetching current user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // ✅ Login
  const login = async (email, password, accountType) => {
    if (!email || !password)
      return { success: false, message: "Enter both email and password" };

    try {
      const endpoint = accountType === 'seller' ? '/login/seller' : '/login/buyer';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        return { success: true, redirect: data.redirect, user: data.user };
      } else {
        return { success: false, message: data.error || "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // ✅ Register
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        // After registration, try to automatically log the user in
        const loginResult = await login(userData.email, userData.password, userData.accountType || 'buyer');
        if (loginResult.success) {
          return { success: true, redirect: data.redirect || "/" };
        }
        return { success: true, redirect: data.redirect || "/login", message: "Registration successful. Please login." };
      } else {
        return {
          success: false,
          message: data.error || "Registration failed",
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
        const data = await res.json();
        return { success: false, message: data.error || "Logout failed" };
      }
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // ✅ Manual user setter (for testing/development)
  const setUserData = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      setUser: setUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};