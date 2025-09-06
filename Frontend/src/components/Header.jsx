import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaBars,
  FaShoppingBag
} from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

const Header = ({ 
  cartItems = [], 
  onToggleSidebar,
  userType = "buyer"
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  // Debug: Log user data to see what's available
  useEffect(() => {
    console.log("User data from AuthContext:", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        setIsUserDropdownOpen(false);
        navigate("/");
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Get user's display name with multiple fallbacks
  const getDisplayName = () => {
    if (!user) return "User";
    
    // Try different possible field names
    return user.firstname || user.name || user.username || "User";
  };

  // Show loading state while fetching user data
  if (loading) {
    return (
      <header className="bg-gradient-to-r from-red-500 to-yellow-500 shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button className="md:hidden mr-4 text-white">
            <FaBars className="text-xl" />
          </button>
          <div className="flex items-center text-xl font-bold">
            <GiClothes className="text-white mr-2 text-2xl" />
            <span className="hidden sm:inline text-white">Garissa Store</span>
          </div>
        </div>
        <div className="animate-pulse bg-white bg-opacity-30 h-8 w-32 rounded"></div>
      </header>
    );
  }

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
            {userType === "seller" ? "Seller Dashboard" : 
             userType === "admin" ? "Admin Dashboard" : "Dashboard"}
          </h1>
        </div>
      </div>

      {/* Right section: Icons and user menu */}
      <div className="flex items-center gap-4">
        {/* Welcome message - Show for all user types */}
        <div className="hidden md:block text-sm text-white">
          Welcome, {getDisplayName()}!
        </div>

        {/* Notification Icon - Show for all user types */}
        <button className="relative p-2 text-white hover:text-gray-100 transition-colors">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Cart Icon - Show for buyers only */}
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
                  userType === "seller" ? "/seller/profile-settings" : 
                  userType === "admin" ? "/admin/profile" : "/Buyers/Profilee"
                }
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <FaUser className="mr-2" />
                Profile
              </Link>
              
              <Link
                to={
                  userType === "seller" ? "/seller/profile-settings" : 
                  userType === "admin" ? "/admin/settings" : "/Buyers/settings"
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