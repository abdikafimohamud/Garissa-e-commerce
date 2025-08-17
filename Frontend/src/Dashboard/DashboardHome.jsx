// src/dashboard/DashboardHome.jsx
import { useState } from "react";

const DashboardHome = () => {
  // Example state for stats (replace with real data later)
  const [stats] = useState({
    totalProducts: 1234,
    totalOrders: 567,
    totalUsers: 89,
    revenue: "$45,000",
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.revenue}</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
        <ul className="space-y-3 text-gray-600">
          <li>🛒 New order placed (#1023)</li>
          <li>👤 New user registered</li>
          <li>📦 Stock updated for "Casual T-Shirt"</li>
          <li>💳 Payment received from John Doe</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
