import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OrderDetails = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user || !user.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/orders/${user.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (loading) return <div>Loading order history...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (!selectedOrder) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Order History</h2>
        {orders.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed an order yet.
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order #</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">View</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border-b">{order.id}</td>
                  <td className="py-2 px-4 border-b">
                    {order.date ? new Date(order.date).toLocaleString() : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">${order.total}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // Detailed view for selected order
  const order = selectedOrder;
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>
      <p className="text-gray-600 mb-6">
        Placed on: {order.date ? new Date(order.date).toLocaleString() : "N/A"}{" "}
        | Payment Method: {order.paymentMethod}
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
        <p>
          {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
        </p>
        <p>
          {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
          {order.shippingInfo?.state}, {order.shippingInfo?.zip},{" "}
          {order.shippingInfo?.country}
        </p>
        <p>Email: {order.shippingInfo?.email}</p>
        <p>Phone: {order.shippingInfo?.phone}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Products Ordered</h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex items-center py-3 border-b border-gray-100"
            >
              <img
                src={item.imageUrl || "/placeholder-product.jpg"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded mr-3"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-xs text-gray-600">
                  {item.quantity} × ${item.price?.toFixed(2)}
                  {item.color && ` • ${item.color}`}
                  {item.size && ` • ${item.size}`}
                </p>
              </div>
              <span className="text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-3 mt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${order.total?.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          onClick={() => setSelectedOrder(null)}
        >
          Back to Orders
        </button>
        <Link
          to="/Buyers/clothes"
          className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;
