// src/layouts/AdminDashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiDollarSign,
  FiBell,
  FiFileText,
} from "react-icons/fi";

const AdminDashboardLayout = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-red-600 text-white"
        : "hover:bg-red-500 hover:text-white text-gray-200"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-gradient-to-r from-green-500 to-yellow-500 text-white p-6 shadow-lg fixed h-full overflow-y-auto">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">ADMIN PANEL</h2>
        </div>

        <nav className="space-y-3">
          {/* Dashboard */}
          <NavLink to="/admin/Home" className={linkClasses}>
            <FiHome className="mr-3" /> AdminHome
          </NavLink>

          {/* Seller Management */}
          <NavLink to="/admin/sellers" className={linkClasses}>
            <FiUsers className="mr-3" /> Manage Sellers
          </NavLink>

          {/* Buyer Management */}
          <NavLink to="/admin/buyers" className={linkClasses}>
            <FiUsers className="mr-3" /> Manage Buyers
          </NavLink>

          {/* Product Management */}
          <NavLink to="/admin/products" className={linkClasses}>
            <FiBox className="mr-3" /> Manage Products
          </NavLink>

          {/* Orders Management */}
          <NavLink to="/admin/orders" className={linkClasses}>
            <FiShoppingCart className="mr-3" /> Manage Orders
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
          <NavLink to="/admin/notifications" className={linkClasses}>
            <FiBell className="mr-3" /> Notifications
          </NavLink>

          {/* Reports */}
          <NavLink to="/admin/reports" className={linkClasses}>
            <FiFileText className="mr-3" /> Reports
          </NavLink>
        </nav>
      </aside>

      {/* Scrollable Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
