import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const SellerElectronics = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "electronics",
    subcategory: "smartphone",
    brand: "",
    imageUrl: "",
    stock: 0,
    rating: 0,
    isNew: false,
    isBestSeller: false,
    releaseDate: new Date().toISOString().split("T")[0],
  });

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5000/api/products";

  // ✅ Use the auth context to check authentication
  const { isAuthenticated, user } = useAuth();

  // Fetch products
  const fetchProducts = async () => {
    try {
      // ✅ Check if user is authenticated and is a seller
      if (!isAuthenticated || user?.account_type !== 'seller') {
        console.error("User not authenticated as seller");
        setError("Please login as a seller to manage products");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, {
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized - Please login as seller");
        }
        throw new Error("Failed to fetch products");
      }
      
      const data = await res.json();
      let electronicsData = [];

      if (Array.isArray(data)) {
        electronicsData = data.filter(
          (p) =>
            p.category?.toLowerCase() === "electronics" ||
            (p.subcategory &&
              ["smartphone", "laptop", "television", "audio"].includes(
                p.subcategory.toLowerCase()
              ))
        );
      } else if (data.products && Array.isArray(data.products)) {
        electronicsData = data.products.filter(
          (p) =>
            p.category?.toLowerCase() === "electronics" ||
            (p.subcategory &&
              ["smartphone", "laptop", "television", "audio"].includes(
                p.subcategory.toLowerCase()
              ))
        );
      }

      setProducts(electronicsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
      setError("Failed to fetch products: " + error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.account_type === 'seller') {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check authentication before submitting
    if (!isAuthenticated || user?.account_type !== 'seller') {
      setError("Please login as a seller to manage products");
      return;
    }

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
        releaseDate: formData.releaseDate
      };

      let url = API_URL;
      let method = "POST";
      
      if (editingId) {
        url = `${API_URL}/${editingId}`;
        method = "PUT";
      }

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
        throw new Error(
          editingId ? "Failed to update product" : "Failed to add product"
        );
      }

      const result = await res.json();

      // Refresh product list
      fetchProducts();

      // Reset form
      resetForm();
      setError(null);
    } catch (error) {
      console.error("Error saving product: ", error);
      setError("Error saving product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      price: product.price ? product.price.toString() : "",
      description: product.description || "",
      category: product.category || "electronics",
      subcategory: product.subcategory || product.subCategory || "smartphone",
      brand: product.brand || "",
      imageUrl: product.imageUrl || product.image_url || "",
      stock: product.stock ? product.stock.toString() : "0",
      rating: product.rating || 0,
      isNew: product.isNew || product.is_new || false,
      isBestSeller: product.isBestSeller || product.is_best_seller || false,
      releaseDate:
        product.releaseDate || new Date().toISOString().split("T")[0],
    });
    setEditingId(product.id || product._id);
  };

  const handleDelete = async (id) => {
    // ✅ Check authentication before deleting
    if (!isAuthenticated || user?.account_type !== 'seller') {
      setError("Please login as a seller to manage products");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    
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
        throw new Error("Failed to delete product");
      }
      
      // Refresh product list
      fetchProducts();
      setError(null);
    } catch (error) {
      console.error("Error deleting product: ", error);
      setError("Error deleting product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "electronics",
      subcategory: "smartphone",
      brand: "",
      imageUrl: "",
      stock: 0,
      rating: 0,
      isNew: false,
      isBestSeller: false,
      releaseDate: new Date().toISOString().split("T")[0],
    });
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const categories = [
    { id: "smartphone", name: "Smartphone" },
    { id: "laptop", name: "Laptop" },
    { id: "television", name: "Television" },
    { id: "audio", name: "Audio" },
  ];

  // Function to get image URL from product object
  const getProductImageUrl = (product) => {
    return product.imageUrl || product.image_url || "/default-image.jpg";
  };

  // Show authentication message if user is not logged in as seller
  if (!isAuthenticated || user?.account_type !== 'seller') {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Please login as a seller to access this page
          </h2>
          <p className="text-gray-600">
            You need to be logged in with a seller account to manage electronics products.
          </p>
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-2">Loading electronics products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Electronics Management</h1>

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
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Electronics Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Product Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Brand*</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Price ($)*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                Stock Quantity*
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Category*</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Sub Category*</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                max="5"
                step="0.1"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={loading}
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="text-gray-700">Best Seller</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Image URL*</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image.jpg"
                required
                disabled={loading}
              />
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">
                  Image Preview
                </label>
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

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
                disabled={loading}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3 md:col-span-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Processing..." : (editingId ? "Update Product" : "Add Product")}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">
            Electronics Products ({filteredProducts.length})
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

        {loading && products.length === 0 ? (
          <div className="text-center py-4">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No electronics products found
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
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id || product._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => (e.target.src = "/default-image.jpg")}
                      />
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {product.brand}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 capitalize">
                      {product.subcategory || product.subCategory}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      ${product.price?.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {product.stock}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {product.rating || 0}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isNew && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Bestseller
                          </span>
                        )}
                        {product.stock <= 0 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(product.id || product._id)
                          }
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

export default SellerElectronics;