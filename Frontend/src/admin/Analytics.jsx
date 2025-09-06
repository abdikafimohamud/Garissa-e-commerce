// src/admin/Analytics.jsx
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Mock data for demonstration
  const analyticsData = {
    monthlySales: {
      current: 12450,
      previous: 9820,
      change: 26.8,
      data: [65, 59, 80, 81, 56, 55, 72, 68, 75, 80, 85, 90]
    },
    activeUsers: {
      current: 2843,
      previous: 2456,
      change: 15.8,
      data: [1200, 1300, 1450, 1600, 1800, 2000, 2200, 2400, 2600, 2750, 2800, 2843]
    },
    revenue: {
      current: 89234,
      previous: 75620,
      change: 18.0,
      data: [45, 52, 48, 60, 65, 70, 75, 72, 78, 82, 85, 89]
    },
    conversionRate: {
      current: 4.8,
      previous: 3.9,
      change: 23.1,
      data: [2.8, 3.2, 3.5, 3.8, 4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.75, 4.8]
    },
    topProducts: [
      { name: 'Wireless Headphones', sales: 245, revenue: 12250 },
      { name: 'Smart Watch', sales: 198, revenue: 29700 },
      { name: 'Fitness Tracker', sales: 176, revenue: 12320 },
      { name: 'Bluetooth Speaker', sales: 152, revenue: 9120 },
      { name: 'Phone Case', sales: 143, revenue: 4290 }
    ],
    trafficSources: [
      { source: 'Direct', visitors: 1245, percentage: 35 },
      { source: 'Organic Search', visitors: 985, percentage: 28 },
      { source: 'Social Media', visitors: 756, percentage: 21 },
      { source: 'Email', visitors: 345, percentage: 10 },
      { source: 'Referral', visitors: 215, percentage: 6 }
    ]
  };

  // Chart options and series for ApexCharts
  const [salesChartOptions] = useState({
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
  });

  const [salesChartSeries] = useState([
    {
      name: "Sales",
      data: analyticsData.monthlySales.data
    }
  ]);

  const [usersChartOptions] = useState({
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
  });

  const [usersChartSeries] = useState([
    {
      name: "Active Users",
      data: analyticsData.activeUsers.data
    }
  ]);

  const [trafficChartOptions] = useState({
    chart: {
      type: 'donut',
      height: 350
    },
    labels: analyticsData.trafficSources.map(source => source.source),
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Traffic Sources',
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
              label: 'Total Visitors',
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
  });

  const [trafficChartSeries] = useState(
    analyticsData.trafficSources.map(source => source.percentage)
  );

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
            <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">${formatNumber(analyticsData.monthlySales.current)}</div>
            <div className={`flex items-center mt-2 ${analyticsData.monthlySales.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.monthlySales.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.monthlySales.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.monthlySales.data)}
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
            <div className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.activeUsers.current)}</div>
            <div className={`flex items-center mt-2 ${analyticsData.activeUsers.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.activeUsers.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.activeUsers.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.activeUsers.data)}
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
            <div className="text-3xl font-bold text-gray-900">${formatNumber(analyticsData.revenue.current)}</div>
            <div className={`flex items-center mt-2 ${analyticsData.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.revenue.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.revenue.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.revenue.data)}
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
            <div className="text-3xl font-bold text-gray-900">{analyticsData.conversionRate.current}%</div>
            <div className={`flex items-center mt-2 ${analyticsData.conversionRate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.conversionRate.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(analyticsData.conversionRate.change)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
          {renderMiniChart(analyticsData.conversionRate.data)}
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
        {/* Traffic Sources Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Traffic Sources</h2>
          <div id="traffic-chart">
            <ReactApexChart 
              options={trafficChartOptions} 
              series={trafficChartSeries} 
              type="donut" 
              height={350} 
            />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Products</h2>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
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
                  <p className="font-semibold text-gray-900">${formatNumber(product.revenue)}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-blue-600 font-medium hover:text-blue-800 py-2">
            View All Products →
          </button>
        </div>
      </div>
    </div>
  );
}