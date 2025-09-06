import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import Products from "../pages/Buyers";

const Clothes = ({ addToCart }) => {
  // ⬅ remove products from props
  const [clothes, setClothes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all"); // default category
  const [priceFilter, setPriceFilter] = useState("all"); // default price filter

  // Fetch clothes from backend
  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const res = await fetch("http://localhost:5000/clothes"); // ⬅ backend endpoint
        if (!res.ok) throw new Error("Failed to fetch clothes");
        const data = await res.json();
        setClothes(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClothes();
  }, []);

  // Memoized filters for better performance
  const [allClothes, menClothes, womenClothes, childrenClothes] =
    useMemo(() => {
      const clothesItems = clothes.filter(
        (p) => p.category?.toLowerCase() === "clothes"
      );
      return [
        clothesItems,
        clothesItems.filter((p) => p.subCategory?.toLowerCase() === "men"),
        clothesItems.filter((p) => p.subCategory?.toLowerCase() === "women"),
        clothesItems.filter((p) => p.subCategory?.toLowerCase() === "children"),
      ];
    }, [clothes]);

  // Apply active filters
  const filteredProducts = useMemo(() => {
    let filtered = [...allClothes];

    // Category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.subCategory?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Price filter
    switch (priceFilter) {
      case "under50":
        return filtered.filter((p) => p.price < 50);
      case "50to100":
        return filtered.filter((p) => p.price >= 50 && p.price <= 100);
      case "over100":
        return filtered.filter((p) => p.price > 100);
      default:
        return filtered;
    }
  }, [allClothes, activeCategory, priceFilter]);

  const hasCollections =
    activeCategory === "all" &&
    (menClothes.length > 0 ||
      womenClothes.length > 0 ||
      childrenClothes.length > 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Garissa Fashion Collection
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["all", "men", "women", "children"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === cat
                ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white"
                : "bg-red-200 hover:bg-gray-300"
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
            <Products
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            No products match your filters.
          </p>
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
                  <Products
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
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
                  <Products
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
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
                  <Products
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
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
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      category: PropTypes.string,
      subCategory: PropTypes.string,
      rating: PropTypes.number,
      reviews: PropTypes.number,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default Clothes;
