import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ClothesManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "clothes",
    subcategory: "men",
    stock: 0,
    rating: 0,
    isNew: false,
    isBestSeller: false,
    imageUrl: "",
  });
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const API_URL = "http://localhost:5000/api/products";
  
  // ✅ Use the auth context to check authentication
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ Check if user is authenticated and is a seller
        if (!isAuthenticated || user?.account_type !== 'seller') {
          console.error("User not authenticated as seller");
          setError("Please login as a seller to manage products");
          return;
        }

        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/seller/clothes`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized - Please login as seller");
            return;
          }
          throw new Error("Failed to fetch products");
        }
        
        const data = await response.json();
        // Products are already filtered by seller and clothes category from backend
        const clothesProducts = data.products || data || [];
        setProducts(clothesProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setError("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.account_type === 'seller') {
      fetchProducts();
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
      setError("");

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        imageUrl: formData.imageUrl,
      };

      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized - Please login again");
          }
          throw new Error("Failed to update product");
        }

        const updatedProduct = await response.json();
        setProducts(
          products.map((p) =>
            p.id === editingId ? updatedProduct.product : p
          )
        );
        setEditingId(null);
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized - Please login again");
          }
          throw new Error("Failed to add product");
        }

        const newProduct = await response.json();
        setProducts([...products, newProduct.product]);
      }

      // Reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "clothes",
        subcategory: "men",
        stock: 0,
        rating: 0,
        isNew: false,
        isBestSeller: false,
        imageUrl: "",
      });

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
      category: product.category || "clothes",
      subcategory: product.subcategory || "men",
      stock: product.stock ? product.stock.toString() : "0",
      rating: product.rating || 0,
      isNew: product.isNew || product.is_new || false,
      isBestSeller: product.isBestSeller || product.is_best_seller || false,
      imageUrl: product.imageUrl || product.image_url || "",
    });
    setEditingId(product.id || product._id);
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated || user?.account_type !== 'seller') {
      setError("Please login as a seller to manage products");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized - Please login again");
          }
          throw new Error("Failed to delete product");
        }

        setProducts(products.filter((p) => (p.id || p._id) !== id));
      } catch (error) {
        console.error("Error deleting product: ", error);
        setError("Error deleting product: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "clothes",
      subcategory: "men",
      stock: 0,
      rating: 0,
      isNew: false,
      isBestSeller: false,
      imageUrl: "",
    });
  };

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
            You need to be logged in with a seller account to manage products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Clothes Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-4 text-red-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Product Name</label>
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
              <label className="block text-gray-700 mb-2">Price ($)</label>
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
              <label className="block text-gray-700 mb-2">Category</label>
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
              <label className="block text-gray-700 mb-2">Sub Category</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              >
                <option value="men">Men's Wear</option>
                <option value="women">Women's Wear</option>
                <option value="children">Children's Wear</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Stock Quantity</label>
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
              <label className="block text-gray-700 mb-2">Rating (0-5)</label>
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
                <span>New Product</span>
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
                <span>Best Seller</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image.jpg"
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
              <label className="block text-gray-700 mb-2">Description</label>
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
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : (editingId ? "Update Product" : "Add Product")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Current Clothing Products ({products.length})
        </h2>
        
        {loading && products.length === 0 ? (
          <div className="text-center py-4">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No clothing products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Image</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Stock</th>
                  <th className="py-2 px-4 border-b">Rating</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id || product._id}>
                    <td className="py-2 px-4 border-b">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/default-image.jpg";
                        }}
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{product.name}</td>
                    <td className="py-2 px-4 border-b capitalize">
                      {product.subcategory}
                    </td>
                    <td className="py-2 px-4 border-b">${product.price}</td>
                    <td className="py-2 px-4 border-b">{product.stock}</td>
                    <td className="py-2 px-4 border-b">{product.rating || 0}</td>
                    <td className="py-2 px-4 border-b">
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
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600 disabled:opacity-50"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id || product._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        disabled={loading}
                      >
                        Delete
                      </button>
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

export default ClothesManagement;