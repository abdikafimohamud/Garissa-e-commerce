import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserSidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { path: "/products/dashboard-home", label: "Dashboard Home", icon: "🏠" },
    { path: "/products/clothes", label: "Clothes", icon: "👕" },
    { path: "/products/cosmetics", label: "Cosmetics", icon: "💄" },
    { path: "/products/electronics", label: "Electronics", icon: "📱" },
    { path: "/products/sports", label: "Sports", icon: "🏀" },
    { path: "/products/reports", label: "Reports", icon: "📊" },
    { path: "/products/setting", label: "Settings", icon: "⚙️" },
  ];

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
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        {user && (
          <div className="mb-4">
            <p className="text-sm text-gray-300">
              👋 Welcome back,{" "}
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
