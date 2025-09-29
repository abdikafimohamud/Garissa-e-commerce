import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function UserSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/Buyers/dashboard-home", label: "Dashboard Home", icon: "🏠" },
    { path: "/Buyers/clothes", label: "Clothes", icon: "👕" },
    { path: "/Buyers/cosmetics", label: "Cosmetics", icon: "💄" },
    { path: "/Buyers/electronics", label: "Electronics", icon: "📱" },
    { path: "/Buyers/sports", label: "Sports", icon: "🏀" },
    { path: "/Buyers/cart", label: "Cart", icon: "🛒" },
    { path: "/Buyers/checkout", label: "Checkout", icon: "💰" },
    { path: "/Buyers/order-details", label: "Order Details", icon: "📋" },
    { path: "/Buyers/notifications", label: "Notifications", icon: "🔔" },
    { path: "/Buyers/profile", label: "Profile Settings", icon: "⚙️" },
  ];

  const baseClasses =
    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-blue-600 text-white shadow-md";
  const inactiveClasses = "text-white hover:bg-gray-700 hover:text-white";

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-lg shadow-lg focus:outline-none"
        aria-label="Open sidebar menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-transform duration-300
          w-64 bg-gradient-to-r from-green-500 to-yellow-500 text-white flex flex-col shadow-lg
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:min-h-screen
        `}
        role="navigation"
        aria-label="User sidebar"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-wide">User Dashboard</h2>
          {/* Close button for mobile */}
          <button
            className="md:hidden text-white text-xl focus:outline-none"
            aria-label="Close sidebar menu"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${baseClasses} ${
                      isActive ? activeClasses : inactiveClasses
                    }`
                  }
                  onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after click
                >
                  <span className="mr-3 text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
}
