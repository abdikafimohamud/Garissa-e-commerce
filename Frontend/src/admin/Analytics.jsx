// src/admin/Analytics.jsx
export default function Analytics() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <p className="text-gray-700 mb-4">
        View platform performance and statistics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-lg">Monthly Sales</h2>
          <p className="text-gray-600">Chart placeholder...</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-lg">Active Users</h2>
          <p className="text-gray-600">Chart placeholder...</p>
        </div>
      </div>
    </div>
  );
}
