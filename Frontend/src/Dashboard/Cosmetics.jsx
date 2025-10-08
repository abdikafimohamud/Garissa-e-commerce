import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Products from "../pages/Buyers";

const Cosmetics = () => {
  const { cartItems, setCartItems } = useOutletContext();
  
  // Create addToCart function
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const [cosmetics, setCosmetics] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "http://localhost:5000/api/products/public?category=cosmetics"
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

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
  }, [refreshTrigger]);

  const filteredProducts = cosmetics
    .filter((product) => {
      const categoryMatch =
        activeCategory === "all" ||
        product.subCategory?.trim().toLowerCase() === activeCategory ||
        product.subcategory?.trim().toLowerCase() === activeCategory;

      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      return categoryMatch && brandMatch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
        default:
          return 0;
      }
    });

  const categories = [
    { id: "all", name: "All Cosmetics", icon: "💄" },
    { id: "makeup", name: "Makeup", icon: "💋" },
    { id: "skincare", name: "Skincare", icon: "🧴" },
    { id: "haircare", name: "Haircare", icon: "💆‍♀️" },
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg font-semibold text-gray-600">
            Loading cosmetics products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 min-h-screen">
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-lg font-semibold text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Cosmetics Collection</h1>
        <p className="text-xl opacity-90">
          Discover premium quality beauty products for your perfect look
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Products
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Brand Filter */}
          {selectedBrands.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium mb-4">Brands</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() =>
                        setSelectedBrands((prev) =>
                          prev.includes(brand)
                            ? prev.filter((b) => b !== brand)
                            : [...prev, brand]
                        )
                      }
                      className="checkbox checkbox-primary checkbox-sm mr-3"
                    />
                    <span className="text-sm capitalize">{brand}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setSelectedBrands([])}
                className="mt-3 text-sm text-pink-600 hover:text-pink-800"
              >
                Clear brands
              </button>
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {categories.find((c) => c.id === activeCategory)?.name}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredProducts.length} products)
                  </span>
                </h2>
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="select select-bordered select-sm w-full sm:w-auto"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Products
                    key={product.id || product._id}
                    product={product}
                    addToCart={addToCart}
                    badgeText={
                      product.isNew
                        ? "New"
                        : product.isBestSeller
                        ? "Bestseller"
                        : ""
                    }
                    className="h-[250px]"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-6xl mb-4">💄</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {cosmetics.length === 0
                    ? "No cosmetics products available."
                    : "No products match your filters."}
                </h3>
                <p className="text-gray-500 mb-4">
                  {cosmetics.length === 0
                    ? "Check back later for new arrivals."
                    : "Try adjusting your filters or browse other categories."}
                </p>
                {cosmetics.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSelectedBrands([]);
                      setSortOption("featured");
                    }}
                    className="btn btn-primary bg-pink-600 border-pink-600 hover:bg-pink-700"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cosmetics;
