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
  FiFileText,
  FiMenu,
  FiX
} from "react-icons/fi";

const AdminDashboardLayout = () => {
  const [isSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-red-600 text-white"
        : "hover:bg-red-500 hover:text-white text-gray-200"
    }`;
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header 
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          userType="admin"
        />
      </header>

      <div className="flex flex-1 pt-16">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
        )}

        {/* Fixed Sidebar */}
        <aside className={`w-64 bg-gradient-to-r from-green-500 to-yellow-500 text-white p-6 shadow-lg fixed h-full overflow-y-auto z-50 transition-transform duration-300
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static`}>
          
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
            {/* Dashboard */}
            <NavLink 
              to="/admin/Home" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiHome className="mr-3" /> AdminHome
            </NavLink>

            {/* Seller Management */}
            <NavLink 
              to="/admin/sellers" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiUsers className="mr-3" /> Manage Sellers
            </NavLink>

            {/* Buyer Management */}
            <NavLink 
              to="/admin/buyers" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiUsers className="mr-3" /> Manage Buyers
            </NavLink>

            {/* Product Management */}
            <NavLink 
              to="/admin/products" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiBox className="mr-3" /> Manage Products
            </NavLink>

            {/* Orders Management */}
            <NavLink 
              to="/admin/orders" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiShoppingCart className="mr-3" /> Manage Orders
            </NavLink>

            {/* Analytics */}
            <NavLink 
              to="/admin/analytics" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiBarChart2 className="mr-3" /> Analytics
            </NavLink>

            {/* Earnings */}
            <NavLink 
              to="/admin/earnings" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiDollarSign className="mr-3" /> Earnings
            </NavLink>

            {/* Notifications */}
            <NavLink 
              to="/admin/notifications" 
              className={linkClasses}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FiBell className="mr-3" /> Notifications
            </NavLink>
          </nav>
        </aside>

        {/* Scrollable Main Content */}
        <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}>
          {/* Mobile Sidebar Toggle Button */}
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