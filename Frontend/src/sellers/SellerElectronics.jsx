import React, { useState, useEffect } from 'react';

const SellerElectronics = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'electronics',
    subcategory: 'smartphone',
    brand: '',
    imageUrl: '',
    stock: 0,
    rating: 0,
    isNew: false,
    isBestSeller: false,
    releaseDate: new Date().toISOString().split('T')[0]
  });

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'http://localhost:5000/api/products';

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, {
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      let electronicsData = [];

      if (Array.isArray(data)) {
        electronicsData = data.filter(p =>
          (p.category?.toLowerCase() === 'electronics') ||
          (p.subcategory && ['smartphone', 'laptop', 'television', 'audio'].includes(p.subcategory.toLowerCase()))
        );
      } else if (data.products && Array.isArray(data.products)) {
        electronicsData = data.products.filter(p =>
          (p.category?.toLowerCase() === 'electronics') ||
          (p.subcategory && ['smartphone', 'laptop', 'television', 'audio'].includes(p.subcategory.toLowerCase()))
        );
      }

      setProducts(electronicsData);
    } catch (error) {
      console.error('Error fetching products: ', error);
      setError('Failed to fetch products: ' + error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        releaseDate: formData.releaseDate
      };

      if (editingId) {
        // Update product
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to update product');
        await res.json();
      } else {
        // Add product
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to add product');
        await res.json();
      }

      // Refresh product list
      fetchProducts();

      // Reset form
      resetForm();
      setError(null);
    } catch (error) {
      console.error('Error saving product: ', error);
      setError('Error saving product: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price ? product.price.toString() : '',
      description: product.description || '',
      category: product.category || 'electronics',
      subcategory: product.subcategory || product.subCategory || 'smartphone',
      brand: product.brand || '',
      imageUrl: product.imageUrl || product.image_url || '',
      stock: product.stock ? product.stock.toString() : '0',
      rating: product.rating || 0,
      isNew: product.isNew || product.is_new || false,
      isBestSeller: product.isBestSeller || product.is_best_seller || false,
      releaseDate: product.releaseDate || new Date().toISOString().split('T')[0]
    });
    setEditingId(product.id || product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to delete product');
      // Refresh product list
      fetchProducts();
      setError(null);
    } catch (error) {
      console.error('Error deleting product: ', error);
      setError('Error deleting product: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'electronics',
      subcategory: 'smartphone',
      brand: '',
      imageUrl: '',
      stock: 0,
      rating: 0,
      isNew: false,
      isBestSeller: false,
      releaseDate: new Date().toISOString().split('T')[0]
    });
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    (product.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.brand?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const categories = [
    { id: 'smartphone', name: 'Smartphone' },
    { id: 'laptop', name: 'Laptop' },
    { id: 'television', name: 'Television' },
    { id: 'audio', name: 'Audio' }
  ];

  if (loading) {
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
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Product' : 'Add New Electronics Product'}
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
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Stock Quantity*</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleInputChange} 
                className="w-full p-2 border rounded" 
                min="0" 
                required 
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
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3 md:col-span-2">
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingId ? 'Update Product' : 'Add Product'}
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
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No electronics products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id || product._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <img 
                        src={product.imageUrl || product.image_url} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded" 
                        onError={e => e.target.src = '/default-image.jpg'} 
                      />
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{product.brand}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 capitalize">{product.subcategory || product.subCategory}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">${product.price?.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{product.stock}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{product.rating || 0}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isNew && <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">New</span>}
                        {product.isBestSeller && <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Bestseller</span>}
                        {product.stock <= 0 && <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out of Stock</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id || product._id)} 
                          className="text-red-600 hover:text-red-900"
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