// src/dashboard/DashboardHome.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const DashboardHome = () => {
  const { user } = useAuth();
  const [buyerStats, setBuyerStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    cartItems: 0,
    wishlistItems: 0,
  });
  const [categoryCounts, setCategoryCounts] = useState({
    clothes: 0,
    cosmetics: 0,
    electronics: 0,
    sports: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch product counts by category
        const categories = ["clothes", "cosmetics", "electronics", "sports"];
        const counts = {};
        for (const cat of categories) {
          const res = await fetch(
            `http://localhost:5000/api/products/public?category=${cat}`
          );
          if (res.ok) {
            const data = await res.json();
            counts[cat] = Array.isArray(data.products)
              ? data.products.length
              : 0;
          } else {
            counts[cat] = 0;
          }
        }
        setCategoryCounts(counts);

        // Fetch buyer's orders
        if (user && user.id) {
          const ordersRes = await fetch(
            `http://localhost:5000/orders/${user.id}`,
            { credentials: "include" }
          );
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            const orders = Array.isArray(ordersData.orders)
              ? ordersData.orders
              : [];
            setBuyerStats((prev) => ({
              ...prev,
              totalOrders: orders.length,
              totalSpent: orders.reduce(
                (sum, order) => sum + (order.total || 0),
                0
              ),
            }));
            setRecentOrders(orders.slice(0, 5));
          }
        }

        // Fetch notifications
        const notifRes = await fetch("http://localhost:5000/notifications", {
          credentials: "include",
        });
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(
            Array.isArray(notifData) ? notifData.slice(0, 5) : []
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);
  // You can add other buyer data fetches here, but do not fetch /api/orders to avoid 404 errors.

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ==== Category Stats ==== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <div
            key={cat}
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{count}</div>
            <div className="text-gray-700 font-semibold capitalize">{cat}</div>
            <div className="mt-2 text-xs text-gray-400">Total Products</div>
          </div>
        ))}
      </div>
      {/* ==== Page Header (Buyer Dashboard) ==== */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.firstname || "Buyer"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your account
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Member since</p>
          <p className="font-semibold text-gray-800">
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* ==== Dashboard Overview ==== */}
      <h2 className="text-2xl font-bold text-gray-800">
        Your Shopping Overview
      </h2>

      {/* Stats Grid */}
      {/* ==== Buyer Stats ==== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {buyerStats.totalOrders}
          </div>
          <div className="text-gray-700 font-semibold">Total Orders</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {formatCurrency(buyerStats.totalSpent)}
          </div>
          <div className="text-gray-700 font-semibold">Total Spent</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      {/* ==== Notifications ==== */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <div className="text-gray-500">No notifications yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <li key={notif.id} className="py-3 flex flex-col">
                <span className="font-semibold text-blue-700">
                  {notif.title}
                </span>
                <span className="text-gray-700">{notif.message}</span>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(notif.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          <a
            href="/Buyers/order-details"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Orders →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to see your orders here.
            </p>
            <div className="mt-6">
              <a
                href="/Buyers/clothes"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Shopping
              </a>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Continue Shopping
          </h3>
          <p className="text-gray-600 mb-4">
            Browse our latest products and deals
          </p>
          <a
            href="/Buyers/clothes"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Shop Now
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Track Orders
          </h3>
          <p className="text-gray-600 mb-4">
            Check the status of your recent orders
          </p>
          <a
            href="/Buyers/order-details"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Track Orders
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Update Profile
          </h3>
          <p className="text-gray-600 mb-4">
            Manage your account settings and preferences
          </p>
          <a
            href="/Buyers/profile"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;