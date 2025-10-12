import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, checkAuthStatus } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Login response is not valid JSON: ${jsonErr.message}`);
      }

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        if (typeof checkAuthStatus === "function") {
          await checkAuthStatus();
        }
        setTimeout(() => {
          if (
            data.user &&
            data.user.account_type === "admin" &&
            data.user.is_admin
          ) {
            navigate(data.redirect || "/admin/dashboard/dashboard-home");
          } else {
            setError("Not an admin account. Please use admin credentials.");
          }
        }, 200);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Admin Information */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white p-8 md:p-12">
            <div className="max-w-md mx-auto h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="bg-white/10 p-4 rounded-2xl inline-block mb-6 border border-white/20">
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold mb-4 text-white">Admin Portal</h2>
                <p className="text-slate-200 text-lg">
                  Secure access to Garissa Store administration
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4 text-white">Admin Controls</h3>
                  <ul className="space-y-3 text-slate-200">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Manage sellers & buyers accounts
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Monitor orders & transactions
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      View platform analytics
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Send system notifications
                    </li>
                  </ul>
                </div>

                {/* Platform Stats */}
                <div className="text-center">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">1.5K+</div>
                      <div className="text-slate-300">Users</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">50K+</div>
                      <div className="text-slate-300">Orders</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">99.9%</div>
                      <div className="text-slate-300">Uptime</div>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="font-bold mb-2 text-blue-300">Security Features</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-500/20 px-2 py-1 rounded text-blue-300 border border-blue-400/30">🔒 SSL Encrypted</span>
                    <span className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-300 border border-emerald-400/30">🛡️ 2FA Ready</span>
                    <span className="bg-slate-500/20 px-2 py-1 rounded text-slate-300 border border-slate-400/30">📊 Audit Logs</span>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 text-sm">System Status</span>
                    <span className="flex items-center text-emerald-400 text-sm">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      All Systems Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Admin Login</h1>
                <p className="text-slate-600 mt-2">Secure access to administration panel</p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                      placeholder="admin@garissastore.com"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                      placeholder="Enter your admin password"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-600">Remember this device</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </div>
                  ) : (
                    "ACCESS ADMIN DASHBOARD"
                  )}
                </button>

                <div className="text-center text-sm text-slate-600">
                  <p>
                    Not an admin?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/buyer-login")}
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Buyer Login
                    </button>
                    {" | "}
                    <button
                      type="button"
                      onClick={() => navigate("/seller-login")}
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Seller Login
                    </button>
                  </p>
                </div>
              </form>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-slate-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-slate-700">
                    <strong>Security Notice:</strong> This portal is for authorized personnel only. All activities are logged and monitored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;