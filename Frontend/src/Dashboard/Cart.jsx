import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems }) => {
  // Cart functions
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate tax (example 8%)
  const tax = subtotal * 0.08;
  
  // Calculate shipping (free over $100)
  const shipping = subtotal > 100 ? 0 : 15;
  
  // Calculate total
  const total = subtotal + tax + shipping;

  // Function to get product image URL
  const getProductImageUrl = (item) => {
    // Check multiple possible image properties
    return item.imageUrl || item.image_url || item.image || '/placeholder-product.jpg';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <FiShoppingCart className="text-2xl mr-2" />
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        <span className="ml-auto bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full px-3 py-1 text-sm">
          {cartItems.reduce((count, item) => count + item.quantity, 0)} items
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
          <Link
            to="/Buyers/clothes"
            className="inline-block bg-gradient-to-r from-green-500 to-yellow-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Cart Header */}
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 text-sm font-medium text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items List */}
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.color}`} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Product Image and Info */}
                      <div className="flex items-start md:items-center md:w-6/12">
                        <div className="relative">
                          <img
                            src={getProductImageUrl(item)}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded mr-4 border"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                              e.target.classList.add('object-contain', 'p-2');
                            }}
                          />
                          {item.quantity > 1 && (
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          {item.brand && (
                            <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                          )}
                          {item.color && (
                            <p className="text-sm text-gray-600">Color: {item.color}</p>
                          )}
                          {item.size && (
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                          )}
                          {item.category && (
                            <p className="text-xs text-gray-400 capitalize">Category: {item.category}</p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-4 md:mt-0 md:w-2/12 text-center">
                        <span className="md:hidden text-sm text-gray-600 mr-2">Price:</span>
                        <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 md:mt-0 md:w-2/12 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-4 py-2 bg-white min-w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Total and Remove */}
                      <div className="mt-4 md:mt-0 md:w-2/12 flex items-center justify-end space-x-4">
                        <div className="text-right">
                          <span className="font-bold text-lg text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Remove item from cart"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Clear Cart Button */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium transition-colors"
                >
                  <FiTrash2 className="mr-2" />
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/Buyers/clothes"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <FiShoppingCart className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
              
              <div className="space-y-3 mb-6 text-white">
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
                      <span className="text-green-200 font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal < 100 && (
                  <div className="text-sm text-yellow-200 text-center">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="border-t border-white pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <label htmlFor="discount" className="block text-sm font-medium mb-1 text-white">
                  Discount Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="discount"
                    placeholder="Enter code"
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-lg transition-colors font-medium">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/Buyers/checkout"
                className="block w-full text-center bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </Link>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="text-white text-sm flex items-center justify-center">
                  <span className="mr-2">🔒</span>
                  Secure Checkout
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-white">
                <h3 className="text-sm font-medium mb-2 text-white">We Accept</h3>
                <div className="flex space-x-2">
                  <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">VISA</div>
                  <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">MC</div>
                  <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">AMEX</div>
                  <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">PP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;