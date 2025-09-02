// src/seller/SellerSidebar.jsx
import { NavLink } from "react-router-dom";
import { FiHome, FiBox, FiShoppingCart, FiBarChart2, FiDollarSign, FiBell, FiSettings } from "react-icons/fi";

const SellerSidebar = () => {
  const links = [
    { name: "Dashboard", icon: <FiHome />, path: "/seller/dashboard-home" },
    { name: "My Products", icon: <FiBox />, path: "/seller/products" },
    { name: "Orders", icon: <FiShoppingCart />, path: "/seller/orders" },
    { name: "Analytics", icon: <FiBarChart2 />, path: "/seller/analytics" },
    { name: "Earnings", icon: <FiDollarSign />, path: "/seller/earnings" },
    { name: "Notifications", icon: <FiBell />, path: "/seller/notifications" },
    { name: "Profile", icon: <FiSettings />, path: "/seller/profile-settings" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        MyStore
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-md ${
                isActive ? "bg-gray-800 text-white" : ""
              }`
            }
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 text-sm text-gray-400 border-t border-gray-700">
        &copy; 2025 MyStore
      </div>
    </div>
  );
};

export default SellerSidebar;
