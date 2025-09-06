import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Sample categories data with additional properties for filtering
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets and electronic devices',
      icon: '📱',
      items: 1245,
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
      popular: true,
      new: false,
      discount: true,
      products: [
        { id: 101, name: 'Smartphones', count: 342, discount: true },
        { id: 102, name: 'Laptops', count: 198, discount: false },
        { id: 103, name: 'Headphones', count: 287, discount: true },
        { id: 104, name: 'Smart Watches', count: 218, discount: false },
        { id: 105, name: 'Cameras', count: 200, discount: true },
      ]
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Trendy clothes and accessories',
      icon: '👗',
      items: 876,
      color: 'bg-pink-100',
      textColor: 'text-pink-800',
      popular: true,
      new: true,
      discount: false,
      products: [
        { id: 201, name: "Men's Clothing", count: 245, discount: false },
        { id: 202, name: "Women's Clothing", count: 312, discount: true },
        { id: 203, name: 'Shoes', count: 189, discount: false },
        { id: 204, name: 'Accessories', count: 130, discount: true },
      ]
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Everything for your home',
      icon: '🏠',
      items: 932,
      color: 'bg-green-100',
      textColor: 'text-green-800',
      popular: false,
      new: true,
      discount: true,
      products: [
        { id: 301, name: 'Furniture', count: 187, discount: true },
        { id: 302, name: 'Kitchenware', count: 256, discount: false },
        { id: 303, name: 'Decor', count: 289, discount: true },
        { id: 304, name: 'Gardening', count: 200, discount: false },
      ]
    },
    {
      id: 4,
      name: 'Sports',
      description: 'Equipment and apparel',
      icon: '⚽',
      items: 567,
      color: 'bg-orange-100',
      textColor: 'text-orange-800',
      popular: true,
      new: false,
      discount: false,
      products: [
        { id: 401, name: 'Fitness Equipment', count: 145, discount: false },
        { id: 402, name: 'Outdoor Sports', count: 187, discount: true },
        { id: 403, name: 'Team Sports', count: 123, discount: false },
        { id: 404, name: 'Sportswear', count: 112, discount: true },
      ]
    },
    {
      id: 5,
      name: 'Books',
      description: 'Best sellers and classics',
      icon: '📚',
      items: 1203,
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
      popular: false,
      new: true,
      discount: true,
      products: [
        { id: 501, name: 'Fiction', count: 456, discount: true },
        { id: 502, name: 'Non-Fiction', count: 389, discount: false },
        { id: 503, name: 'Children Books', count: 218, discount: true },
        { id: 504, name: 'Educational', count: 140, discount: false },
      ]
    },
    {
      id: 6,
      name: 'Health & Beauty',
      description: 'Products for wellness',
      icon: '💄',
      items: 754,
      color: 'bg-red-100',
      textColor: 'text-red-800',
      popular: true,
      new: false,
      discount: true,
      products: [
        { id: 601, name: 'Skincare', count: 245, discount: true },
        { id: 602, name: 'Makeup', count: 187, discount: false },
        { id: 603, name: 'Vitamins', count: 156, discount: true },
        { id: 604, name: 'Personal Care', count: 166, discount: false },
      ]
    },
    {
      id: 7,
      name: 'Toys',
      description: 'Fun for all ages',
      icon: '🧸',
      items: 432,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      popular: false,
      new: true,
      discount: false,
      products: [
        { id: 701, name: 'Educational Toys', count: 123, discount: false },
        { id: 702, name: 'Action Figures', count: 98, discount: true },
        { id: 703, name: 'Board Games', count: 112, discount: false },
        { id: 704, name: 'Outdoor Toys', count: 99, discount: true },
      ]
    },
    {
      id: 8,
      name: 'Automotive',
      description: 'Car parts and accessories',
      icon: '🚗',
      items: 389,
      color: 'bg-gray-100',
      textColor: 'text-gray-800',
      popular: true,
      new: false,
      discount: true,
      products: [
        { id: 801, name: 'Car Care', count: 123, discount: true },
        { id: 802, name: 'Tools & Equipment', count: 98, discount: false },
        { id: 803, name: 'Interior Accessories', count: 87, discount: true },
        { id: 804, name: 'Exterior Accessories', count: 81, discount: false },
      ]
    }
  ];

  const filters = [
    { id: 'all', name: 'All Categories' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'new', name: 'New Arrivals' },
    { id: 'discount', name: 'Special Offers' }
  ];

  // Filter categories based on active filter and search query
  useEffect(() => {
    let result = categories;
    
    // Apply filter
    if (activeFilter === 'popular') {
      result = result.filter(category => category.popular);
    } else if (activeFilter === 'new') {
      result = result.filter(category => category.new);
    } else if (activeFilter === 'discount') {
      result = result.filter(category => category.discount);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(category => 
        category.name.toLowerCase().includes(query) || 
        category.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredCategories(result);
  }, [activeFilter, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // Render category details view
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={handleBackToCategories}
            className="flex items-center text-blue-600 font-medium mb-6 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Categories
          </button>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className={`p-8 ${selectedCategory.color} flex justify-between items-start`}>
              <div className="flex items-center">
                <span className="text-5xl mr-4">{selectedCategory.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{selectedCategory.name}</h1>
                  <p className="text-gray-700 mt-2">{selectedCategory.description}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedCategory.textColor}`}>
                {selectedCategory.items} items
              </span>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular in {selectedCategory.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {selectedCategory.products.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      {product.discount && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Sale
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{product.count} products</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About {selectedCategory.name}</h3>
                <p className="text-gray-700">
                  Explore our wide selection of {selectedCategory.name.toLowerCase()} products. 
                  We offer high-quality items at competitive prices with fast shipping and excellent customer service.
                  {selectedCategory.discount && " Don't miss our current special offers and discounts!"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md">
              View All {selectedCategory.name} Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main categories view
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our wide range of product categories to find exactly what you're looking for
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap justify-center mb-10 gap-3">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info about active filter */}
        {activeFilter !== 'all' && (
          <div className="mb-6 text-center">
            <p className="text-gray-700">
              Showing {filteredCategories.length} {filters.find(f => f.id === activeFilter)?.name.toLowerCase()}
            </p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map(category => (
            <div 
              key={category.id} 
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer"
              onClick={() => handleCategorySelect(category)}
            >
              <div className={`p-6 ${category.color} flex justify-between items-start`}>
                <div>
                  <span className="text-4xl">{category.icon}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.textColor} mb-2`}>
                    {category.items} items
                  </span>
                  <div className="flex space-x-1">
                    {category.popular && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Popular</span>
                    )}
                    {category.new && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">New</span>
                    )}
                    {category.discount && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Sale</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors">
                  Explore category
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no categories match the filter */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our dedicated team is here to help you find exactly what you need. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
              Contact Support
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Request a Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;