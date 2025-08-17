import React, { useState, useEffect } from "react";
import Products from "../pages/Products";

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

  // Fetch cosmetics from backend
  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/cosmetics");
        if (!res.ok) throw new Error("Failed to fetch cosmetics");
        const data = await res.json();
        setCosmetics(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCosmetics();
  }, []);

  // Filtered products based on active category
  const filteredProducts =
    activeCategory === "all"
      ? cosmetics
      : cosmetics.filter((p) =>
          p.subCategory?.toLowerCase() === activeCategory.toLowerCase()
        );

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
              className={`flex items-center px-4 py-2 rounded-full transition-all ${
                activeCategory === cat.id
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
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Products
                key={product.id}
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
