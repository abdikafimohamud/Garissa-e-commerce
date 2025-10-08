import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaUsers,
  FaUserTie,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
  FaBell,
  FaCog
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

export default function AdminHome() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState({
    total_sellers: 0,
    total_buyers: 0,
    total_orders: 0,
    total_revenue: 0,
    active_sellers: 0,
    active_buyers: 0,
    pending_orders: 0,
    completed_orders: 0,
    growth: {
      sellers: 0,
      buyers: 0,
      orders: 0,
      revenue: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/admin/dashboard/stats`, {
        withCredentials: true
      });
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = [
    {
      title: 'Total Sellers',
      value: loading ? 'Loading...' : dashboardStats.total_sellers.toLocaleString(),
      icon: <FaUserTie className="text-blue-500 text-xl" />,
      change: `+${dashboardStats.growth.sellers}% from last month`,
      color: 'bg-blue-100',
      onClick: () => navigate('/admin/dashboard/sellers')
    },
    {
      title: 'Total Buyers',
      value: loading ? 'Loading...' : dashboardStats.total_buyers.toLocaleString(),
      icon: <FaUsers className="text-green-500 text-xl" />,
      change: `+${dashboardStats.growth.buyers}% from last month`,
      color: 'bg-green-100',
      onClick: () => navigate('/admin/dashboard/buyers')
    },
    {
      title: 'Orders',
      value: loading ? 'Loading...' : dashboardStats.total_orders.toLocaleString(),
      icon: <FaShoppingCart className="text-purple-500 text-xl" />,
      change: `+${dashboardStats.growth.orders}% from yesterday`,
      color: 'bg-purple-100',
      onClick: () => navigate('/admin/dashboard/orders')
    },
    {
      title: 'Revenue',
      value: loading ? 'Loading...' : formatCurrency(dashboardStats.total_revenue),
      icon: <FaDollarSign className="text-yellow-500 text-xl" />,
      change: `+${dashboardStats.growth.revenue}% from last month`,
      color: 'bg-yellow-100',
      onClick: () => navigate('/admin/dashboard/earnings')
    }
  ];

  const quickActions = [
    {
      title: 'Analytics',
      icon: <FaChartLine className="text-xl" />,
      color: 'bg-blue-500',
      path: '/admin/dashboard/analytics'
    },
    {
      title: 'Notifications',
      icon: <FaBell className="text-xl" />,
      color: 'bg-red-500',
      path: '/admin/dashboard/NotificationManagement'
    },
    {
      title: 'Orders',
      icon: <FaCog className="text-xl" />,
      color: 'bg-gray-500',
      path: '/admin/dashboard/orders'
    }
  ];

  const handleQuickActionClick = (path) => {
    navigate(path);
  };

  // Chart data
  const userTypeData = [
    { name: 'Sellers', value: dashboardStats.total_sellers, color: '#3B82F6' },
    { name: 'Buyers', value: dashboardStats.total_buyers, color: '#10B981' },
    { name: 'Active Sellers', value: dashboardStats.active_sellers, color: '#6366F1' },
    { name: 'Active Buyers', value: dashboardStats.active_buyers, color: '#F59E0B' }
  ];

  const orderStatusData = [
    { name: 'Pending', value: dashboardStats.pending_orders, color: '#F59E0B' },
    { name: 'Completed', value: dashboardStats.completed_orders, color: '#10B981' }
  ];

  const monthlyStatsData = [
    { month: 'Aug', sellers: 8, buyers: 45, orders: 23, revenue: 145000 },
    { month: 'Sep', sellers: 12, buyers: 67, orders: 28, revenue: 234000 },
    { month: 'Oct', sellers: dashboardStats.total_sellers, buyers: dashboardStats.total_buyers, orders: dashboardStats.total_orders, revenue: dashboardStats.total_revenue }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-lg">Loading dashboard data...</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
          <p className="text-gray-600 mt-2">
            {formattedDate} • {formattedTime}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={fetchDashboardStats}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaChartLine className="mr-2" />
            Refresh Data
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => navigate('/admin/dashboard/earnings')}
          >
            <FaChartLine className="mr-2" />
            Generate Earnings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={stat.onClick}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-start p-4 rounded-lg text-white ${action.color} hover:opacity-90 transition-opacity duration-200`}
                  onClick={() => handleQuickActionClick(action.path)}
                >
                  <span className="mr-3">{action.icon}</span>
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : dashboardStats.active_sellers}
                </h3>
                <p className="text-sm text-gray-600">Active Sellers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-2xl font-bold text-green-600">
                  {loading ? '...' : dashboardStats.active_buyers}
                </h3>
                <p className="text-sm text-gray-600">Active Buyers</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-2xl font-bold text-yellow-600">
                  {loading ? '...' : dashboardStats.pending_orders}
                </h3>
                <p className="text-sm text-gray-600">Pending Orders</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-600">
                  {loading ? '...' : dashboardStats.completed_orders}
                </h3>
                <p className="text-sm text-gray-600">Completed Orders</p>
              </div>
            </div>
            <div className="h-80 bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 mb-4">Monthly Performance Trends</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(value), 'Revenue'];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sellers" stroke="#3B82F6" strokeWidth={2} name="Sellers" />
                  <Line type="monotone" dataKey="buyers" stroke="#10B981" strokeWidth={2} name="Buyers" />
                  <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => navigate('/admin/dashboard/orders')}
                  >
                    <div>
                      <p className="text-sm font-medium">Order #100{item}</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Server Uptime</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    99.9%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">API Response</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Fast
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Database</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Total Revenue</p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {loading ? 'Loading...' : formatCurrency(dashboardStats.total_revenue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Pending Orders</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Completed Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Growth Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStatsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000)}K`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Current Month</h4>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(dashboardStats.total_revenue)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">Growth Rate</h4>
            <p className="text-lg font-bold text-green-600">+{dashboardStats.growth.revenue}%</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800">Total Orders</h4>
            <p className="text-lg font-bold text-purple-600">{dashboardStats.total_orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}