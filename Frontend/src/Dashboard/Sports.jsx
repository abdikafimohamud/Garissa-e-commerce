import React, { useState, useEffect } from "react";
import Products from "../pages/Buyers";

const Sports = ({ addToCart }) => {
  const [sportsProducts, setSportsProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "http://localhost:5000/api/products/public?category=sports"
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const sportsData = data.products || [];
        setSportsProducts(sportsData);
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, [refreshTrigger]);

  const brands = [
    ...new Set(sportsProducts.map((p) => p.brand?.trim()).filter(Boolean)),
  ];

  // Normalize subcategories for sports
  const normalizeSubCategory = (subCategory) => {
    if (!subCategory) return null;
    const normalized = subCategory.trim().toLowerCase();

    // Shoes: match shoes, shoe, sneakers, sneaker, footwear
    if (/shoe|shoes|sneaker|sneakers|footwear/.test(normalized)) return "shoes";

    // T-Shirts: match t-shirt, tshirt, shirt
    if (/t-shirt|tshirt|shirt/.test(normalized)) return "t-shirt";

    // Football: match football, soccer
    if (/football|soccer/.test(normalized)) return "football";

    return normalized;
  };

  const filteredProducts = sportsProducts
    .filter((product) => {
      const categoryMatch =
        activeCategory === "all" ||
        normalizeSubCategory(product.subCategory) === activeCategory ||
        normalizeSubCategory(product.subcategory) === activeCategory;

      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      return categoryMatch && priceMatch && brandMatch;
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
          // Featured - show new and bestseller items first
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return 0;
      }
    });

  const categories = [
    { id: "all", name: "All Sports", icon: "🏆" },
    { id: "t-shirt", name: "T-Shirts", icon: "👕" },
    { id: "shoes", name: "Shoes", icon: "👟" },
    { id: "football", name: "Football", icon: "⚽" },
  ];

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-green-700 to-blue-600 text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Premium Sports Gear</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-semibold text-gray-600">
            Loading sports products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-green-700 to-blue-600 text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Premium Sports Gear</h1>
        </div>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg font-semibold text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Premium Sports Gear</h1>
        <p className="text-xl opacity-90">
          Stay ahead of the game with high-quality sportswear, footwear, and
          accessories. Designed for performance, style, and comfort—so you can
          win both on and off the field.
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
                    ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-md"
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
          {/* Brand Filter Sidebar */}
          {brands.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm hidden md:block w-64">
              <h3 className="font-medium mb-4">Brands</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {brands.map((brand) => (
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
              {selectedBrands.length > 0 && (
                <button
                  onClick={() => setSelectedBrands([])}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear brands
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {categories.find((c) => c.id === activeCategory)?.name}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredProducts.length} products)
                  </span>
                </h2>
                {/* Product Count */}
                <div className="text-gray-600 mt-1">
                  Showing {filteredProducts.length} item
                  {filteredProducts.length !== 1 ? "s" : ""}
                </div>
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
                <div className="text-6xl mb-4">🏃‍♂️</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {sportsProducts.length === 0
                    ? "No sports products available."
                    : "No products match your filters."}
                </h3>
                <p className="text-gray-500 mb-4">
                  {sportsProducts.length === 0
                    ? "Check back later for new arrivals."
                    : "Try adjusting your filters or browse other categories."}
                </p>
                {sportsProducts.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setPriceRange([0, 5000]);
                      setSelectedBrands([]);
                      setSortOption("featured");
                    }}
                    className="btn btn-primary"
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

export default Sports;
