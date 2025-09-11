import { useState, useEffect } from "react";

const ClothesManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "clothes",
    subcategory: "men",
    image: null,
    stock: "",
    rating: 0,
    isNew: false,
    isBestSeller: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const API_URL = "http://localhost:5000/api/products";
  const UPLOADS_URL = "http://localhost:5000/uploads/";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL, {
          credentials: "include", // Include cookies for session authentication
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const clothesProducts = data.products ? 
          data.products.filter((p) => p.category === "clothes") : 
          data.filter((p) => p.category === "clothes");
        setProducts(clothesProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
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
          method: "PUT",
          body: productData,
          credentials: "include", // Include cookies for session authentication
        });

        if (!response.ok) throw new Error("Failed to update product");

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
          body: productData,
          credentials: "include", // Include cookies for session authentication
        });

        if (!response.ok) throw new Error("Failed to add product");

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
        image: null,
        stock: "",
        rating: 0,
        isNew: false,
        isBestSeller: false,
      });
      setImagePreview(null);
      
      // Reset file input
      document.getElementById("imageInput").value = "";
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Error saving product. Please make sure you're logged in as a seller.");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      price: product.price.toString(),
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      image: null,
    });
    // Show the current image as preview
    setImagePreview(getProductImageUrl(product));
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include", // Include cookies for session authentication
        });

        if (!response.ok) throw new Error("Failed to delete product");

        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product: ", error);
        alert("Error deleting product. Please make sure you're logged in as a seller.");
      }
    }
  };

  // Function to get image URL from product object
  const getProductImageUrl = (product) => {
    // Check if the product has an image_filename (from backend)
    if (product.image_filename) {
      return `${UPLOADS_URL}${product.image_filename}`;
    }
    
    // Check if the product has an image_url (from backend)
    if (product.image_url) {
      return product.image_url;
    }
    
    // Fallback to other possible properties
    return (product.images && product.images[0]) || "/default-image.jpg";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Clothes Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                name="subcategory"
                value={formData.subcategory}
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
              <label className="block text-gray-700 mb-2">Product Image</label>
              <input
                id="imageInput"
                type="file"
                name="image"
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                accept="image/*"
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
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  price: "",
                  description: "",
                  category: "clothes",
                  subcategory: "men",
                  image: null,
                  stock: "",
                  rating: 0,
                  isNew: false,
                  isBestSeller: false,
                });
                setImagePreview(null);
                document.getElementById("imageInput").value = "";
              }}
              className="px-4 py-2 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Current Clothing Products
        </h2>
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
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          // If image fails to load, show a placeholder
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