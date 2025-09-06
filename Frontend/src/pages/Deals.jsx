import React, { useState, useEffect } from 'react';

const Deals = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  // Sample deals data
  const deals = [
    {
      id: 1,
      title: 'Summer Electronics Sale',
      discount: '50% OFF',
      description: 'On all smartphones and tablets',
      originalPrice: '$999',
      discountedPrice: '$499',
      image: '📱',
      expiration: '2023-08-15',
      itemsSold: 124,
      totalItems: 200,
      tag: 'HOT DEAL',
      tagColor: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Fashion Flash Sale',
      discount: 'BUY 2 GET 1 FREE',
      description: 'On selected clothing items',
      originalPrice: '$120',
      discountedPrice: '$80',
      image: '👗',
      expiration: '2023-08-12',
      itemsSold: 78,
      totalItems: 100,
      tag: 'POPULAR',
      tagColor: 'bg-blue-500'
    },
    {
      id: 3,
      title: 'Home & Kitchen Special',
      discount: '60% OFF',
      description: 'Premium kitchen appliances',
      originalPrice: '$450',
      discountedPrice: '$180',
      image: '🏠',
      expiration: '2023-08-20',
      itemsSold: 45,
      totalItems: 150,
      tag: 'LIMITED',
      tagColor: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Weekend Super Sale',
      discount: 'UP TO 70% OFF',
      description: 'Across all categories',
      originalPrice: '$800',
      discountedPrice: '$240',
      image: '🛍️',
      expiration: '2023-08-13',
      itemsSold: 210,
      totalItems: 300,
      tag: 'ENDING SOON',
      tagColor: 'bg-orange-500'
    },
    {
      id: 5,
      title: 'Back to School Offers',
      discount: '40% OFF',
      description: 'On books and stationery',
      originalPrice: '$150',
      discountedPrice: '$90',
      image: '📚',
      expiration: '2023-08-25',
      itemsSold: 89,
      totalItems: 200,
      tag: 'NEW',
      tagColor: 'bg-green-500'
    },
    {
      id: 6,
      title: 'Tech Tuesday Special',
      discount: '55% OFF',
      description: 'Laptops and accessories',
      originalPrice: '$1200',
      discountedPrice: '$540',
      image: '💻',
      expiration: '2023-08-15',
      itemsSold: 67,
      totalItems: 100,
      tag: 'HOT DEAL',
      tagColor: 'bg-red-500'
    }
  ];

  const categories = [
    { name: 'All Deals', count: 24 },
    { name: 'Electronics', count: 8 },
    { name: 'Fashion', count: 5 },
    { name: 'Home & Kitchen', count: 4 },
    { name: 'Books', count: 3 },
    { name: 'Beauty', count: 2 },
    { name: 'Sports', count: 2 }
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { ...prev, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        } else if (days > 0) {
          return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateProgress = (sold, total) => {
    return (sold / total) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Deals & Offers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on our limited-time offers. Grab these deals before they're gone!
          </p>
        </div>

        {/* Mega Deal Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-xl overflow-hidden mb-12 text-white">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="flex items-center mb-4">
                <span className="bg-white text-red-600 text-xs font-semibold px-3 py-1 rounded-full uppercase mr-3">
                  Mega Deal
                </span>
                <span className="text-red-100">Ending soon</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Weekend Flash Sale</h2>
              <p className="text-red-100 mb-4">Up to 70% off on selected items. Hurry up before time runs out!</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
                  <span className="block text-2xl font-bold">{timeRemaining.days}</span>
                  <span className="text-xs">Days</span>
                </div>
                <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
                  <span className="block text-2xl font-bold">{timeRemaining.hours}</span>
                  <span className="text-xs">Hours</span>
                </div>
                <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
                  <span className="block text-2xl font-bold">{timeRemaining.minutes}</span>
                  <span className="text-xs">Mins</span>
                </div>
                <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
                  <span className="block text-2xl font-bold">{timeRemaining.seconds}</span>
                  <span className="text-xs">Secs</span>
                </div>
              </div>
              
              <button className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                Shop Now
              </button>
            </div>
            
            <div className="text-8xl md:text-9xl">
              🔥
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  index === 0
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category.name}
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {deals.map(deal => (
            <div key={deal.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-50 flex justify-between items-start">
                <div className="text-5xl">{deal.image}</div>
                <span className={`${deal.tagColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                  {deal.tag}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">{deal.discountedPrice}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">{deal.originalPrice}</span>
                  <span className="bg-red-100 text-red-800 text-sm font-semibold ml-3 px-2 py-1 rounded">
                    {deal.discount}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Sold: {deal.itemsSold}</span>
                    <span>Available: {deal.totalItems - deal.itemsSold}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${calculateProgress(deal.itemsSold, deal.totalItems)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm">
                    Claim Offer
                  </button>
                  <span className="text-sm text-gray-500">Ends in 2 days</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-lg mb-16">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive offers, limited-time deals, and special promotions.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
            />
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deals Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long do the deals last?</h3>
              <p className="text-gray-600">Most deals are available for a limited time, usually between 24 hours to 7 days. Each deal has its own expiration date.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I combine multiple deals?</h3>
              <p className="text-gray-600">Yes, in most cases you can combine deals unless otherwise specified. The discount will be applied sequentially.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Are there any restrictions?</h3>
              <p className="text-gray-600">Some deals may have restrictions on specific products or categories. Please check the individual deal terms for details.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if a deal sells out?</h3>
              <p className="text-gray-600">Popular deals may sell out quickly. We recommend claiming offers as soon as possible to avoid disappointment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;