import { useState, useEffect } from "react";
import { FiInfo, FiTruck, FiCheckCircle, FiCreditCard } from "react-icons/fi";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    const aggregatedOrders = [];
    
    // Fixed: Safe iteration and array check
    Object.keys(allOrders).forEach(username => {
      const userOrders = allOrders[username];
      if (Array.isArray(userOrders)) {
        aggregatedOrders.push(...userOrders);
      }
    });
    
    // Sort by date (newest first)
    aggregatedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setOrders(aggregatedOrders);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse flex justify-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-gray-600">
            Customers haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 p-4 bg-gray-50">
                <h2 className="font-semibold">Recent Orders</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className={`border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedOrder?.id === order.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Order #{order.id.replace("ORD-", "")}</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingInfo.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      {order.status === "processing" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FiInfo className="mr-1" /> Processing
                        </span>
                      ) : order.status === "shipped" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FiTruck className="mr-1" /> Shipped
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1" /> Delivered
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Order #{selectedOrder.id.replace("ORD-", "")}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Placed on {new Date(selectedOrder.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {selectedOrder.status === "processing" ? (
                          <>
                            <FiInfo className="mr-1" />
                            Processing
                          </>
                        ) : selectedOrder.status === "shipped" ? (
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Shipping Information */}
                    <div>
                      <h3 className="font-medium mb-4 flex items-center">
                        <FiTruck className="mr-2" />
                        Shipping Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <address className="text-sm not-italic text-gray-600">
                          <p className="font-medium">{selectedOrder.shippingInfo.name}</p>
                          <p>{selectedOrder.shippingInfo.address}</p>
                          <p>
                            {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}{" "}
                            {selectedOrder.shippingInfo.zip}
                          </p>
                          <p>{selectedOrder.shippingInfo.country}</p>
                          <p className="mt-2">
                            <span className="font-medium">Email:</span> {selectedOrder.shippingInfo.email}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span> {selectedOrder.shippingInfo.phone}
                          </p>
                        </address>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h3 className="font-medium mb-4 flex items-center">
                        <FiCreditCard className="mr-2" />
                        Payment Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Card Name:</span> {selectedOrder.paymentInfo?.cardName || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Card Number:</span> **** **** **** {selectedOrder.paymentInfo?.cardLast4 || "****"}
                          </p>
                          <p>
                            <span className="font-medium">Expiry:</span> {selectedOrder.paymentInfo?.expiry || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Order Items</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => (
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
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Order Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>
                            {selectedOrder.shipping === 0 ? (
                              <span className="text-green-600">Free</span>
                            ) : (
                              `$${selectedOrder.shipping.toFixed(2)}`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${selectedOrder.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                          <span>Total</span>
                          <span>${selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center h-full flex items-center justify-center">
                <div>
                  <div className="text-6xl mb-4">📋</div>
                  <h2 className="text-xl font-medium mb-2">Select an order</h2>
                  <p className="text-gray-600">
                    Choose an order from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;