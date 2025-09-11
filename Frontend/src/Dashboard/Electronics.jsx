import { useState, useEffect } from "react";
import Products from "../pages/Buyers";

const Electronics = ({ addToCart }) => {
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the new public API endpoint with category filter
        const res = await fetch("http://localhost:5000/api/products/public?category=electronics");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // The public API returns products in a structured format
        const electronicsData = data.products || [];
        setElectronicsProducts(electronicsData);
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchElectronics();
  }, []);

  const brands = [
    ...new Set(electronicsProducts.map((p) => p.brand?.trim()).filter(Boolean)),
  ];

  // FIX: Normalize subcategories to handle partial matches
  const normalizeSubCategory = (subCategory) => {
    if (!subCategory) return null;
    const normalized = subCategory.trim().toLowerCase();

    if (normalized.includes("laptop")) return "laptop";
    if (normalized.includes("tv") || normalized.includes("television"))
      return "television";
    if (
      normalized.includes("mobile") ||
      normalized.includes("phone") ||
      normalized.includes("smartphone")
    )
      return "smartphone";
    if (
      normalized.includes("audio") ||
      normalized.includes("speaker") ||
      normalized.includes("headphone")
    )
      return "audio";

    return normalized;
  };

  const filteredProducts = electronicsProducts
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
          return 0;
      }
    });

  const categories = [
    { id: "all", name: "All Electronics", icon: "🛒" },
    { id: "smartphone", name: "Smartphone", icon: "📱" },
    { id: "laptop", name: "Laptop", icon: "💻" },
    { id: "television", name: "Television", icon: "📺" },
    { id: "audio", name: "Audio", icon: "🎧" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading electronics...</p>
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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-800 to-purple-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Premium Electronics</h1>
        <p className="text-xl opacity-90">
          Discover the latest technology designed to simplify and enhance your
          digital life. From faster performance to seamless connectivity, our
          smart, user-friendly tech helps you work, play, and stay protected—
          without the hassle.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${activeCategory === category.id
                    ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-md"
                    : "bg-red text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-72 space-y-6">
            {/* Price Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full range range-primary range-sm"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full range range-primary range-sm"
                />
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
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
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold">
                {categories.find((c) => c.id === activeCategory)?.name}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredProducts.length} products)
                </span>
              </h2>

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
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No electronics products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or browse other categories
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setPriceRange([0, 5000]);
                    setSelectedBrands([]);
                  }}
                  className="btn btn-primary"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Electronics;