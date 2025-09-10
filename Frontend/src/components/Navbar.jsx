import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTshirt,
  FaShoppingCart,
  FaInfoCircle,
  FaUser,
  FaSignInAlt,
  FaTag,
  FaPhone,
  FaShippingFast,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaBars
} from "react-icons/fa";
import { GiClothes } from "react-icons/gi";

const Navbar = ({ 
  cartItems = [], 
  isLoggedIn = false, 
  userData = null, 
  userType = "buyer", 
  onLogout, 
  onToggleMenu, 
  onToggleUserDropdown, 
  isMenuOpen = false, 
  isUserDropdownOpen = false 
}) => {
  // Get user's display name with multiple fallbacks
  const getDisplayName = () => {
    if (!userData) return "User";
    return userData.firstname || userData.name || userData.username || "User";
  };

  return (
    <nav className="bg-gradient-to-r from-red-500 to-yellow-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          {/* Sidebar toggle for mobile - only show when logged in */}
          {isLoggedIn && (
            <button className="md:hidden mr-4 text-white">
              <FaBars className="text-xl" />
            </button>
          )}
          
          <Link to="/" className="text-2xl font-extrabold flex items-center text-black drop-shadow-lg">
            <GiClothes className="mr-2" />
            <span>Garissa Store</span>
          </Link>
          
          {/* Dashboard Title - only show when logged in */}
          {isLoggedIn && (
            <div className="ml-6 hidden md:block">
              <h1 className="text-lg font-semibold text-white">
                {userType === "seller" ? "Seller Dashboard" : 
                 userType === "admin" ? "Admin Dashboard" : "Dashboard"}
              </h1>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-black focus:outline-none"
          onClick={onToggleMenu}
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
              userType={userType}
              cartItems={cartItems} 
              isUserDropdownOpen={isUserDropdownOpen}
              onToggleUserDropdown={onToggleUserDropdown}
              onLogout={onLogout}
              getDisplayName={getDisplayName}
            />
          ) : (
            <LoggedOutNavLinks />
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-red-500 to-yellow-500 p-4 shadow-lg z-50">
            <div className="flex flex-col gap-4">
              {isLoggedIn ? (
                <MobileLoggedInNavLinks 
                  userData={userData} 
                  userType={userType}
                  cartItems={cartItems} 
                  closeMenu={onToggleMenu}
                  onLogout={onLogout}
                  getDisplayName={getDisplayName}
                />
              ) : (
                <MobileLoggedOutNavLinks 
                  closeMenu={onToggleMenu}
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
const LoggedInNavLinks = ({ userData, userType, cartItems, isUserDropdownOpen, onToggleUserDropdown, onLogout, getDisplayName }) => {
  return (
    <>
      {/* Welcome message */}
      <div className="hidden md:block text-sm text-white">
        Welcome, {getDisplayName()}!
      </div>

      {/* Products Link - Show for all user types */}
      <Link
        to="/products"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaTshirt className="mr-1" />
        <span>Products</span>
      </Link>

      {/* Categories Link - Show for all user types */}
      <Link
        to="/categories"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaTag className="mr-1" />
        <span>Categories</span>
      </Link>

      {/* Deals Link - Show for all user types */}
      <Link
        to="/deals"
        className="flex items-center hover:text-indigo-200 transition-colors"
      >
        <FaShippingFast className="mr-1" />
        <span>Deals</span>
      </Link>

      {/* Notification Icon - Show for all user types */}
      <button className="relative flex items-center hover:text-indigo-200 transition-colors">
        <FaBell className="text-xl" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span>
      </button>

      {/* Cart Icon - Show for buyers only */}
      {userType === "buyer" && (
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
      )}

      {/* User Dropdown */}
      <div className="relative">
        <button 
          className="flex items-center hover:text-indigo-200 transition-colors"
          onClick={onToggleUserDropdown}
        >
          <FaUserCircle className="mr-1 text-xl" />
          <span className="hidden md:inline">{getDisplayName()}</span>
        </button>

        {isUserDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email || ""}
              </p>
            </div>
            
            <Link
              to={
                userType === "seller" ? "/seller/profile-settings" : 
                userType === "admin" ? "/admin/profile" : "/Buyers/Profilee"
              }
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={onToggleUserDropdown}
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
              onClick={onToggleUserDropdown}
            >
              <FaCog className="mr-2" />
              Settings
            </Link>
            
            <button
              onClick={onLogout}
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
const MobileLoggedInNavLinks = ({ userType, closeMenu, onLogout, getDisplayName }) => {
  return (
    <>
      <div className="flex items-center justify-between py-2 border-b border-white border-opacity-20">
        <div className="flex items-center">
          <FaUserCircle className="mr-2 text-xl" />
          <span className="font-semibold">{getDisplayName()}</span>
        </div>
        <div className="text-sm text-white">
          {userType === "seller" ? "Seller" : userType === "admin" ? "Admin" : "Buyer"}
        </div>
      </div>

      <div className="text-xs text-white opacity-75 py-1">
        Welcome, {getDisplayName()}!
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

      {userType === "buyer" && (
        <Link
          to="/cart"
          className="flex items-center hover:text-indigo-200 transition-colors py-2"
          onClick={closeMenu}
        >
          <FaShoppingCart className="mr-2" />
          <span>Cart</span>
        </Link>
      )}

      <Link
        to={
          userType === "seller" ? "/seller/profile-settings" : 
          userType === "admin" ? "/admin/profile" : "/Buyers/Profilee"
        }
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaUser className="mr-2" />
        <span>Profile</span>
      </Link>

      <Link
        to={
          userType === "seller" ? "/seller/profile-settings" : 
          userType === "admin" ? "/admin/settings" : "/Buyers/settings"
        }
        className="flex items-center hover:text-indigo-200 transition-colors py-2"
        onClick={closeMenu}
      >
        <FaCog className="mr-2" />
        <span>Settings</span>
      </Link>

      <button
        onClick={() => {
          onLogout();
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