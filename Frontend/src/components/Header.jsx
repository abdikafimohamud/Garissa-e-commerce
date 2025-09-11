import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaBars,
} from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

const Header = ({ cartItems = [], onToggleSidebar, userType = "buyer" }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth(); // added setUser for clearing context

  const handleLogout = async () => {
    try {
      // call backend to clear the Flask session cookie
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // send/clear cookie session
      });
      const result = await response.json();

      if (response.ok && result.success !== false) {
        // remove any stored auth info (token, user object, etc.)
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (logout) await logout();     // if logout() also does cleanup
        if (setUser) setUser(null);     // make sure context is empty

        setIsUserDropdownOpen(false);
        navigate("/login");
      } else {
        console.error("Logout failed:", result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Get user's display name with multiple fallbacks
  const getDisplayName = () => {
    if (!user) return "User";
    return user.firstname || user.name || user.username || "User";
  };

  return (
    <header className="bg-gradient-to-r from-red-500 to-yellow-500 shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left section: Logo and title */}
      <div className="flex items-center">
        {/* Sidebar toggle for mobile */}
        <button
          className="md:hidden mr-4 text-white"
          onClick={onToggleSidebar}
        >
          <FaBars className="text-xl" />
        </button>

        <Link to="/" className="flex items-center text-xl font-bold">
          <GiClothes className="text-white mr-2 text-2xl" />
          <span className="hidden sm:inline text-white">Garissa Store</span>
        </Link>

        <div className="ml-6 hidden md:block">
          <h1 className="text-lg font-semibold text-white">
            {userType === "seller"
              ? "Seller Dashboard"
              : userType === "admin"
              ? "Admin Dashboard"
              : "Dashboard"}
          </h1>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-6">
        {/* ✅ Welcome message always visible if user exists */}
        {user && (
          <div className="hidden md:block text-sm text-white">
            Welcome, {getDisplayName()}!
          </div>
        )}

        {/* Notification Icon */}
        <button className="relative p-2 text-white hover:text-gray-100 transition-colors">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Cart Icon - Buyers only */}
        {userType === "buyer" && (
          <Link
            to="/Buyers/cart"
            className="relative p-2 text-white hover:text-gray-100 transition-colors"
          >
            <FaShoppingCart className="text-xl" />
            {Array.isArray(cartItems) && cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
        )}

        {/* User Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <FaUserCircle className="text-2xl text-white" />
            <span className="hidden md:inline text-white font-medium">
              {getDisplayName()}
            </span>
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>

              <Link
                to={
                  userType === "seller"
                    ? "/seller/profile-settings"
                    : userType === "admin"
                    ? "/admin/profile"
                    : "/Buyers/Profilee"
                }
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <FaUser className="mr-2" />
                Profile
              </Link>

              <Link
                to={
                  userType === "seller"
                    ? "/seller/profile-settings"
                    : userType === "admin"
                    ? "/admin/settings"
                    : "/Buyers/settings"
                }
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <FaCog className="mr-2" />
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
