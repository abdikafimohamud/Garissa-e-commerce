import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar, FiCreditCard, FiDownload, FiFilter, FiArrowUp, FiArrowDown } from "react-icons/fi";
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerEarnings = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    totalEarnings: { current: 0, growth: 0, data: [] },
    thisMonth: { current: 0, growth: 0 },
    pending: { current: 0, change: 0 },
    completed: { current: 0, growth: 0 },
    earningsData: [],
    recentTransactions: [],
    performanceMetrics: {
      averageOrderValue: { current: 0, change: 0 },
      conversionRate: { current: 0, change: 0 },
      refundRate: { current: 0, change: 0 }
    }
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/seller/earnings?time_range=${timeRange}`, {
        withCredentials: true
      });
      
      setEarningsData(response.data);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast.error('Failed to fetch earnings data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

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
      categories: earningsData.earningsData.map(item => item.month),
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
          return 'KES ' + value.toFixed(0);
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
          return 'KES ' + value.toFixed(2);
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
    data: earningsData.earningsData.map(item => item.earnings)
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
      categories: earningsData.earningsData.map(item => item.month),
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
    data: earningsData.earningsData.map(item => item.orders)
  }];

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>
          <p className="text-gray-600">Track your sales performance and earnings</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button 
            onClick={fetchEarningsData}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiFilter className="mr-2" />
            Refresh
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
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(earningsData.totalEarnings.current)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className={`flex items-center ${earningsData.totalEarnings.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.totalEarnings.growth >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              <span className="text-sm font-medium">{Math.abs(earningsData.totalEarnings.growth).toFixed(1)}%</span>
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
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(earningsData.thisMonth.current)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className={`flex items-center ${earningsData.thisMonth.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.thisMonth.growth >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              <span className="text-sm font-medium">{Math.abs(earningsData.thisMonth.growth).toFixed(1)}%</span>
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
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(earningsData.pending.current)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className={`flex items-center ${earningsData.pending.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.pending.change >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              <span className="text-sm font-medium">{Math.abs(earningsData.pending.change).toFixed(1)}%</span>
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
              <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(earningsData.completed.current)}</h2>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className={`flex items-center ${earningsData.completed.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.completed.growth >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              <span className="text-sm font-medium">{Math.abs(earningsData.completed.growth).toFixed(1)}%</span>
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
              {earningsData.recentTransactions.length > 0 ? (
                earningsData.recentTransactions.map((transaction) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No transactions found. Start selling to see your earnings!
                  </td>
                </tr>
              )}
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
            <span className="text-3xl font-bold text-gray-800">{formatCurrency(earningsData.performanceMetrics.averageOrderValue.current)}</span>
            <span className={`ml-2 flex items-center ${earningsData.performanceMetrics.averageOrderValue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.performanceMetrics.averageOrderValue.change >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              <span>{Math.abs(earningsData.performanceMetrics.averageOrderValue.change).toFixed(1)}%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {earningsData.performanceMetrics.averageOrderValue.change >= 0 ? 'Increased' : 'Decreased'} from last month
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversion Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800">{earningsData.performanceMetrics.conversionRate.current.toFixed(1)}%</span>
            <span className={`ml-2 flex items-center ${earningsData.performanceMetrics.conversionRate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.performanceMetrics.conversionRate.change >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              <span>{Math.abs(earningsData.performanceMetrics.conversionRate.change).toFixed(1)}%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {earningsData.performanceMetrics.conversionRate.change >= 0 ? 'Improved' : 'Declined'} from last month
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Refund Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800">{earningsData.performanceMetrics.refundRate.current.toFixed(1)}%</span>
            <span className={`ml-2 flex items-center ${earningsData.performanceMetrics.refundRate.change <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.performanceMetrics.refundRate.change <= 0 ? <FiArrowDown className="mr-1" /> : <FiArrowUp className="mr-1" />}
              <span>{Math.abs(earningsData.performanceMetrics.refundRate.change).toFixed(1)}%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {earningsData.performanceMetrics.refundRate.change <= 0 ? 'Decreased' : 'Increased'} from last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;