import { useState, useEffect } from 'react';

const SellerCosmetics = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'cosmetics',
    subcategory: 'makeup',
    brand: '',
    image: null,
    stock: '',
    rating: 0,
    isNew: false,
    isBestSeller: false,
    releaseDate: new Date().toISOString().split('T')[0]
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:5000/api/products';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL, {
          credentials: "include", // Include cookies for session authentication
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();

        // Handle different response formats
        let cosmeticsProducts = [];
        if (Array.isArray(data)) {
          cosmeticsProducts = data.filter(p => p.category === 'cosmetics');
        } else if (data.products && Array.isArray(data.products)) {
          cosmeticsProducts = data.products.filter(p => p.category === 'cosmetics');
        }

        setProducts(cosmeticsProducts);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        [name]: file,
      });

      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("price", parseFloat(formData.price));
    productData.append("description", formData.description);
    productData.append("category", formData.category);
    productData.append("subcategory", formData.subcategory);
    productData.append("brand", formData.brand);
    productData.append("stock", parseInt(formData.stock));
    productData.append("rating", parseFloat(formData.rating));
    productData.append("isNew", formData.isNew);
    productData.append("isBestSeller", formData.isBestSeller);

    if (formData.image) {
      productData.append("image", formData.image);
    }

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          body: productData,
          credentials: "include",
        });

        if (!response.ok) throw new Error('Failed to update product');

        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === editingId ? updatedProduct.product : p));
        setEditingId(null);
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: productData,
          credentials: "include",
        });

        if (!response.ok) throw new Error('Failed to add product');

        const newProduct = await response.json();
        setProducts([...products, newProduct.product]);
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'cosmetics',
        subcategory: 'makeup',
        brand: '',
        image: null,
        stock: '',
        rating: 0,
        isNew: false,
        isBestSeller: false,
        releaseDate: new Date().toISOString().split('T')[0]
      });
      setImagePreview(null);

      // Reset file input
      document.getElementById("imageInput").value = "";
    } catch (error) {
      console.error('Error saving product: ', error);
      alert('Error saving product: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      price: product.price.toString(),
      stock: product.stock.toString(),
      rating: product.rating.toString()
    });
    setEditingId(product.id || product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          credentials: "include",
        });

        if (!response.ok) throw new Error('Failed to delete product');

        setProducts(products.filter(p => (p.id || p._id) !== id));
      } catch (error) {
        console.error('Error deleting product: ', error);
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function to get image URL from product object
  const getProductImageUrl = (product) => {
    // Check if the product has an image_filename (from backend)
    if (product.image_filename) {
      return `http://localhost:5000/uploads/${product.image_filename}`;
    }

    // Check if the product has an image_url (from backend)
    if (product.image_url) {
      return product.image_url;
    }

    // Fallback to other possible properties
    return (product.images && product.images[0]) || "/default-image.jpg";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

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
                name="subcategory"
                value={formData.subcategory}
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
              <label className="block text-gray-700 mb-1">Product Image*</label>
              <input
                id="imageInput"
                type="file"
                name="image"
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                accept="image/*"
                required
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">
                  Image Preview
                </label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover border rounded"
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
                    subcategory: 'makeup',
                    brand: '',
                    image: null,
                    stock: '',
                    rating: 0,
                    isNew: false,
                    isBestSeller: false,
                    releaseDate: new Date().toISOString().split('T')[0]
                  });
                  setImagePreview(null);
                  document.getElementById("imageInput").value = "";
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
                  <tr key={product.id || product._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{product.brand}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 capitalize">
                      {product.subcategory || product.subCategory}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">${product.price?.toFixed(2)}</td>
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

export default SellerCosmetics;