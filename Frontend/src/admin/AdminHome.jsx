// src/admin/DashboardHome.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaUserTie, 
  FaShoppingCart, 
  FaDollarSign,
  FaChartLine,
  FaBell,
  FaFileAlt,
  FaCog
} from 'react-icons/fa';

export default function AdminHome() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format the date and time
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
  
  // Stats data
  const stats = [
    { 
      title: 'Total Sellers', 
      value: '1,245', 
      icon: <FaUserTie className="text-blue-500 text-xl" />,
      change: '+12% from last month',
      color: 'bg-blue-100',
      onClick: () => navigate('/admin/sellers')
    },
    { 
      title: 'Total Buyers', 
      value: '5,678', 
      icon: <FaUsers className="text-green-500 text-xl" />,
      change: '+8% from last month',
      color: 'bg-green-100',
      onClick: () => navigate('/admin/buyers')
    },
    { 
      title: 'Orders', 
      value: '842', 
      icon: <FaShoppingCart className="text-purple-500 text-xl" />,
      change: '+5% from yesterday',
      color: 'bg-purple-100',
      onClick: () => navigate('/admin/orders')
    },
    { 
      title: 'Revenue', 
      value: '$45,230', 
      icon: <FaDollarSign className="text-yellow-500 text-xl" />,
      change: '+15% from last month',
      color: 'bg-yellow-100',
      onClick: () => navigate('/admin/earnings')
    }
  ];
  
  // Quick actions with navigation
  const quickActions = [
    { 
      title: 'Analytics', 
      icon: <FaChartLine className="text-xl" />, 
      color: 'bg-blue-500',
      path: '/admin/analytics'
    },
    { 
      title: 'Notifications', 
      icon: <FaBell className="text-xl" />, 
      color: 'bg-red-500',
      path: '/admin/notifications'
    },
    { 
      title: 'Orders', 
      icon: <FaCog className="text-xl" />, 
      color: 'bg-gray-500',
      path: '/admin/orders'
    },
  ];

  const handleQuickActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
          <p className="text-gray-600 mt-2">
            {formattedDate} • {formattedTime}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => navigate('/admin/Earnings')}
          >
            <FaChartLine className="mr-2" />
            Generate Earnings
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
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
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
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
        
        {/* Right Column - Recent Activity and Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h2>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Chart visualization would go here</p>
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
                    onClick={() => navigate('/admin/orders')}
                  >
                    <div>
                      <p className="text-sm font-medium">Order #100{item}</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Server Uptime</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">API Response</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Fast</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Database</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}