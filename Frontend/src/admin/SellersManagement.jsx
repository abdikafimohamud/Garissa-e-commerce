// src/admin/SellersManagement.jsx
export default function SellersManagement() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Sellers</h1>
      <p className="mb-4 text-gray-700">
        View, approve, or remove sellers from the platform.
      </p>
      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3">John Seller</td>
            <td className="p-3">john@example.com</td>
            <td className="p-3 text-green-600">Active</td>
            <td className="p-3 space-x-2">
              <button className="px-3 py-1 bg-yellow-500 text-white rounded">Suspend</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
