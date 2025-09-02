// src/admin/ManagementNotifications.jsx
import { useState, useEffect } from "react";
import { Plus, Send, Trash2 } from "lucide-react";

export default function ManagementNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Send notification
  const handleSend = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    try {
      const res = await fetch("http://localhost:5000/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      if (res.ok) {
        setTitle("");
        setMessage("");
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/notifications/${id}`, {
        method: "DELETE",
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📢 Manage Notifications</h1>

      {/* Create Notification Form */}
      <form
        onSubmit={handleSend}
        className="bg-white p-6 rounded-xl shadow-md mb-8"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-600" /> Create New Notification
        </h2>
        <input
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
          rows={4}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
        >
          <Send className="w-4 h-4" /> Send Notification
        </button>
      </form>

      {/* Notifications List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">📋 Sent Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications sent yet.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
              >
                <div>
                  <h3 className="font-bold text-gray-800">{n.title}</h3>
                  <p className="text-gray-600">{n.message}</p>
                  <small className="text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
