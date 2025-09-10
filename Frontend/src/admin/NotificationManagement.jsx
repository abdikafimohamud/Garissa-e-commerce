import React, { useState, useEffect } from 'react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    target_user: '' // seller id as string or "all"
  });

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchNotifications();
    fetchSellers();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const sellersData = Array.isArray(data) ? data.filter(u => u.role === 'seller') : [];
      setSellers(sellersData);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setSellers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${API_BASE_URL}/admin/notifications/${editingId}`
        : `${API_BASE_URL}/admin/notifications`;
      const method = editingId ? 'PATCH' : 'POST';

      // Map target_user -> targetUser for Flask backend
      const submitData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        targetUser: formData.target_user || 'all'
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error saving notification');

      if (editingId) {
        setNotifications(prev => prev.map(n => (n.id === editingId ? data : n)));
      } else {
        setNotifications(prev => [data, ...prev]);
      }

      setFormData({ title: '', message: '', type: 'info', target_user: '' });
      setEditingId(null);
      alert(editingId ? 'Notification updated!' : 'Notification created!');
    } catch (error) {
      console.error('Error saving notification:', error);
      alert('Failed to save notification: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error deleting notification');
      setNotifications(prev => prev.filter(n => n.id !== id));
      alert('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification');
    }
  };

  const handleEdit = (notif) => {
    setFormData({
      title: notif.title,
      message: notif.message,
      type: notif.type,
      target_user: notif.target_user === 'all' ? 'all' : String(notif.target_user)
    });
    setEditingId(notif.id);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Notification Management</h1>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Notification' : 'Create New Notification'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Seller</label>
              <select
                name="target_user"
                value={formData.target_user}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Seller</option>
                <option value="all">All Sellers</option>
                {sellers.map(seller => (
                  <option key={seller.id} value={String(seller.id)}>
                    {seller.name || seller.email || `Seller ${seller.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? 'Update Notification' : 'Create Notification'}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div key={notification.id} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {notification.date ? new Date(notification.date).toLocaleString() : 'No date'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Target: {notification.target_user === 'all'
                          ? 'All Sellers'
                          : sellers.find(s => s.id === notification.target_user)?.name || `Seller ${notification.target_user}`}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                    <p className="text-gray-700 mt-1">{notification.message}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(notification)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
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

export default AdminNotifications;
