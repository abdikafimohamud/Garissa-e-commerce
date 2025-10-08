// src/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch analytics data from backend
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/admin/analytics/dashboard', {
        withCredentials: true
      });
      
      if (response.data) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Failed to load analytics data</p>
            <button 
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chart options and series for ApexCharts
  const salesChartOptions = {
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
      categories: analyticsData.monthly_data.map(month => month.month),
    },
    title: {
      text: 'Monthly Sales Performance',
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

  const salesChartSeries = [
    {
      name: "Orders",
      data: analyticsData.metrics.total_sales.data
    }
  ];

  const usersChartOptions = {
    chart: {
      height: 350,
      type: 'area',
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
    colors: ['#10B981'],
    xaxis: {
      categories: analyticsData.monthly_data.map(month => month.month),
    },
    title: {
      text: 'User Growth Analysis',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      x: {
        format: 'MMM'
      },
    },
  };

  const usersChartSeries = [
    {
      name: "Active Users",
      data: analyticsData.metrics.active_users.data
    }
  ];

  const orderStatusChartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: analyticsData.order_statuses.map(status => status.status),
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Order Status Distribution',
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
              label: 'Total Orders',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
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

  const orderStatusChartSeries = analyticsData.order_statuses.map(status => status.count);

  // Function to format numbers with commas
  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return `KSh ${formatNumber(Math.round(amount))}`;
  };

  // Function to render mini charts (simplified for this example)
  const renderMiniChart = (data) => {
    if (!data || data.length === 0) return null;
    const maxValue = Math.max(...data);
    if (maxValue === 0) return <div className="h-10 flex items-center text-gray-400 text-sm">No data</div>;
    
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor your platform performance and statistics</p>
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
        {/* Sales Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.metrics.total_sales.current)}</div>
            <div className={`flex items-center mt-2 ${analyticsData.metrics.total_sales.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.metrics.total_sales.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.metrics.total_sales.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.metrics.total_sales.data)}
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.metrics.active_users.current)}</div>
            <div className={`flex items-center mt-2 ${analyticsData.metrics.active_users.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.metrics.active_users.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.metrics.active_users.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.metrics.active_users.data)}
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.metrics.revenue.current)}</div>
            <div className={`flex items-center mt-2 ${analyticsData.metrics.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.metrics.revenue.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.metrics.revenue.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.metrics.revenue.data)}
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
            <div className="text-3xl font-bold text-gray-900">{analyticsData.metrics.conversion_rate.current}%</div>
            <div className={`flex items-center mt-2 ${analyticsData.metrics.conversion_rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.metrics.conversion_rate.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.metrics.conversion_rate.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.metrics.conversion_rate.data)}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sales Overview</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
              View Report
            </button>
          </div>
          <div id="sales-chart">
            <ReactApexChart 
              options={salesChartOptions} 
              series={salesChartSeries} 
              type="line" 
              height={350} 
            />
          </div>
        </div>

        {/* Users Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Activity</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
              View Report
            </button>
          </div>
          <div id="users-chart">
            <ReactApexChart 
              options={usersChartOptions} 
              series={usersChartSeries} 
              type="area" 
              height={350} 
            />
          </div>
        </div>
      </div>

      {/* Additional Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Status Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status Distribution</h2>
          <div id="order-status-chart">
            {analyticsData.order_statuses.length > 0 ? (
              <ReactApexChart 
                options={orderStatusChartOptions} 
                series={orderStatusChartSeries} 
                type="donut" 
                height={350} 
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <p>No order data available</p>
                  <p className="text-sm">Orders will appear here once placed</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Products</h2>
          <div className="space-y-4">
            {analyticsData.top_products.length > 0 ? (
              analyticsData.top_products.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No product sales data available</p>
                <p className="text-sm">Product sales will appear here once orders are placed</p>
              </div>
            )}
          </div>
          {analyticsData.top_products.length > 0 && (
            <button className="w-full mt-4 text-center text-blue-600 font-medium hover:text-blue-800 py-2">
              View All Products →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}