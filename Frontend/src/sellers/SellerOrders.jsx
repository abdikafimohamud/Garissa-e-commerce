import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/seller/orders", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json().catch((jsonErr) => {
          throw new Error(`Response is not valid JSON: ${jsonErr.message}`);
        });
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateOrderStatus = (orderId, status) => {
    fetch(`/api/seller/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update order status");
        return res.json().catch((jsonErr) => {
          throw new Error(`Response is not valid JSON: ${jsonErr.message}`);
        });
      })
      .then((updatedOrder) => {
        setOrders((orders) =>
          orders.map((order) =>
            order.id === updatedOrder.id
              ? { ...order, status: updatedOrder.status }
              : order
          )
        );
      })
      .catch((err) => setError(err.message));
  };

  const deleteOrder = (orderId) => {
    fetch(`/api/seller/orders/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete order");
        setOrders((orders) => orders.filter((order) => order.id !== orderId));
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

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
            <th className="p-3">Product(s)</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">#{order.id}</td>
                <td className="p-3">{order.buyer_name}</td>
                <td className="p-3">
                  {order.items && order.items.length > 0
                    ? order.items.map((item) => (
                        <div key={item.id}>
                          {item.product_name || item.product_id} (Qty:{" "}
                          {item.quantity})
                        </div>
                      ))
                    : "—"}
                </td>
                <td
                  className={`p-3 text-${
                    order.status === "pending"
                      ? "yellow"
                      : order.status === "approved"
                      ? "green"
                      : "red"
                  }-600`}
                >
                  {order.status}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => updateOrderStatus(order.id, "approved")}
                    disabled={order.status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => updateOrderStatus(order.id, "cancelled")}
                    disabled={order.status === "cancelled"}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => navigate(`/seller/orders/${order.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-600 text-white rounded"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
