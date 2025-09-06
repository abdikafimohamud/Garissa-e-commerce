// src/admin/ProductsManagement.jsx
export default function ProductsManagement() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      <p className="mb-4 text-gray-700">
        Approve, edit, or remove products listed by sellers.
      </p>
      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Product</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Seller</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3">Laptop</td>
            <td className="p-3">Electronics</td>
            <td className="p-3">$1200</td>
            <td className="p-3">John Seller</td>
            <td className="p-3 space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
