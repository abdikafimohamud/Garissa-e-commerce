import { Link } from "react-router-dom";
import {
  FaHome,
  FaTshirt,
  FaShoppingCart,
  FaInfoCircle,
  FaUser,
} from "react-icons/fa";
import { GiClothes } from "react-icons/gi";

const Navbar = ({ cartItems = [] }) => {
  return (
    <nav className="bg-gradient-to-r from-red-500 to-yellow-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-extrabold flex items-center text-black drop-shadow-lg">
          <GiClothes className="mr-2" />
          <span>Garissa Store</span>
        </div>

        {/* Links */}
        <div className="flex gap-6 items-center">
          <Link
            to="/"
            className="flex items-center hover:text-indigo-200 transition-colors"
          >
            <FaHome className="mr-1" />
            <span>Home</span>
          </Link>

          {/* ✅ Products now goes to Dashboard with Sidebar */}
          <Link
            to="/products"
            className="flex items-center hover:text-indigo-200 transition-colors"
          >
            <FaTshirt className="mr-1" />
            <span>products</span>
          </Link>

          <Link
            to="/cart"
            className="flex items-center hover:text-indigo-200 transition-colors relative"
          >
            <FaShoppingCart className="mr-1" />
            <span>Cart</span>
            {Array.isArray(cartItems) && cartItems.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/about"
            className="flex items-center hover:text-indigo-200 transition-colors"
          >
            <FaInfoCircle className="mr-1" />
            <span>About</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center hover:text-indigo-200 transition-colors"
          >
            <FaUser className="mr-1" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
