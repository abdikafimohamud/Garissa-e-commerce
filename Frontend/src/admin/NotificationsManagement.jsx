import { useState, useEffect } from "react";
import { FiBell, FiTrash2 } from "react-icons/fi";

const USERS_API_URL = "http://localhost:5000/users";
const NOTIFICATIONS_API_URL = "http://localhost:5000/notifications";

const NotificationsManagement = () => {
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info",
    targetUser: "all",
  });

  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uRes = await fetch(USERS_API_URL);
        const nRes = await fetch(NOTIFICATIONS_API_URL);
        if (!uRes.ok || !nRes.ok) throw new Error("Failed to fetch");
        setUsers(await uRes.json());
        setNotifications(await nRes.json());
      } catch (err) {
        console.error(err);
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
      const newNotification = { ...notificationForm, date: new Date().toISOString(), read: false };
      const res = await fetch(NOTIFICATIONS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification),
      });
      if (!res.ok) throw new Error("Failed to send");
      const created = await res.json();
      setNotifications([...notifications, created]);
      setNotificationForm({ title: "", message: "", type: "info", targetUser: "all" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm("Delete this notification?")) {
      try {
        const res = await fetch(`${NOTIFICATIONS_API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        setNotifications(notifications.filter((n) => n.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Notification Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiBell className="mr-2" />
          Send Notification
        </h2>
        <form onSubmit={handleNotificationSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title*</label>
            <input type="text" name="title" value={notificationForm.title} onChange={handleNotificationChange} required className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm mb-1">Message*</label>
            <textarea name="message" value={notificationForm.message} onChange={handleNotificationChange} rows="3" required className="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select name="type" value={notificationForm.type} onChange={handleNotificationChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Target User</label>
              <select name="targetUser" value={notificationForm.targetUser} onChange={handleNotificationChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="all">All Users</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Send Notification</button>
          </div>
        </form>
      </div>

      {/* Notification Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiBell className="mr-2" />
          Sent Notifications ({notifications.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td className="px-6 py-4 text-sm font-medium">{n.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{n.message}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      n.type === "info" ? "bg-blue-100 text-blue-800" :
                      n.type === "warning" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {n.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {n.targetUser === "all" ? "All Users" : users.find((u) => u.id === n.targetUser)?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(n.date).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button onClick={() => handleDeleteNotification(n.id)} className="text-red-600 hover:text-red-900">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManagement;
