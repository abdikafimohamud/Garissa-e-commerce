const Products = ({ product, addToCart, badgeText }) => {
  const handleAddToCart = () => {
    addToCart(product);
  };

  // Function to get image URL from product object
  const getProductImageUrl = (product) => {
    // Check if the product has an image_filename (from backend)
    if (product.image_filename) {
      return `http://localhost:5000/uploads/${product.image_filename}`;
    }

    // Check if the product has an image_url (from backend)
    if (product.image_url) {
      return product.image_url;
    }

    // Check if the product has imageUrl (legacy)
    if (product.imageUrl) {
      return product.imageUrl;
    }

    // Fallback to other possible properties
    return (product.images && product.images[0]) || "/placeholder-product.jpg";
  };

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center h-full">
      {/* Badge */}
      {badgeText && (
        <span className="self-end bg-blue-600 text-white text-xs px-2 py-1 rounded mb-2">
          {badgeText}
        </span>
      )}

      {/* Product Image */}
      <img
        src={getProductImageUrl(product)}
        alt={product.name || "Product"}
        className="w-full h-48 object-cover rounded mb-4"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/placeholder-product.jpg';
        }}
      />

      {/* Product Name */}
      <h2 className="text-lg font-semibold mb-1 text-center">{product.name}</h2>

      {/* Price */}
      <p className="text-gray-700 mb-3">${product.price.toFixed(2)}</p>

      {/* Rating (if available) */}
      {product.rating && (
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-sm text-yellow-500">
            ({product.reviews})
          </span>
        </div>
      )}


      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-auto bg-gradient-to-r from-red-500 to-yellow-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Products;