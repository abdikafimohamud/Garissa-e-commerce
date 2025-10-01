import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const SellerSports = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "sports",
    subcategory: "T-shirts",
    brand: "",
    stock: 0,
    rating: 0,
    isNew: false,
    isBestSeller: false,
    imageUrl: "",
    description: "",
    releaseDate: new Date().toISOString().split("T")[0],
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = "http://localhost:5000/api/products";

  // ✅ Use the auth context to check authentication
  const { isAuthenticated, user } = useAuth();

  const fetchSports = useCallback(async () => {
    try {
      // ✅ Check if user is authenticated and is a seller
      if (!isAuthenticated || user?.account_type !== "seller") {
        console.error("User not authenticated as seller");
        setError("Please login as a seller to manage products");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}?category=sports`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized - Please login as seller");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      // Handle different response formats and filter for sports products
      let products = [];

      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.products)) {
        products = data.products;
      } else if (data && Array.isArray(data.items)) {
        products = data.items;
      } else if (data && typeof data === "object") {
        products = [data];
      } else {
        throw new Error("Unexpected API response format");
      }

      // Filter products to only include sports category
      const sportsProducts = products.filter(
        (product) =>
          product.category?.toLowerCase() === "sports" ||
          (product.subcategory?.toLowerCase &&
            ["t-shirts", "football", "shoes"].includes(
              product.subcategory?.toLowerCase()
            )) ||
          (product.subCategory?.toLowerCase &&
            ["t-shirts", "football", "shoes"].includes(
              product.subCategory?.toLowerCase()
            ))
      );

      setSports(sportsProducts);
      setError(null);
    } catch (error) {
      console.error("Error fetching sports:", error);
      setError(error.message);
      setSports([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.account_type === "seller") {
      fetchSports();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchSports]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check authentication before submitting
    if (!isAuthenticated || user?.account_type !== "seller") {
      setError("Please login as a seller to manage products");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        imageUrl: formData.imageUrl,
        releaseDate: formData.releaseDate,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized - Please login again");
        }
        throw new Error(`Failed to save: ${res.status}`);
      }

      await res.json();
      fetchSports();
      resetForm();
      setError(null);
    } catch (error) {
      console.error("Error saving sports item:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      price: item.price ? item.price.toString() : "",
      category: item.category || "sports",
      subcategory: item.subcategory || "T-shirts",
      brand: item.brand || "",
      stock: item.stock ? item.stock.toString() : "0",
      rating: item.rating || 0,
      isNew: item.isNew || item.is_new || false,
      isBestSeller: item.isBestSeller || item.is_best_seller || false,
      imageUrl: item.imageUrl || item.image_url || "",
      description: item.description || "",
      releaseDate: item.releaseDate || new Date().toISOString().split("T")[0],
    });
    setEditingId(item.id || item._id);
  };

  const handleDelete = async (id) => {
    // ✅ Check authentication before deleting
    if (!isAuthenticated || user?.account_type !== "seller") {
      setError("Please login as a seller to manage products");
      return;
    }

    if (!window.confirm("Delete this sports item?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized - Please login again");
        }
        throw new Error(`Failed to delete: ${res.status}`);
      }

      setSports((prev) => prev.filter((item) => (item.id || item._id) !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting sports item:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "sports",
      subcategory: "T-shirts",
      brand: "",
      stock: 0,
      rating: 0,
      isNew: false,
      isBestSeller: false,
      imageUrl: "",
      description: "",
      releaseDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
  };

  const filteredProducts = sports.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { id: "T-shirts", name: "T-shirts" },
    { id: "Football", name: "Football" },
    { id: "Shoes", name: "Shoes" },
  ];

  // Function to get image URL from product object
  const getProductImageUrl = (product) => {
    return product.imageUrl || product.image_url || "/default-image.jpg";
  };

  // Show authentication message if user is not logged in as seller
  if (!isAuthenticated || user?.account_type !== "seller") {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Please login as a seller to access this page
          </h2>
          <p className="text-gray-600">
            You need to be logged in with a seller account to manage sports
            products.
          </p>
        </div>
      </div>
    );
  }

  if (loading && sports.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-2">Loading sports products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Sports Management</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error: </strong>
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Sports Product" : "Add New Sports Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 mb-1">Product Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={loading}
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-gray-700 mb-1">Brand*</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={loading}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 mb-1">Price ($)*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-gray-700 mb-1">Stock Quantity*</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              min="0"
              required
              disabled={loading}
            />
          </div>

          {/* Category (fixed) */}
          <div>
            <label className="block text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
              disabled={loading}
            />
          </div>

          {/* SubCategory */}
          <div>
            <label className="block text-gray-700 mb-1">Sub Category*</label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700 mb-1">Rating (0-5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={loading}
            />
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-gray-700 mb-1">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={loading}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="mr-2"
                disabled={loading}
              />
              <span className="text-gray-700">New Product</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="mr-2"
                disabled={loading}
              />
              <span className="text-gray-700">Best Seller</span>
            </label>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Image URL*</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="https://example.com/image.jpg"
              required
              disabled={loading}
            />
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Image Preview</label>
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover border rounded"
                onError={(e) => {
                  e.target.src = "/default-image.jpg";
                }}
              />
            </div>
          )}

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">
            Sports Products ({filteredProducts.length})
          </h2>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
        </div>

        {loading && sports.length === 0 ? (
          <div className="text-center py-4">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No sports products found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <img
                        src={getProductImageUrl(item)}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/default-image.jpg";
                        }}
                      />
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {item.brand}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 capitalize">
                      {item.subcategory}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      ${item.price}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {item.stock}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {item.rating || 0}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.isNew && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                        {item.isBestSeller && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Bestseller
                          </span>
                        )}
                        {item.stock <= 0 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id || item._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSports;
