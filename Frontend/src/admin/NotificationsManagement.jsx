// src/admin/NotificationsManagement.jsx
export default function NotificationsManagement() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Notifications</h1>
      <p className="mb-4 text-gray-700">
        Send announcements or alerts to users and sellers.
      </p>
      <div className="bg-white shadow rounded-lg p-6">
        <textarea
          className="w-full border rounded p-2 mb-3"
          rows="4"
          placeholder="Write your notification message..."
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Send Notification
        </button>
      </div>
    </div>
  );
}
