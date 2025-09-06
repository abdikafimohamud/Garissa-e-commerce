import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar, FiCreditCard, FiDownload, FiFilter, FiArrowUp, FiArrowDown } from "react-icons/fi";
import ReactApexChart from 'react-apexcharts';

const SellerEarnings = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Earnings data
  const earningsData = [
    { month: "Jan", earnings: 1200, orders: 42, growth: 5 },
    { month: "Feb", earnings: 2100, orders: 58, growth: 12 },
    { month: "Mar", earnings: 1800, orders: 51, growth: -8 },
    { month: "Apr", earnings: 2600, orders: 68, growth: 18 },
    { month: "May", earnings: 3000, orders: 75, growth: 15 },
    { month: "Jun", earnings: 4000, orders: 92, growth: 25 },
    { month: "Jul", earnings: 3800, orders: 88, growth: -5 },
    { month: "Aug", earnings: 4200, orders: 95, growth: 10 },
    { month: "Sep", earnings: 4800, orders: 102, growth: 14 },
    { month: "Oct", earnings: 5200, orders: 110, growth: 8 },
    { month: "Nov", earnings: 5700, orders: 118, growth: 9 },
    { month: "Dec", earnings: 6500, orders: 130, growth: 14 },
  ];

  // Recent transactions
  const recentTransactions = [
    { id: '#ORD-7842', customer: 'Sarah Johnson', date: '2023-12-15', amount: 249.99, status: 'completed' },
    { id: '#ORD-7841', customer: 'Michael Brown', date: '2023-12-14', amount: 129.99, status: 'completed' },
    { id: '#ORD-7840', customer: 'Jennifer Wilson', date: '2023-12-14', amount: 89.99, status: 'pending' },
    { id: '#ORD-7839', customer: 'David Miller', date: '2023-12-13', amount: 199.99, status: 'completed' },
    { id: '#ORD-7838', customer: 'Emily Davis', date: '2023-12-12', amount: 159.99, status: 'completed' },
  ];

  // Chart configuration for ApexCharts
  const earningsChartOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: earningsData.map(item => item.month),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return '$' + value;
        },
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return '$' + value;
        }
      }
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    }
  };

  const earningsChartSeries = [{
    name: 'Earnings',
    data: earningsData.map(item => item.earnings)
  }];

  const ordersChartOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    colors: ['#10B981'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: earningsData.map(item => item.month),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    }
  };

  const ordersChartSeries = [{
    name: 'Orders',
    data: earningsData.map(item => item.orders)
  }];

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>
          <p className="text-gray-600">Track your sales performance and earnings</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <FiFilter className="mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-white hover:bg-blue-700">
            <FiDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <FiDollarSign className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(12800)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-600">
              <FiArrowUp className="mr-1" />
              <span className="text-sm font-medium">12.5%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">vs previous month</span>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <FiTrendingUp className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">This Month</p>
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(3200)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-600">
              <FiArrowUp className="mr-1" />
              <span className="text-sm font-medium">8.3%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">vs previous month</span>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <FiCalendar className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Pending</p>
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(1100)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-red-600">
              <FiArrowDown className="mr-1" />
              <span className="text-sm font-medium">3.2%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">vs previous month</span>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <FiCreditCard className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Completed</p>
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(11700)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-600">
              <FiArrowUp className="mr-1" />
              <span className="text-sm font-medium">10.7%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">vs previous month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Earnings Growth</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'weekly' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'monthly' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-lg ${timeRange === 'yearly' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setTimeRange('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          <div id="earnings-chart">
            <ReactApexChart 
              options={earningsChartOptions} 
              series={earningsChartSeries} 
              type="area" 
              height={350} 
            />
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Orders Overview</h2>
            <div className="text-sm text-gray-500">Last 12 months</div>
          </div>
          <div id="orders-chart">
            <ReactApexChart 
              options={ordersChartOptions} 
              series={ordersChartSeries} 
              type="bar" 
              height={350} 
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button className="w-full text-center text-blue-600 font-medium hover:text-blue-800 py-2">
            View All Transactions →
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Order Value</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800">$112.50</span>
            <span className="ml-2 flex items-center text-green-600">
              <FiArrowUp className="mr-1" />
              <span>5.2%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Increased from last month</p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversion Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800">4.8%</span>
            <span className="ml-2 flex items-center text-green-600">
              <FiArrowUp className="mr-1" />
              <span>1.7%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Improved from last month</p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Refund Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800">2.3%</span>
            <span className="ml-2 flex items-center text-red-600">
              <FiArrowDown className="mr-1" />
              <span>0.8%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Decreased from last month</p>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;