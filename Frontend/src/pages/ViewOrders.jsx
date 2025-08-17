import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiCheckCircle, FiTruck } from "react-icons/fi";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };
    const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    setOrders(allOrders[user.username] || []);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse flex justify-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">
          You haven't placed any orders with us yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order #{order.id.replace("ORD-", "")}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="mt-4 md:mt-0">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {order.status === "processing" ? (
                      <>
                        <FiClock className="mr-1" />
                        Processing
                      </>
                    ) : order.status === "shipped" ? (
                      <>
                        <FiTruck className="mr-1" />
                        Shipped
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-1" />
                        Delivered
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2">
                  <h3 className="font-medium mb-4">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={`${item.id}-${item.size || ''}-${item.color || ''}`}
                        className="flex items-start"
                      >
                        <img
                          src={item.imageUrl || "/placeholder-product.jpg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          {item.color && (
                            <p className="text-sm text-gray-600">
                              Color: {item.color}
                            </p>
                          )}
                          {item.size && (
                            <p className="text-sm text-gray-600">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                          {order.shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `$${order.shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <address className="text-sm not-italic text-gray-600">
                        {order.shippingInfo.name}
                        <br />
                        {order.shippingInfo.address}
                        <br />
                        {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}
                        <br />
                        {order.shippingInfo.country}
                        <br />
                        <br />
                        <span className="font-medium">Email:</span> {order.shippingInfo.email}
                        <br />
                        <span className="font-medium">Phone:</span> {order.shippingInfo.phone}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              <div className="flex justify-end">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 mr-4">
                  Track Order
                </button>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewOrders;