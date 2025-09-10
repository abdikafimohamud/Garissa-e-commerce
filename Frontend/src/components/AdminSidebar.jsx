// src/components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiDollarSign,
  FiBell,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 Clear auth session (adjust to your auth system)
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col justify-between p-6 shadow-lg">
      {/* Top Nav Links */}
      <div>
        <h2 className="text-2xl font-bold mb-8 tracking-wide">Admin Panel</h2>
        <nav className="space-y-3">
          {/* Dashboard */}
          <NavLink to="/admin/AdminHome" className={linkClasses}>
            <FiHome className="mr-3" /> Dashboard
          </NavLink>

          {/* Seller Management */}
          <NavLink to="/admin/sellers" className={linkClasses}>
            <FiUsers className="mr-3" /> Manage Sellers
          </NavLink>

          {/* Buyer Management */}
          <NavLink to="/admin/buyers" className={linkClasses}>
            <FiUsers className="mr-3" /> Manage Buyers
          </NavLink>


          {/* Analytics */}
          <NavLink to="/admin/analytics" className={linkClasses}>
            <FiBarChart2 className="mr-3" /> Analytics
          </NavLink>

          {/* Earnings */}
          <NavLink to="/admin/earnings" className={linkClasses}>
            <FiDollarSign className="mr-3" /> Earnings
          </NavLink>

          {/* Notifications */}
          <NavLink to="/admin/NotificationManagement" className={linkClasses}>
            <FiBell className="mr-3" /> Notifications
          </NavLink>
          
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
      >
        <FiLogOut className="mr-3" /> Logout
      </button>
    </aside>
  );
}
