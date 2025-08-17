import { useState } from "react";
import {
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Checkout = ({ cartItems, clearCart }) => {
  


  // Simulate logged-in user (replace with your auth later)
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Guest",
  };

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Kenya", // Changed default to Kenya
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveInfo: false,
  });

  // Calculate order totals (same as in Cart.jsx)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      setActiveStep(2);
    } else {
      // Create order object
      const order = {
        id: `ORD-${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toISOString(),
        status: "processing",
        items: [...cartItems], // Create a copy of cart items
        subtotal,
        tax,
        shipping,
        total,
        shippingInfo: { 
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
      };

      // Get all orders from localStorage
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};

      // Ensure user has their own order list
      if (!allOrders[user.username]) {
        allOrders[user.username] = [];
      }

      // Add new order to user's orders
      allOrders[user.username].unshift(order);

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(allOrders));

      setIsOrderPlaced(true);
      clearCart();
      // REMOVED THE AUTOMATIC REDIRECTION
    }
  };

  if (cartItems.length === 0 && !isOrderPlaced) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">There's nothing to checkout</p>
        <Link
          to="/products"
          className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <FiCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Thank you for your purchase. Your order has been received and is being
          processed. You'll receive a confirmation email shortly.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
             to="/orders"
            className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Checkout Progress */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-500 to-yellow-500 -z-10 transition-all duration-300"
          style={{ width: `${activeStep === 1 ? "50%" : "100%"}` }}
        ></div>

        <div
          className={`flex flex-col items-center ${
            activeStep >= 1 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activeStep >= 1 ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className="mt-2 text-sm">Shipping</span>
        </div>

        <div
          className={`flex flex-col items-center ${
            activeStep >= 2 ? "bg-gradient-to-r from-green-500 to-yellow-500" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activeStep >= 2 ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className="mt-2 text-sm">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {activeStep === 1 ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FiMapPin className="mr-2" />
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
  
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
  
                <div className="mb-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-1"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-1"
                    >
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium mb-1"
                    >
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
  
                <div className="mb-6">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-1"
                  >
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Kenya">Kenya</option>
                    <option value="Somalia">Somalia</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Ethiopia">Ethiopia</option>
                  </select>
                </div>
  
                <div className="flex justify-between items-center mt-8">
                  <Link
                    to="/cart"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FiArrowLeft className="mr-1" />
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-gradient-to-r from-green-500 to-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <FiCreditCard className="mr-2" />
                  Payment Information
                </h2>
  
                <div className="mb-6">
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium mb-1"
                  >
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
  
                <div className="mb-6">
                  <label
                    htmlFor="cardName"
                    className="block text-sm font-medium mb-1"
                  >
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="expiry"
                      className="block text-sm font-medium mb-1"
                    >
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium mb-1"
                    >
                      CVV *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
  
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="saveInfo"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Save payment information for next time
                  </label>
                </div>
  
                <div className="flex justify-between items-center mt-8">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FiArrowLeft className="mr-1" />
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
  
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
  
              <div className="mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center py-3 border-b border-gray-100"
                  >
                    <img
                      src={item.imageUrl || "/placeholder-product.jpg"}
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-xs text-gray-600">
                        {item.quantity} × ${item.price.toFixed(2)}
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
  
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
  
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                <p>Free shipping on orders over $100. All prices include tax.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Checkout;