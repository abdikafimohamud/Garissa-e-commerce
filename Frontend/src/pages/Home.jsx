import React, { useState } from "react";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiStar, FiChevronRight } from "react-icons/fi";
import { FaShippingFast, FaShieldAlt, FaUndo, FaHeadset } from "react-icons/fa";

// Product Card Component
const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FiShoppingCart className="text-lg" />
        </button>
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            New
          </span>
        )}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.category}</p>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-red-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <FiShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Category Section Component
const CategorySection = ({ title, products, addToCart }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">{title}</h3>
        {products.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            {showAll ? "Show Less" : "See More"}
            <FiChevronRight className="ml-1" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

// Main Home Component
const Home = ({ addToCart }) => {
  // Hardcoded products data
  const clothes = [
    {
      id: 1,
      name: "Men's Cotton Plaid Long Sleeve Shirt",
      category: "Men's Clothing",
      price: 39.99,
      originalPrice: 56.99,
      rating: 4.5,
      reviews: 696,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 2,
      name: "Women's Summer Floral Dress",
      category: "Women's Clothing",
      price: 45.99,
      originalPrice: 59.99,
      rating: 4.7,
      reviews: 1245,
      image: "https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 20,
    },
    {
      id: 3,
      name: "Denim Jacket with Hood",
      category: "Men's Clothing",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.3,
      reviews: 487,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      name: "Women's Running Shoes",
      category: "Women's Footwear",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.8,
      reviews: 2103,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
      discount: 25,
    },
    {
      id: 17,
      name: "Men's Casual T-Shirt Pack",
      category: "Men's Clothing",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.4,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 25,
    },
    {
      id: 18,
      name: "Women's Winter Coat",
      category: "Women's Clothing",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 19,
      name: "Men's Formal Suit",
      category: "Men's Clothing",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.7,
      reviews: 324,
      image: "https://images.unsplash.com/photo-1598808503746-f34cfb6c2524?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 20,
    },
    {
      id: 20,
      name: "Women's Leather Handbag",
      category: "Accessories",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.8,
      reviews: 1204,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
  ];

  const electronics = [
    {
      id: 5,
      name: "Wireless Bluetooth Headphones",
      category: "Audio",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.6,
      reviews: 3452,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 20,
    },
    {
      id: 6,
      name: "Smart Watch Series 5",
      category: "Wearables",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.7,
      reviews: 1896,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 7,
      name: "Premium Smartphone X",
      category: "Mobile",
      price: 899.99,
      originalPrice: 999.99,
      rating: 4.9,
      reviews: 4205,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 8,
      name: "4K Ultra HD Smart TV",
      category: "Television",
      price: 699.99,
      originalPrice: 899.99,
      rating: 4.5,
      reviews: 1567,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 22,
    },
    {
      id: 21,
      name: "Gaming Laptop Pro",
      category: "Computers",
      price: 1299.99,
      originalPrice: 1499.99,
      rating: 4.8,
      reviews: 876,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 22,
      name: "Wireless Earbuds",
      category: "Audio",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 2109,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 25,
    },
    {
      id: 23,
      name: "Digital Camera DSLR",
      category: "Photography",
      price: 499.99,
      originalPrice: 599.99,
      rating: 4.7,
      reviews: 654,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 24,
      name: "Tablet Pro 10.5 inch",
      category: "Tablets",
      price: 399.99,
      originalPrice: 499.99,
      rating: 4.6,
      reviews: 987,
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 20,
    },
  ];

  const cosmetics = [
    {
      id: 9,
      name: "Luxury Skincare Set",
      category: "Skincare",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.8,
      reviews: 987,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 10,
      name: "Matte Lipstick Collection",
      category: "Makeup",
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.6,
      reviews: 2453,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 30,
    },
    {
      id: 11,
      name: "Anti-Aging Serum",
      category: "Skincare",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.7,
      reviews: 1678,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 12,
      name: "Professional Makeup Brushes",
      category: "Tools",
      price: 45.99,
      originalPrice: 65.99,
      rating: 4.9,
      reviews: 3120,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 30,
    },
    {
      id: 25,
      name: "Vitamin C Face Cream",
      category: "Skincare",
      price: 42.99,
      originalPrice: 52.99,
      rating: 4.5,
      reviews: 876,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 26,
      name: "Eyeshadow Palette",
      category: "Makeup",
      price: 38.99,
      originalPrice: 49.99,
      rating: 4.7,
      reviews: 1543,
      image: "https://images.unsplash.com/photo-1532417342369-277b9a3a3d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 22,
    },
    {
      id: 27,
      name: "Facial Cleansing Brush",
      category: "Tools",
      price: 35.99,
      originalPrice: 45.99,
      rating: 4.4,
      reviews: 765,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 28,
      name: "Perfume Luxury Edition",
      category: "Fragrance",
      price: 89.99,
      originalPrice: 109.99,
      rating: 4.8,
      reviews: 987,
      image: "https://images.unsplash.com/photo-1595425970377-2f8ded7c7b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 18,
    },
  ];

  const sports = [
    {
      id: 13,
      name: "Professional Yoga Mat",
      category: "Fitness",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviews: 1896,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 14,
      name: "Running Shoes - Men's",
      category: "Footwear",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.6,
      reviews: 2789,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 25,
    },
    {
      id: 15,
      name: "Dumbbell Set 20kg",
      category: "Strength Training",
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.7,
      reviews: 956,
      image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 16,
      name: "Waterproof Fitness Tracker",
      category: "Wearables",
      price: 69.99,
      originalPrice: 89.99,
      rating: 4.5,
      reviews: 1678,
      image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 22,
    },
    {
      id: 29,
      name: "Cycling Helmet",
      category: "Accessories",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.6,
      reviews: 543,
      image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    },
    {
      id: 30,
      name: "Resistance Bands Set",
      category: "Fitness",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.4,
      reviews: 876,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 25,
    },
    {
      id: 31,
      name: "Basketball Shoes",
      category: "Footwear",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.7,
      reviews: 654,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 32,
      name: "Yoga Accessories Kit",
      category: "Fitness",
      price: 45.99,
      originalPrice: 59.99,
      rating: 4.5,
      reviews: 432,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      discount: 23,
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Products" },
    { id: "clothing", name: "Clothing" },
    { id: "electronics", name: "Electronics" },
    { id: "cosmetics", name: "Cosmetics" },
    { id: "sports", name: "Sports" },
  ];

  const allProducts = [...clothes, ...electronics, ...cosmetics, ...sports];

  const filteredProducts =
    activeCategory === "all"
      ? allProducts
      : activeCategory === "clothing"
        ? clothes
        : activeCategory === "electronics"
          ? electronics
          : activeCategory === "cosmetics"
            ? cosmetics
            : sports;

  return (
    <div className="w-full">
   {/* Updated Hero Section with Background Image */}
      <section className="relative mb-12" style={{ minHeight: '75vh' }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Elevate Your Style</h1>
            <p className="text-xl md:text-2xl mb-8 font-light">Discover curated collections that blend quality, comfort, and contemporary design</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-10 rounded-full transition duration-300 text-lg">
                Shop Collection
              </button>
              <button className="bg-transparent hover:bg-white hover:text-gray-900 text-white font-semibold py-4 px-10 rounded-full transition duration-300 text-lg border border-white">
                Explore Deals
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center">
                <div className="text-3xl font-bold mr-2">2K+</div>
                <div className="text-sm">Premium Products</div>
              </div>
              <div className="flex items-center">
                <div className="text-3xl font-bold mr-2">98%</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="flex items-center">
                <div className="text-3xl font-bold mr-2">5★</div>
                <div className="text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center p-4 bg-white rounded-lg shadow">
            <div className="mr-4 text-red-500">
              <FaShippingFast className="text-3xl" />
            </div>
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow">
            <div className="mr-4 text-red-500">
              <FaUndo className="text-3xl" />
            </div>
            <div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-gray-600">30 days return policy</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow">
            <div className="mr-4 text-red-500">
              <FaShieldAlt className="text-3xl" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-gray-600">Safe & encrypted</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow">
            <div className="mr-4 text-red-500">
              <FaHeadset className="text-3xl" />
            </div>
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-600">Dedicated support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Navigation */}
      <section className="container mx-auto px-4 mb-10">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium ${activeCategory === category.id
                  ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Category Sections */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>

        {/* Clothing */}
        <CategorySection title="Clothing" products={clothes} addToCart={addToCart} />

        {/* Electronics */}
        <CategorySection title="Electronics" products={electronics} addToCart={addToCart} />

        {/* Cosmetics */}
        <CategorySection title="Cosmetics" products={cosmetics} addToCart={addToCart} />

        {/* Sports */}
        <CategorySection title="Sports & Fitness" products={sports} addToCart={addToCart} />
      </section>

      

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Use Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our platform offers tailored experiences for both buyers and sellers with dedicated dashboards. Explore how each sidebar helps you navigate and manage your activities.</p>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            <div className="bg-blue-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <i className="fas fa-shopping-cart text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Buyers</h3>
              </div>
              <p className="text-gray-700 mb-6">The buyer sidebar provides easy access to shopping features, order tracking, and account management.</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-blue-600 font-bold block w-6 h-6 text-center">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Products</h4>
                    <p className="text-gray-600">Explore our catalog with advanced filtering options.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-blue-600 font-bold block w-6 h-6 text-center">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Manage Cart & Orders</h4>
                    <p className="text-gray-600">Track your purchases and review order history.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-blue-600 font-bold block w-6 h-6 text-center">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Save Favorites</h4>
                    <p className="text-gray-600">Create wishlists of products you love.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-blue-600 font-bold block w-6 h-6 text-center">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Account Settings</h4>
                    <p className="text-gray-600">Update your profile and payment methods.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 text-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  Buyer Sidebar Overview
                </h4>
                <div className="flex flex-wrap items-center text-sm gap-4">
                  <div className="flex items-center">
                    <i className="fas fa-search mr-1 text-blue-300"></i>
                    <span>Search</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-heart mr-1 text-blue-300"></i>
                    <span>Wishlist</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-history mr-1 text-blue-300"></i>
                    <span>Order History</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-cog mr-1 text-blue-300"></i>
                    <span>Settings</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-purple-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <i className="fas fa-store text-purple-600 text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Sellers</h3>
              </div>
              <p className="text-gray-700 mb-6">The seller dashboard provides tools to manage your inventory, track sales, and grow your business.</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-purple-600 font-bold block w-6 h-6 text-center">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Product Management</h4>
                    <p className="text-gray-600">Add, edit, and organize your product listings.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-purple-600 font-bold block w-6 h-6 text-center">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Order Fulfillment</h4>
                    <p className="text-gray-600">Process orders and update shipping status.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-purple-600 font-bold block w-6 h-6 text-center">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sales Analytics</h4>
                    <p className="text-gray-600">View reports and track your business performance.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4 mt-1 shadow-sm">
                    <span className="text-purple-600 font-bold block w-6 h-6 text-center">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Store Customization</h4>
                    <p className="text-gray-600">Personalize your storefront and branding.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 text-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  Seller Sidebar Overview
                </h4>
                <div className="flex flex-wrap items-center text-sm gap-4">
                  <div className="flex items-center">
                    <i className="fas fa-chart-line mr-1 text-purple-300"></i>
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-box mr-1 text-purple-300"></i>
                    <span>Inventory</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clipboard-list mr-1 text-purple-300"></i>
                    <span>Orders</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-chart-pie mr-1 text-purple-300"></i>
                    <span>Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Connecting Content Across Our Platform</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our platform seamlessly connects buyer and seller experiences, creating a cohesive ecosystem for commerce.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">How Content Flows Between Buyers and Sellers</h3>
                  <p className="text-gray-700 mb-6">Our platform creates a symbiotic relationship between buyers and sellers, with content and data flowing seamlessly between both experiences.</p>

                  <div className="space-y-4">
                    <div className="flex">
                      <div className="bg-white rounded-lg p-3 shadow-sm mr-4">
                        <i className="fas fa-sync-alt text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Real-time Inventory Updates</h4>
                        <p className="text-gray-600">Seller product changes instantly reflect in buyer search results.</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="bg-white rounded-lg p-3 shadow-sm mr-4">
                        <i className="fas fa-bell text-purple-600"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Order Notifications</h4>
                        <p className="text-gray-600">Buyer purchases immediately trigger seller notifications.</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="bg-white rounded-lg p-3 shadow-sm mr-4">
                        <i className="fas fa-comments text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Direct Messaging</h4>
                        <p className="text-gray-600">Buyers and sellers can communicate directly through our secure messaging system.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Integrated Dashboard Features</h3>
                  <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <i className="fas fa-chart-line text-purple-600 mr-2"></i>
                      Shared Analytics
                    </h4>
                    <p className="text-gray-600">Sellers see what buyers are searching for, while buyers get personalized recommendations based on seller inventory.</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <i className="fas fa-shield-alt text-blue-600 mr-2"></i>
                      Unified Security
                    </h4>
                    <p className="text-gray-600">A single account system protects both buyer and seller data with bank-level encryption and two-factor authentication.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Platform Integration Workflow</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-3 shadow-md mb-2">
                      <i className="fas fa-search text-blue-600 text-xl"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Buyer Searches</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-arrow-right text-gray-400 mx-2"></i>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-3 shadow-md mb-2">
                      <i className="fas fa-database text-purple-600 text-xl"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Platform Matches</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-arrow-right text-gray-400 mx-2"></i>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-3 shadow-md mb-2">
                      <i className="fas fa-box-open text-blue-600 text-xl"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Seller Inventory</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-arrow-right text-gray-400 mx-2"></i>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-3 shadow-md mb-2">
                      <i className="fas fa-cart-plus text-purple-600 text-xl"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Purchase Made</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of buyers and sellers already using our platform to create meaningful connections and successful transactions.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="Register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
                <i className="fas fa-shopping-cart mr-2"></i>
                Create Buyer Account
              </a>
              <a href="Register" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
                <i className="fas fa-store mr-2"></i>
                Become a Seller
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-6">Have questions? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a></p>
          </div>
        </div>
      </section>
      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay updated with our latest products, promotions, and exclusive offers. Get 15% off your first order when you subscribe!
          </p>
          <div className="flex flex-col sm:flex-row justify-center max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 rounded-l sm:rounded-r-none sm:rounded-l flex-grow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2 sm:mb-0"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-r sm:rounded-l-none rounded">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;