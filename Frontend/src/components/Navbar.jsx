import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTshirt,
  FaShoppingCart,
  FaInfoCircle,
  FaUser,
  FaSignInAlt,
  FaStore,
  FaTag,
  FaPhone,
  FaBlog,
  FaShippingFast,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog
} from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { useState, useEffect } from "react";

const Navbar = ({ cartItems = [], authStateChanged }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on component mount and when authStateChanged prop changes
  useEffect(() => {
    checkAuthStatus();
  }, [authStateChanged]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_current_user", {
        method: "GET",
        credentials: "include", // Important for sessions/cookies
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserData(data.user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUserData(null);
        setIsUserDropdownOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-red-500 to-yellow-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold flex items-center text-black drop-shadow-lg">
          <GiClothes className="mr-2" />
          <span>Garissa Store</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {isLoggedIn ? (
            <LoggedInNavLinks 
              userData={userData} 
              cartItems={cartItems} 
              isUserDropdownOpen={isUserDropdownOpen}
              setIsUserDropdownOpen={setIsUserDropdownOpen}
              handleLogout={handleLogout}
            />
          ) : (
            <LoggedOutNavLinks cartItems={cartItems} />
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-red-500 to-yellow-500 p-4 shadow-lg z-50">
            <div className="flex flex-col gap-4">
              {isLoggedIn ? (
                <MobileLoggedInNavLinks 
                  userData={userData} 
                  cartItems={cartItems} 
                  closeMenu={() => setIsMenuOpen(false)}
                  handleLogout={handleLogout}
                />
              ) : (
                <MobileLoggedOutNavLinks 
                  cartItems={cartItems} 
                  closeMenu={() => setIsMenuOpen(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop Navigation Links for Logged Out Users
const LoggedOutNavLinks = () => {
  return (
    <>
      <Link
        to="/"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaHome className="mr-1" />
        <span>Home</span>
      </Link>

      <Link
        to="/categories"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaTag className="mr-1" />
        <span>Categories</span>
      </Link>

      <Link
        to="/deals"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaShippingFast className="mr-1" />
        <span>Deals</span>
      </Link>

      <Link
        to="/about"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaInfoCircle className="mr-1" />
        <span>About</span>
      </Link>

      <Link
        to="/contact"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaPhone className="mr-1" />
        <span>Contact</span>
      </Link>

      <Link
        to="/buyer-login"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaSignInAlt className="mr-1" />
        <span>Login</span>
      </Link>

      <Link
        to="/register"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaUser className="mr-1" />
        <span>Sign Up</span>
      </Link>
    </>
  );
};

// Desktop Navigation Links for Logged In Users
const LoggedInNavLinks = ({ userData, cartItems, isUserDropdownOpen, setIsUserDropdownOpen, handleLogout }) => {
  return (
    <>
      <Link
        to="/products"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaTshirt className="mr-1" />
        <span>Products</span>
      </Link>

      <Link
        to="/categories"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaTag className="mr-1" />
        <span>Categories</span>
      </Link>

      <Link
        to="/deals"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaShippingFast className="mr-1" />
        <span>Deals</span>
      </Link>

      {/* Notification Icon */}
      <button className="relative flex items-center hover:text-indigo-200 transition-colors">
        <FaBell className="text-xl" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span>
      </button>

      {/* Cart Icon */}
      <Link
        to="/cart"
        className="flex items-center hover:text-indigo-200 transition-colors relative"
      >
        <FaShoppingCart className="text-xl" />
        {Array.isArray(cartItems) && cartItems.length > 0 && (
          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </Link>

      {/* User Dropdown */}
      <div className="relative">
        <button 
          className="flex items-center hover:text-indigo-200 transition-colors"
          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
        >
          <FaUserCircle className="mr-1 text-xl" />
          <span>{userData?.firstname || "User"}</span>
        </button>

        {isUserDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setIsUserDropdownOpen(false)}
            >
              <FaUser className="mr-2" />
              Profile
            </Link>
            
            <Link
              to="/settings"
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
    </>
  );
};

// Mobile Navigation Links for Logged Out Users
const MobileLoggedOutNavLinks = ({ closeMenu }) => {
  return (
    <>
      <Link
        to="/"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaHome className="mr-2" />
        <span>Home</span>
      </Link>

      <Link
        to="/products"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaTshirt className="mr-2" />
        <span>Products</span>
      </Link>

      <Link
        to="/categories"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaTag className="mr-2" />
        <span>Categories</span>
      </Link>

      <Link
        to="/deals"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaShippingFast className="mr-2" />
        <span>Deals</span>
      </Link>

      <Link
        to="/about"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaInfoCircle className="mr-2" />
        <span>About</span>
      </Link>

      <Link
        to="/contact"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaPhone className="mr-2" />
        <span>Contact</span>
      </Link>

      <div className="flex gap-4 pt-2 border-t border-white border-opacity-20">
        <Link
          to="/buyer-login"
          className="flex-1 flex items-center justify-center bg-black bg-opacity-20 text-white py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
          onClick={closeMenu}
        >
          <FaSignInAlt className="mr-2" />
          <span>Login</span>
        </Link>

        <Link
          to="/register"
          className="flex-1 flex items-center justify-center bg-white text-red-500 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          onClick={closeMenu}
        >
          <FaUser className="mr-2" />
          <span>Sign Up</span>
        </Link>
      </div>
    </>
  );
};

// Mobile Navigation Links for Logged In Users
const MobileLoggedInNavLinks = ({ userData,  closeMenu, handleLogout }) => {
  return (
    <>
      <div className="flex items-center justify-between py-2 border-b border-white border-opacity-20">
        <div className="flex items-center">
          <FaUserCircle className="mr-2 text-xl" />
          <span className="font-semibold">{userData?.firstname || "User"}</span>
        </div>
      </div>

      <Link
        to="/products"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaTshirt className="mr-2" />
        <span>Products</span>
      </Link>

      <Link
        to="/categories"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaTag className="mr-2" />
        <span>Categories</span>
      </Link>

      <Link
        to="/deals"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaShippingFast className="mr-2" />
        <span>Deals</span>
      </Link>

      <Link
        to="/notifications"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaBell className="mr-2" />
        <span>Notifications</span>
        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span>
      </Link>

     

      <Link
        to="/profile"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaUser className="mr-2" />
        <span>Profile</span>
      </Link>

      <Link
        to="/settings"
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaCog className="mr-2" />
        <span>Settings</span>
      </Link>

      <button
        onClick={() => {
          handleLogout();
          closeMenu();
        }}
        className="flex items-center hover:text-indigo-200 transition-colors py-2 text-left"
      >
        <FaSignOutAlt className="mr-2" />
        <span>Logout</span>
      </button>
    </>
  );
};

export default Navbar;