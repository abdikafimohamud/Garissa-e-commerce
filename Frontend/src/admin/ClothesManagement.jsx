import { useState, useEffect } from 'react';

  const ClothesManagement = () => {
  const [formData, setFormData] = useState({name: '',price: '',description: '',category: 'clothes',subCategory: 'men',imageUrl: '',stock: '',rating: 0,isNew: false,isBestSeller: false});
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const API_URL = 'http://localhost:5000/clothes';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const clothesProducts = data.filter(p => p.category === 'clothes');
        setProducts(clothesProducts);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

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

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating)
    };

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to update product');

        setProducts(products.map(p => p.id === editingId ? { ...p, ...productData } : p));
        setEditingId(null);
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to add product');

        const newProduct = await response.json();
        setProducts([...products, newProduct]);
      }

      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'clothes',
        subCategory: 'men',
        imageUrl: '',
        stock: '',
        rating: 0,
        isNew: false,
        isBestSeller: false
      });
    } catch (error) {
      console.error('Error saving product: ', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      price: product.price.toString(),
      stock: product.stock.toString(),
      rating: product.rating.toString()
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete product');

        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product: ', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Clothes Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Product' : 'Add New Product'}
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
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
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
                <span>New Product</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleInputChange}
                  className="mr-2"
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
                required
              />
            </div>

            {/* ✅ Image Preview */}
            {formData.imageUrl && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Image Preview</label>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover border rounded"
                  onError={(e) => (e.target.style.display = 'none')}
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
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  price: '',
                  description: '',
                  category: 'clothes',
                  subCategory: 'men',
                  imageUrl: '',
                  stock: '',
                  rating: 0,
                  isNew: false,
                  isBestSeller: false
                });
              }}
              className="px-4 py-2 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Clothing Products</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
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
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-2 px-4 border-b">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{product.name}</td>
                    <td className="py-2 px-4 border-b capitalize">
                      {product.subCategory}
                    </td>
                    <td className="py-2 px-4 border-b">${product.price}</td>
                    <td className="py-2 px-4 border-b">{product.stock}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex flex-wrap gap-1">
                        {product.isNew && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">New</span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Bestseller</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
