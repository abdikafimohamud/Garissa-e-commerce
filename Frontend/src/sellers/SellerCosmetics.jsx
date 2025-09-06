import { useState, useEffect } from 'react';

const SellerCosmetics = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'cosmetics',
    subCategory: 'makeup',
    brand: '',
    imageUrl: '',
    stock: '',
    rating: 0,
    isNew: false,
    isBestSeller: false,
    releaseDate: new Date().toISOString().split('T')[0]
  });

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = 'http://localhost:5000/cosmetics';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const cosmeticsProducts = data.filter(p => p.category === 'cosmetics');
        setProducts(cosmeticsProducts);
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
        category: 'cosmetics',
        subCategory: 'makeup',
        brand: '',
        imageUrl: '',
        stock: '',
        rating: 0,
        isNew: false,
        isBestSeller: false,
        releaseDate: new Date().toISOString().split('T')[0]
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cosmetics Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Product' : 'Add New Cosmetic Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="makeup">Makeup</option>
                <option value="skincare">Skincare</option>
                <option value="haircare">Haircare</option>
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
                required
              />
            </div>
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
          </div>
          <div className="flex justify-end space-x-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    price: '',
                    description: '',
                    category: 'cosmetics',
                    subCategory: 'makeup',
                    brand: '',
                    imageUrl: '',
                    stock: '',
                    rating: 0,
                    isNew: false,
                    isBestSeller: false,
                    releaseDate: new Date().toISOString().split('T')[0]
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">
            Cosmetics Products ({filteredProducts.length})
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
          <p className="text-center py-8 text-gray-500">No products found</p>
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
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{product.brand}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 capitalize">
                      {product.subCategory}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{product.stock}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isNew && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">New</span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Bestseller</span>
                        )}
                        {product.stock <= 0 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out of Stock</span>
                        )}
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
                          onClick={() => handleDelete(product.id)}
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

export default SellerCosmetics;