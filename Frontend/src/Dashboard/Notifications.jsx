// src/user/Notifications.jsx
import { useState, useEffect } from "react";
import { FiBell, FiCheckCircle, FiInfo, FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";

const NOTIFICATIONS_API_URL = "http://localhost:5000/notifications";
const CURRENT_USER_ID = 2; // 🔑 Replace this with your logged-in user ID (from auth/session)

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(NOTIFICATIONS_API_URL);
        if (!res.ok) throw new Error("Failed to fetch");
        const all = await res.json();

        // ✅ Filter notifications for this user (or all users)
        const userNotifs = all.filter(
          (n) => n.targetUser === "all" || n.targetUser === CURRENT_USER_ID
        );
        setNotifications(userNotifs.reverse()); // Show latest first
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // TODO: update backend if needed
  };

  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <FiInfo className="text-blue-500 w-5 h-5" />;
      case "warning":
        return <FiAlertTriangle className="text-yellow-500 w-5 h-5" />;
      case "alert":
        return <FiAlertOctagon className="text-red-500 w-5 h-5" />;
      default:
        return <FiBell className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FiBell className="mr-2 text-green-600" /> My Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="text-gray-500 text-center bg-white p-10 rounded-lg shadow">
          <FiCheckCircle className="mx-auto mb-2 text-green-500 w-10 h-10" />
          <p>No new notifications 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-lg shadow border transition ${
                n.read ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div>{getIcon(n.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
                <p className="text-gray-600 text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.date).toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
