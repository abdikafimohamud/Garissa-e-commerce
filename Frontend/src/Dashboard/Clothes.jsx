import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import Products from "../pages/Buyers";

const Clothes = ({ addToCart }) => {
  const [clothes, setClothes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch clothes from backend using the new public API
  useEffect(() => {
    const fetchClothes = async () => {
      try {
        setLoading(true);
        // Use the new public API endpoint with category filter
        const res = await fetch("http://localhost:5000/api/products/public?category=clothes");
        if (!res.ok) throw new Error("Failed to fetch clothes");
        const data = await res.json();

        // The public API returns products in a structured format
        const clothesProducts = data.products || [];
        setClothes(clothesProducts);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
        setClothes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, [refreshTrigger]);

  // Memoized filters for better performance
  const [allClothes, menClothes, womenClothes, childrenClothes] =
    useMemo(() => {
      // Ensure clothes is always treated as an array
      const safeClothes = Array.isArray(clothes) ? clothes : [];

      return [
        safeClothes,
        safeClothes.filter((p) =>
          p && p.subCategory && p.subCategory.toLowerCase() === "men"
        ),
        safeClothes.filter((p) =>
          p && p.subCategory && p.subCategory.toLowerCase() === "women"
        ),
        safeClothes.filter((p) =>
          p && p.subCategory && (
            p.subCategory.toLowerCase() === "children" ||
            p.subCategory.toLowerCase() === "kids"
          )
        ),
      ];
    }, [clothes]);

  // Apply active filters
  const filteredProducts = useMemo(() => {
    let filtered = [...allClothes];

    // Category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => {
        if (!p) return false;

        if (activeCategory === "men") {
          return p.subCategory && p.subCategory.toLowerCase() === "men";
        } else if (activeCategory === "women") {
          return p.subCategory && p.subCategory.toLowerCase() === "women";
        } else if (activeCategory === "children") {
          return p.subCategory && (
            p.subCategory.toLowerCase() === "children" ||
            p.subCategory.toLowerCase() === "kids"
          );
        }
        return true;
      });
    }

    // Price filter - ensure price exists and is a number
    switch (priceFilter) {
      case "under50":
        return filtered.filter((p) => p && typeof p.price === "number" && p.price < 50);
      case "50to100":
        return filtered.filter((p) => p && typeof p.price === "number" && p.price >= 50 && p.price <= 100);
      case "over100":
        return filtered.filter((p) => p && typeof p.price === "number" && p.price > 100);
      default:
        return filtered;
    }
  }, [allClothes, activeCategory, priceFilter]);

  const hasCollections =
    activeCategory === "all" &&
    (menClothes.length > 0 ||
      womenClothes.length > 0 ||
      childrenClothes.length > 0);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-8">Garissa Fashion Collection</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-8">Garissa Fashion Collection</h1>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Garissa Fashion Collection
      </h1>

      {/* Refresh Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Products
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["all", "men", "women", "children"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full transition-colors ${activeCategory === cat
                ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            aria-pressed={activeCategory === cat}
            aria-label={`Show ${cat === "all" ? "all" : cat + "'s"} clothing`}
          >
            {cat === "all"
              ? "All Clothing"
              : `${cat.charAt(0).toUpperCase() + cat.slice(1)}'s Wear`}
          </button>
        ))}
      </div>

      {/* Price Filter */}
      <div className="flex justify-center mb-8">
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Filter by price range"
        >
          <option value="all">All Prices</option>
          <option value="under50">Under $50</option>
          <option value="50to100">$50 - $100</option>
          <option value="over100">Over $100</option>
        </select>
      </div>

      {/* Product Count */}
      <div className="text-center text-gray-600 mb-4">
        Showing {filteredProducts.length} item
        {filteredProducts.length !== 1 ? "s" : ""}
      </div>

      {/* Main Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            product && ( // Ensure product exists before rendering
              <Products
                key={product.id || product._id || Math.random()}
                product={product}
                addToCart={addToCart}
              />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            {clothes.length === 0 ? "No products available." : "No products match your filters."}
          </p>
          {clothes.length > 0 && (
            <button
              onClick={() => {
                setActiveCategory("all");
                setPriceFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Category Collections (when viewing 'all') */}
      {hasCollections && (
        <div className="space-y-12 mt-12">
          {menClothes.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                Men's Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {menClothes.map((product) => (
                  product && (
                    <Products
                      key={product.id || product._id || Math.random()}
                      product={product}
                      addToCart={addToCart}
                    />
                  )
                ))}
              </div>
            </section>
          )}

          {womenClothes.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                Women's Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {womenClothes.map((product) => (
                  product && (
                    <Products
                      key={product.id || product._id || Math.random()}
                      product={product}
                      addToCart={addToCart}
                    />
                  )
                ))}
              </div>
            </section>
          )}

          {childrenClothes.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                Children's Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {childrenClothes.map((product) => (
                  product && (
                    <Products
                      key={product.id || product._id || Math.random()}
                      product={product}
                      addToCart={addToCart}
                    />
                  )
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

Clothes.propTypes = {
  addToCart: PropTypes.func.isRequired,
};

export default Clothes;