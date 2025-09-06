// src/admin/OrdersManagement.jsx
export default function OrdersManagement() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <p className="mb-4 text-gray-700">
        Track and update order statuses across the platform.
      </p>
      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Order ID</th>
            <th className="p-3">Buyer</th>
            <th className="p-3">Product</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3">#1001</td>
            <td className="p-3">Jane Buyer</td>
            <td className="p-3">Laptop</td>
            <td className="p-3 text-yellow-600">Pending</td>
            <td className="p-3 space-x-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
