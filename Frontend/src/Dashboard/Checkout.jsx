import { useState, useContext, useEffect } from "react";
import {
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// API base URL - adjust this to match your Flask backend URL
const API_BASE_URL = "http://127.0.0.1:5000"; // Default Flask port

const Checkout = ({ cartItems, clearCart }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Kenya",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveInfo: false,
    phoneNumber: "",
    paypillEmail: "",
    paypillPassword: "",
  });

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user && !formData.email && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.first_name || "",
        lastName: user.last_name || ""
      }));
    }
  }, [user, formData.email]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/buyer-login", { 
        state: { 
          message: "Please log in to complete your purchase",
          redirectTo: "/Buyers/checkout"
        } 
      });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Calculate order totals
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

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const createOrder = async (orderData) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending session cookies
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Session expired or not authenticated
          const errorData = await response.json();
          throw new Error(errorData.error || "Authentication failed");
        }
        
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(errorText || "Failed to create order");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep === 1) {
      setActiveStep(2);
      return;
    }
    
    try {
      // Prepare order data for API
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          color: item.color,
          size: item.size
        })),
        subtotal,
        tax,
        shipping,
        total,
        payment_method: paymentMethod,
        shipping_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || user.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        // Payment details based on selected method
        ...(paymentMethod === "card" && {
          card_number: formData.cardNumber,
          card_name: formData.cardName,
          expiry: formData.expiry,
          cvv: formData.cvv
        }),
        ...((paymentMethod === "mpesa" || paymentMethod === "evc") && {
          phone_number: formData.phoneNumber || formData.phone
        }),
        ...(paymentMethod === "paypill" && {
          paypill_email: formData.paypillEmail,
          paypill_password: formData.paypillPassword
        })
      };
      
      console.log("Submitting order:", orderData);
      
      // Send order to backend
      const result = await createOrder(orderData);
      console.log("Order created successfully:", result);
      
      setIsOrderPlaced(true);
      if (clearCart) clearCart();
      
      // Redirect to orders page after a short delay
      setTimeout(() => {
    navigate("/Buyers/order-details", { 
    state: { 
      order: {
        id: result.order.order_number,
        date: result.order.created_at,
        status: result.order.status,
        items: [...cartItems],
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod,
        shippingInfo: orderData.shipping_info
      }
    } 
  });
    }, 2000);

    } catch (error) {
      console.error("Order submission error:", error);
      setError(error.message);
      
      // If authentication error, redirect to login
      if (error.message.includes("authentication") || error.message.includes("authenticated")) {
        navigate("/Buyers/checkout", { 
          state: { 
            message: "Please log in again to complete your order",
            redirectTo: "/Buyers/checkout"
          } 
        });
      }
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
            to="/Buyers/clothes"
            className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
          Continue Shopping
          </Link>
          <Link
            to="/Buyers/order-details"
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
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error: {error}</p>
          <p className="text-sm mt-1">
            {error.includes("authentication") 
              ? "Please log in to complete your order." 
              : "Make sure your Flask backend is running on " + API_BASE_URL}
          </p>
        </div>
      )}
      
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

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("card")}
                    className={`p-3 border rounded-lg text-center ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-lg">💳</div>
                    <span className="text-sm">Credit/Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("mpesa")}
                    className={`p-3 border rounded-lg text-center ${
                      paymentMethod === "mpesa"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-lg">📱</div>
                    <span className="text-sm">M-Pesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("evc")}
                    className={`p-3 border rounded-lg text-center ${
                      paymentMethod === "evc"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-lg">📞</div>
                    <span className="text-sm">EVC Plus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("paypill")}
                    className={`p-3 border rounded-lg text-center ${
                      paymentMethod === "paypill"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-lg">💊</div>
                    <span className="text-sm">PayPill</span>
                  </button>
                </div>
              </div>

              {/* Payment Form Based on Selection */}
              {paymentMethod === "card" && (
                <>
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
                </>
              )}

              {paymentMethod === "mpesa" && (
                <div className="mb-6">
                  <label
                    htmlFor="mpesaNumber"
                    className="block text-sm font-medium mb-1"
                  >
                    M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="mpesaNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="07XX XXX XXX"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    You will receive a prompt on your phone to complete the payment
                  </p>
                </div>
              )}

              {paymentMethod === "evc" && (
                <div className="mb-6">
                  <label
                    htmlFor="evcNumber"
                    className="block text-sm font-medium mb-1"
                  >
                    EVC Plus Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="evcNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="61XX XXX XXX"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    You will receive a prompt on your phone to complete the payment
                  </p>
                </div>
              )}

              {paymentMethod === "paypill" && (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="paypillEmail"
                      className="block text-sm font-medium mb-1"
                    >
                      PayPill Email *
                    </label>
                    <input
                      type="email"
                      id="paypillEmail"
                      name="paypillEmail"
                      value={formData.paypillEmail}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="paypillPassword"
                      className="block text-sm font-medium mb-1"
                    >
                      PayPill Password *
                    </label>
                    <input
                      type="password"
                      id="paypillPassword"
                      name="paypillPassword"
                      value={formData.paypillPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {paymentMethod === "card" && (
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
              )}

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
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
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