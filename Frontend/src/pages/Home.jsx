import React, { useState } from "react";
import Products from "../pages/Products";

const Home = ({
  clothes = [],
  electronics = [],
  cosmetics = [],
  sports = [],
  addToCart,
}) => {
  const [clothesFilter, setClothesFilter] = useState("all");
  const [electronicsFilter, setElectronicsFilter] = useState("all");
  const [cosmeticsFilter, setCosmeticsFilter] = useState("all");
  const [sportsFilter, setSportsFilter] = useState("all");

  const filterProducts = (products, category) => {
    if (category === "all") return products;
    return products.filter((p) =>
      p.subCategory?.toLowerCase().includes(category.toLowerCase())
    );
  };

  const clothesTabs = ["all", "men", "women", "children"];
  const electronicsTabs = ["all", "smartphone", "laptop", "television", "audio"];
  const cosmeticsTabs = ["all", "makeup", "skincare", "haircare"];
  const sportsTabs = ["all", "t-shirt", "football", "shoes"];

  const isEmpty = [clothes, electronics, cosmetics, sports].every(
    (arr) => arr.length === 0
  );

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            No Products Available
          </h2>
          <p className="text-gray-600">
            Check back soon for our latest offerings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Featured Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Featured Products
        </h2>

        {/* Shop Clothes Section */}
        {clothes.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Shop Clothes
            </h3>
            {/* Tabs */}
            <div className="flex gap-4 flex-wrap mb-6">
              {clothesTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setClothesFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    clothesFilter === tab
                      ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white"
                      : "bg-red-200 text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {/* Filtered Clothes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterProducts(clothes, clothesFilter).map((product) => (
                <Products
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shop Electronics Section */}
        {electronics.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Shop Electronics
            </h3>
            {/* Tabs */}
            <div className="flex gap-4 flex-wrap mb-6">
              {electronicsTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setElectronicsFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    electronicsFilter === tab
                      ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white"
                      : "bg-red-200 text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {/* Filtered Electronics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterProducts(electronics, electronicsFilter).map((product) => (
                <Products
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shop Cosmetics Section */}
        {cosmetics.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Shop Cosmetics
            </h3>
            {/* Tabs */}
            <div className="flex gap-4 flex-wrap mb-6">
              {cosmeticsTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCosmeticsFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    cosmeticsFilter === tab
                      ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white"
                      : "bg-red-200 text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {/* Filtered Cosmetics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterProducts(cosmetics, cosmeticsFilter).map((product) => (
                <Products
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shop Sports Section */}
        {sports.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Shop Sports
            </h3>
            {/* Tabs */}
            <div className="flex gap-4 flex-wrap mb-6">
              {sportsTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSportsFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    sportsFilter === tab
                      ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white"
                      : "bg-red-200 text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {/* Filtered Sports */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterProducts(sports, sportsFilter).map((product) => (
                <Products
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
