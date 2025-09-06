import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const SellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Mock data for seller analytics
  const sellerData = {
    totalRevenue: {
      current: 45280,
      previous: 38250,
      change: 18.4,
      data: [35, 42, 38, 45, 52, 48, 50, 55, 58, 62, 65, 70]
    },
    totalOrders: {
      current: 1245,
      previous: 985,
      change: 26.4,
      data: [85, 78, 92, 105, 98, 110, 115, 120, 130, 135, 140, 145]
    },
    averageOrderValue: {
      current: 136.42,
      previous: 128.75,
      change: 5.96,
      data: [120, 125, 122, 128, 130, 132, 134, 135, 136, 137, 136, 136]
    },
    conversionRate: {
      current: 4.8,
      previous: 3.9,
      change: 23.1,
      data: [3.2, 3.5, 3.8, 4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.75, 4.8, 4.8]
    },
    buyerDemographics: [
      { ageGroup: '18-24', percentage: 18, value: 224 },
      { ageGroup: '25-34', percentage: 32, value: 398 },
      { ageGroup: '35-44', percentage: 24, value: 299 },
      { ageGroup: '45-54', percentage: 15, value: 187 },
      { ageGroup: '55+', percentage: 11, value: 137 }
    ],
    topBuyers: [
      { name: 'John Smith', purchases: 42, value: 5620, location: 'New York' },
      { name: 'Emma Johnson', purchases: 38, value: 4875, location: 'Los Angeles' },
      { name: 'Michael Brown', purchases: 35, value: 4320, location: 'Chicago' },
      { name: 'Sarah Williams', purchases: 31, value: 3985, location: 'Houston' },
      { name: 'David Jones', purchases: 28, value: 3620, location: 'Phoenix' }
    ],
    purchaseCategories: [
      { category: 'Electronics', percentage: 35, value: 15848 },
      { category: 'Fashion', percentage: 25, value: 11320 },
      { category: 'Home & Kitchen', percentage: 20, value: 9056 },
      { category: 'Books', percentage: 12, value: 5434 },
      { category: 'Others', percentage: 8, value: 3622 }
    ],
    buyerActivity: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      newBuyers: [85, 78, 92, 105, 98, 110, 115, 120, 130, 135, 140, 145],
      returningBuyers: [120, 125, 130, 135, 142, 150, 155, 160, 165, 170, 175, 180]
    }
  };

  // Chart options and series for ApexCharts
  const revenueChartOptions = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: true
      },
      toolbar: {
        show: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#3B82F6'],
    xaxis: {
      categories: sellerData.buyerActivity.labels,
    },
    title: {
      text: 'Revenue Growth',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
  };

  const revenueChartSeries = [{
    name: "Revenue",
    data: sellerData.totalRevenue.data.map(val => val * 100)
  }];

  const buyerActivityOptions = {
    chart: {
      height: 350,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ['#10B981', '#3B82F6'],
    xaxis: {
      categories: sellerData.buyerActivity.labels,
    },
    yaxis: {
      title: {
        text: 'Number of Buyers'
      }
    },
    fill: {
      opacity: 1
    },
    title: {
      text: 'New vs Returning Buyers',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " buyers"
        }
      }
    }
  };

  const buyerActivitySeries = [{
    name: 'New Buyers',
    data: sellerData.buyerActivity.newBuyers
  }, {
    name: 'Returning Buyers',
    data: sellerData.buyerActivity.returningBuyers
  }];

  const demographicsOptions = {
    chart: {
      height: 350,
      type: 'pie',
    },
    labels: sellerData.buyerDemographics.map(d => d.ageGroup),
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Buyer Age Demographics',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const demographicsSeries = sellerData.buyerDemographics.map(d => d.percentage);

  const categoriesOptions = {
    chart: {
      height: 350,
      type: 'donut',
    },
    labels: sellerData.purchaseCategories.map(c => c.category),
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Sales by Category',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Sales',
              formatter: function () {
                return '$' + sellerData.totalRevenue.current.toLocaleString();
              }
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const categoriesSeries = sellerData.purchaseCategories.map(c => c.percentage);

  // Function to format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to render mini charts (simplified for this example)
  const renderMiniChart = (data) => {
    const maxValue = Math.max(...data);
    return (
      <div className="flex items-end h-10 mt-2 space-x-px">
        {data.map((value, index) => (
          <div 
            key={index}
            className="flex-1 bg-blue-500 rounded-t"
            style={{ height: `${(value / maxValue) * 100}%` }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Analytics </h1>
          <p className="text-gray-600 mt-1">Track your buyer analytics and sales performance</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'daily' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              onClick={() => setTimeRange('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">${formatNumber(sellerData.totalRevenue.current)}</div>
            <div className={`flex items-center mt-2 ${sellerData.totalRevenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sellerData.totalRevenue.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(sellerData.totalRevenue.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(sellerData.totalRevenue.data)}
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatNumber(sellerData.totalOrders.current)}</div>
            <div className={`flex items-center mt-2 ${sellerData.totalOrders.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sellerData.totalOrders.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(sellerData.totalOrders.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(sellerData.totalOrders.data)}
        </div>

        {/* Average Order Value Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Order Value</h3>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">${sellerData.averageOrderValue.current.toFixed(2)}</div>
            <div className={`flex items-center mt-2 ${sellerData.averageOrderValue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sellerData.averageOrderValue.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(sellerData.averageOrderValue.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(sellerData.averageOrderValue.data)}
        </div>

        {/* Conversion Rate Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Conversion Rate</h3>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{sellerData.conversionRate.current}%</div>
            <div className={`flex items-center mt-2 ${sellerData.conversionRate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sellerData.conversionRate.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(sellerData.conversionRate.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(sellerData.conversionRate.data)}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Growth</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
              View Report
            </button>
          </div>
          <div id="revenue-chart">
            <ReactApexChart 
              options={revenueChartOptions} 
              series={revenueChartSeries} 
              type="line" 
              height={350} 
            />
          </div>
        </div>

        {/* Buyer Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Buyer Activity</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
              View Report
            </button>
          </div>
          <div id="buyer-activity-chart">
            <ReactApexChart 
              options={buyerActivityOptions} 
              series={buyerActivitySeries} 
              type="bar" 
              height={350} 
            />
          </div>
        </div>
      </div>

      {/* Additional Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Demographics Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Buyer Demographics</h2>
          <div id="demographics-chart">
            <ReactApexChart 
              options={demographicsOptions} 
              series={demographicsSeries} 
              type="pie" 
              height={350} 
            />
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales by Category</h2>
          <div id="categories-chart">
            <ReactApexChart 
              options={categoriesOptions} 
              series={categoriesSeries} 
              type="donut" 
              height={350} 
            />
          </div>
        </div>
      </div>

      {/* Top Buyers Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Buyers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellerData.topBuyers.map((buyer, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-semibold text-blue-600">
                            {buyer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{buyer.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{buyer.purchases} orders</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${formatNumber(buyer.value)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="w-full mt-4 text-center text-blue-600 font-medium hover:text-blue-800 py-2">
          View All Buyers →
        </button>
      </div>
    </div>
  );
};

export default SellerAnalytics;