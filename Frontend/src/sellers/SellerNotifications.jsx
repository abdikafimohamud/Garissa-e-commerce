import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiBell, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/seller/notifications`, {
        withCredentials: true
      });
      
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${baseURL}/seller/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiBell className="text-blue-500" />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'success':
        return <FiCheck className="text-green-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'order':
        return 'border-l-blue-500 bg-blue-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
        <p className="text-gray-600">
          Stay updated with your orders and important messages.
        </p>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FiBell className="text-2xl text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Notifications</h3>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FiClock className="text-2xl text-yellow-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Unread</h3>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FiCheck className="text-2xl text-green-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Read</h3>
              <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium mb-2">No notifications yet</p>
            <p>You'll see notifications about new orders and updates here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 border-l-4 ${getTypeColor(notification.type)} ${
                  !notification.read ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-lg font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-4 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Notifications
        </button>
      </div>
    </div>
  );
}