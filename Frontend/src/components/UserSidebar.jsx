// src/components/UserSidebar.jsx
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserSidebar() {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { path: "/Buyers/dashboard-home", label: "Dashboard Home", icon: "🏠" },
    { path: "/Buyers/clothes", label: "Clothes", icon: "👕" },
    { path: "/Buyers/cosmetics", label: "Cosmetics", icon: "💄" },
    { path: "/Buyers/electronics", label: "Electronics", icon: "📱" },
    { path: "/Buyers/sports", label: "Sports", icon: "🏀" },
    { path: "/Buyers/cart", label: "Cart", icon: "🛒" },
    { path: "/Buyers/profilee", label: "Profile", icon: "👤" },
    { path: "/Buyers/notifications", label: "Notifications", icon: "🔔" },
  ];

  const baseClasses =
    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-blue-600 text-white shadow-md";
  const inactiveClasses =
    "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold tracking-wide">User Dashboard</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                }
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        {user && (
          <div className="mb-4">
            <p className="text-sm text-gray-300">
              👋 Welcome back,
              <span className="block font-semibold">{user.fullname}</span>
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}