import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiDollarSign,
  FiBell,
  FiSettings,
} from "react-icons/fi";

const SellerSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {

  const baseClasses =
    "flex items-center p-3 rounded-lg transition-all duration-200 group";
  const activeClasses = "bg-gray-700 text-yellow-300";
  const inactiveClasses = "hover:bg-gray-700";

  const links = [
    { name: "Dashboard", icon: <FiHome />, path: "/seller/dashboard-home" },
    { name: "Clothes", icon: <FiBox />, path: "/seller/clothes" },
    { name: "Cosmetics", icon: <FiBox />, path: "/seller/cosmetics" },
    { name: "Electronics", icon: <FiBox />, path: "/seller/electronics" },
    { name: "Sports", icon: <FiBox />, path: "/seller/sports" },
    { name: "Orders", icon: <FiShoppingCart />, path: "/seller/orders" },
    { name: "Analytics", icon: <FiBarChart2 />, path: "/seller/analytics" },
    { name: "Earnings", icon: <FiDollarSign />, path: "/seller/earnings" },
    { name: "Notifications", icon: <FiBell />, path: "/seller/notifications" },
    { name: "Profile", icon: <FiSettings />, path: "/seller/profile-settings" },
  ];

 

 

  return (
    <aside
      className={`bg-gradient-to-r from-green-600 to-purple-600 text-white p-6 shadow-lg fixed h-full overflow-y-auto transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-64 w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">SELLER</h2>
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✖
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              {link.name}
            </span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default SellerSidebar;
