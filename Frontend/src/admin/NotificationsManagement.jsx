import { useState, useEffect } from "react";
import { 
  FiBell, 
  FiTrash2, 
  FiSend, 
  FiUser, 
  FiInfo, 
  FiAlertTriangle, 
  FiAlertCircle,
  FiShoppingBag // Replaced FiStore with FiShoppingBag
} from "react-icons/fi";

const SELLERS_API_URL = "http://localhost:5000/sellers";
const NOTIFICATIONS_API_URL = "http://localhost:5000/notifications";

const SellerNotifications = () => {
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info",
    targetSeller: "all",
  });

  const [sellers, setSellers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const sRes = await fetch(SELLERS_API_URL);
        const nRes = await fetch(NOTIFICATIONS_API_URL);
        if (!sRes.ok || !nRes.ok) throw new Error("Failed to fetch");
        setSellers(await sRes.json());
        setNotifications(await nRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNotificationChange = (e) => {
    const { name, value } = e.target;
    setNotificationForm({ ...notificationForm, [name]: value });
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const newNotification = { 
        ...notificationForm, 
        date: new Date().toISOString(), 
        read: false,
        id: Date.now(), // Temporary ID for UI update
        targetType: "seller" // Add target type to distinguish seller notifications
      };
      
      const res = await fetch(NOTIFICATIONS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification),
      });
      
      if (!res.ok) throw new Error("Failed to send");
      const created = await res.json();
      setNotifications([created, ...notifications]);
      setNotificationForm({ title: "", message: "", type: "info", targetSeller: "all" });
      
      // Show success message
      alert("Notification sent successfully to sellers!");
    } catch (err) {
      console.error(err);
      alert("Failed to send notification. Please try again.");
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const res = await fetch(`${NOTIFICATIONS_API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        setNotifications(notifications.filter((n) => n.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete notification. Please try again.");
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "info":
        return <FiInfo className="text-blue-500" />;
      case "warning":
        return <FiAlertTriangle className="text-yellow-500" />;
      case "alert":
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "alert":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter notifications to only show those sent to sellers
  const sellerNotifications = notifications.filter(
    (n) => n.targetType === "seller" || !n.targetType // Include legacy notifications without targetType
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiShoppingBag className="mr-3 text-blue-600" /> {/* Replaced FiStore with FiShoppingBag */}
          Seller Notifications Management
        </h1>
        <p className="text-gray-600 mt-2">Send and manage notifications for your sellers</p>
      </div>

      {/* Notification Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <FiSend className="mr-3 text-blue-600" />
          Send New Notification to Sellers
        </h2>
        <form onSubmit={handleNotificationSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
              <input 
                type="text" 
                name="title" 
                value={notificationForm.title} 
                onChange={handleNotificationChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter notification title for sellers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select 
                name="type" 
                value={notificationForm.type} 
                onChange={handleNotificationChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message*</label>
            <textarea 
              name="message" 
              value={notificationForm.message} 
              onChange={handleNotificationChange} 
              rows="4" 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your notification message for sellers..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Seller</label>
            <select 
              name="targetSeller" 
              value={notificationForm.targetSeller} 
              onChange={handleNotificationChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Sellers</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.storeName || s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center"
            >
              <FiSend className="mr-2" />
              Send to Sellers
            </button>
          </div>
        </form>
      </div>

      {/* Notification Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiBell className="mr-3 text-blue-600" />
            Notifications Sent to Sellers
            <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {sellerNotifications.length}
            </span>
          </h2>
          
          <div className="flex items-center text-sm text-gray-500">
            <FiShoppingBag className="mr-1" /> {/* Replaced FiStore with FiShoppingBag */}
            {sellers.length} sellers in system
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : sellerNotifications.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <FiBell className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No notifications yet</h3>
            <p className="text-gray-500 mt-2">Send your first notification to sellers using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellerNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{n.title}</div>
                      <div className="text-sm text-gray-500 mt-1 max-w-md">{n.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadgeClass(n.type)}`}>
                        {getTypeIcon(n.type)}
                        <span className="ml-1.5 capitalize">{n.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {n.targetSeller === "all" || n.targetUser === "all" ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          All Sellers
                        </span>
                      ) : (
                        sellers.find((s) => s.id === (n.targetSeller || n.targetUser))?.storeName || 
                        sellers.find((s) => s.id === (n.targetSeller || n.targetUser))?.name || 
                        "Unknown Seller"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(n.date).toLocaleDateString()} 
                      <span className="block text-xs text-gray-400">
                        {new Date(n.date).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteNotification(n.id)} 
                        className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Delete notification"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerNotifications;