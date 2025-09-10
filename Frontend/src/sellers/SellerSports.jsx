import React, { useState, useEffect } from "react";

const SellerSports = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "sports",
    subcategory: "T-shirts",
    stock: 0,
    rating: 0,
    isNew: false,
    isBestSeller: false,
    imageUrl: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const API_URL = "http://localhost:5000/api/products";

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      
      if (!res.ok) {
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
      } else if (data && typeof data === 'object') {
        products = [data];
      } else {
        throw new Error("Unexpected API response format");
      }
      
      // Filter products to only include sports category
      const sportsProducts = products.filter(product => 
        product.category && product.category.toLowerCase() === "sports"
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
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchSports();
        resetForm();
      } else {
        throw new Error(`Failed to save: ${res.status}`);
      }
    } catch (error) {
      console.error("Error saving sports item:", error);
      setError(error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id || item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sports item?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSports((prev) => prev.filter((item) => (item._id || item.id) !== id));
      } else {
        throw new Error(`Failed to delete: ${res.status}`);
      }
    } catch (error) {
      console.error("Error deleting sports item:", error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "sports",
      subcategory: "T-shirts",
      stock: 0,
      rating: 0,
      isNew: false,
      isBestSeller: false,
      imageUrl: "",
      description: "",
    });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {editingId ? "Edit Sports Product" : "Add New Sports Product"}
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error: </strong>{error}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Category (fixed) */}
          <div>
            <label className="block mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* SubCategory */}
          <div>
            <label className="block mb-1">Sub Category</label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="T-shirts">T-shirts</option>
              <option value="Football">Football</option>
              <option value="Shoes">Shoes</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-1">Rating (0-5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-4">
            <label>
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
              />{" "}
              New Product
            </label>
            <label>
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
              />{" "}
              Best Seller
            </label>
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Loading sports products...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">SubCategory</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">New</th>
                <th className="border p-2">Best Seller</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sports.length > 0 ? (
                sports.map((item) => (
                  <tr key={item._id || item.id}>
                    <td className="border p-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 object-cover"
                      />
                    </td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">${item.price}</td>
                    <td className="border p-2">{item.subcategory}</td>
                    <td className="border p-2">{item.stock}</td>
                    <td className="border p-2">{item.rating}</td>
                    <td className="border p-2">
                      {item.isNew ? "✅" : "❌"}
                    </td>
                    <td className="border p-2">
                      {item.isBestSeller ? "✅" : "❌"}
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    No sports products found. {error ? "Check your API connection." : "Add some sports products to get started!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerSports;