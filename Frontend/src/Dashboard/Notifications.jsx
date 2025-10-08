import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BuyerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // API base URL - adjust this to match your Flask server
  const API_BASE_URL = 'http://localhost:5000';

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Use the buyer-specific endpoint that only returns admin notifications
      const response = await fetch(`${API_BASE_URL}/buyer/notifications`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please log in to view notifications');
          return;
        }
        if (response.status === 403) {
          toast.error('Access denied - buyers only');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Backend already filters for admin notifications only
      const notificationsData = Array.isArray(data) ? data : [];
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
      setNotifications([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Use the buyer-specific endpoint to mark notification as read
      const response = await fetch(`${API_BASE_URL}/buyer/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('Access denied - admin notifications only');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update the local state
      setNotifications(notifications.map(notif => 
        notif.id === id ? {...notif, read: true} : notif
      ));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Ensure filteredNotifications is always an array
  const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'read') return notif.read;
    if (filter === 'unread') return !notif.read;
    return true;
  }) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buyer Notifications</h1>
      
      {/* Filter Controls */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <span className="mr-3 text-gray-700">Filter:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-md ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Read
            </button>
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      <div>
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications found.</p>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white shadow-md rounded-lg p-4 ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {notification.date ? new Date(notification.date).toLocaleString() : 'No date'}
                      </span>
                      {!notification.read && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          New
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                    <p className="text-gray-700 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerNotifications;