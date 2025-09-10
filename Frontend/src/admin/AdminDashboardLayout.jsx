// src/layouts/AdminDashboardLayout.jsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiDollarSign,
  FiBell,
  FiMenu,
  FiX,
} from "react-icons/fi";

const AdminDashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-red-600 text-white"
        : "hover:bg-red-500 hover:text-white text-gray-200"
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          userType="admin"
        />
      </header>

      <div className="flex flex-1 pt-16">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gradient-to-r from-green-500 to-yellow-500 text-white p-6 shadow-lg z-40 transform transition-transform duration-300
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
        >
          {/* Close button for mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 text-white"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FiX className="text-xl" />
          </button>

          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">ADMIN PANEL</h2>
          </div>

          <nav className="space-y-3">
            <NavLink
              to="/admin/Home"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiHome className="mr-3" /> AdminHome
            </NavLink>
            <NavLink
              to="/admin/sellers"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiUsers className="mr-3" /> Manage Sellers
            </NavLink>
            <NavLink
              to="/admin/buyers"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiUsers className="mr-3" /> Manage Buyers
            </NavLink>
            <NavLink
              to="/admin/products"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiBox className="mr-3" /> Manage Products
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiShoppingCart className="mr-3" /> Manage Orders
            </NavLink>
            <NavLink
              to="/admin/analytics"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiBarChart2 className="mr-3" /> Analytics
            </NavLink>
            <NavLink
              to="/admin/earnings"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiDollarSign className="mr-3" /> Earnings
            </NavLink>
            <NavLink
              to="/admin/NotificationManagement"
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiBell className="mr-3" /> Notifications
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:ml-64">
          {/* Mobile Sidebar Toggle */}
          {!isMobileSidebarOpen && (
            <button
              className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-white rounded-md shadow-md text-gray-700"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <FiMenu className="text-xl" />
            </button>
          )}

          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
