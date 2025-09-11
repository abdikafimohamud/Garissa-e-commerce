import React, { useState, useEffect } from "react";
import Products from "../pages/Buyers";

const Cosmetics = ({ addToCart }) => {
  const [cosmetics, setCosmetics] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: "all", name: "All", icon: "💄" },
    { id: "makeup", name: "Makeup", icon: "💋" },
    { id: "skincare", name: "Skincare", icon: "🧴" },
    { id: "haircare", name: "Haircare", icon: "💆‍♀️" },
  ];

  // Fetch only cosmetics products from backend using the new public API
  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the new public API endpoint with category filter
        const res = await fetch("http://localhost:5000/api/products/public?category=cosmetics");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // The public API returns products in a structured format
        const cosmeticsData = data.products || [];
        setCosmetics(cosmeticsData);
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCosmetics();
  }, []);

  // Filtered products based on active category - ensure it's always an array
  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(cosmetics)) return [];

    return activeCategory === "all"
      ? cosmetics
      : cosmetics.filter(
        (p) => p.subcategory?.toLowerCase() === activeCategory.toLowerCase() ||
          p.subCategory?.toLowerCase() === activeCategory.toLowerCase()
      );
  }, [cosmetics, activeCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-50 to-purple-50 py-16 md:py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Cosmetics Collection
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover premium quality beauty products for your perfect look
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-all ${activeCategory === cat.id
                  ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-md"
                  : "bg-red text-gray-700 hover:bg-red-100"
                }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500">No cosmetics products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Products
                key={product.id || product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cosmetics;