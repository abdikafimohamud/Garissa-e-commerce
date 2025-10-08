import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Earnings = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch earnings data from backend
  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/admin/earnings/dashboard', {
        withCredentials: true
      });
      
      if (response.data) {
        setEarningsData(response.data);
      }
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

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading earnings data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!earningsData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Failed to load earnings data</p>
            <button 
              onClick={fetchEarningsData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Process data for charts and display
  const processedData = {
    totalEarnings: earningsData.metrics.total_earnings.current,
    platformFees: earningsData.metrics.platform_fees.current,
    sellerPayouts: earningsData.metrics.seller_payouts.current,
    pendingPayouts: earningsData.metrics.payout_distribution.pending,
    completedPayouts: earningsData.metrics.payout_distribution.completed,
    growthRate: earningsData.metrics.total_earnings.change,
    transactions: earningsData.metrics.seller_payouts.transactions,
    averageTransaction: earningsData.metrics.average_transaction.current,
    chartData: earningsData.chart_data,
    topSellers: earningsData.top_sellers,
    recentPayouts: earningsData.recent_payouts
  };

  // Chart options for ApexCharts
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
    colors: ['#3B82F6', '#10B981', '#8B5CF6'],
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
      categories: processedData.chartData.map(item => item.month),
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
          return 'KSh ' + value.toLocaleString();
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
          return 'KSh ' + value.toLocaleString();
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      markers: {
        width: 12,
        height: 12,
        radius: 6,
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

  const earningsChartSeries = [
    {
      name: 'Total Earnings',
      data: processedData.chartData.map(item => item.earnings)
    },
    {
      name: 'Platform Fees',
      data: processedData.chartData.map(item => item.fees)
    },
    {
      name: 'Seller Payouts',
      data: processedData.chartData.map(item => item.payouts)
    }
  ];

  const payoutDistributionOptions = {
    chart: {
      height: 300,
      type: 'donut',
    },
    labels: ['Completed Payouts', 'Pending Payouts'],
    colors: ['#10B981', '#F59E0B'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Payouts',
              formatter: function () {
                return 'KSh ' + processedData.sellerPayouts.toLocaleString();
              },
              style: {
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '700'
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

  const payoutDistributionSeries = [
    Math.round((processedData.completedPayouts / processedData.sellerPayouts) * 100),
    Math.round((processedData.pendingPayouts / processedData.sellerPayouts) * 100)
  ];

  // Function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return "KSh 0";
    return `KSh ${Math.round(amount).toLocaleString()}`;
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-1">Monitor platform revenue and payouts to sellers</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Earnings Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Total Earnings</h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(processedData.totalEarnings)}</div>
            <div className={`flex items-center mt-2 ${processedData.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {processedData.growthRate >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(processedData.growthRate)}%</span>
              <span className="text-sm text-gray-500 ml-1">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Platform Fees Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Platform Fees</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(processedData.platformFees)}</div>
            <div className="text-sm text-gray-500 mt-2">
              {earningsData.metrics.platform_fees.percentage.toFixed(1)}% of total earnings
            </div>
          </div>
        </div>

        {/* Seller Payouts Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Seller Payouts</h3>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(processedData.sellerPayouts)}</div>
            <div className="text-sm text-gray-500 mt-2">
              {processedData.transactions} transactions
            </div>
          </div>
        </div>

        {/* Avg. Transaction Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Transaction</h3>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(processedData.averageTransaction)}</div>
            <div className="text-sm text-gray-500 mt-2">
              Per transaction
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Earnings Overview</h2>
            <div className="text-sm text-gray-500">Last 12 months</div>
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

        {/* Payout Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Payout Distribution</h2>
          <div id="payout-distribution-chart">
            <ReactApexChart 
              options={payoutDistributionOptions} 
              series={payoutDistributionSeries} 
              type="donut" 
              height={300} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-800 font-medium">Completed Payouts</div>
              <div className="text-xl font-bold text-green-900">{formatCurrency(processedData.completedPayouts)}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-800 font-medium">Pending Payouts</div>
              <div className="text-xl font-bold text-yellow-900">{formatCurrency(processedData.pendingPayouts)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sellers */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Top Performing Sellers</h2>
          <div className="space-y-4">
            {processedData.topSellers.map((seller, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{seller.name}</h4>
                    <p className="text-sm text-gray-500">{seller.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(seller.earnings)}</p>
                  <p className="text-sm text-gray-500">Earnings</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-blue-600 font-medium hover:text-blue-800 py-2">
            View All Sellers →
          </button>
        </div>

        {/* Recent Payouts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Payouts</h2>
          <div className="space-y-4">
            {processedData.recentPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <h4 className="font-medium text-gray-900">{payout.seller}</h4>
                  <p className="text-sm text-gray-500">{payout.id} • {payout.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(payout.amount)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payout.status)}`}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-blue-600 font-medium hover:text-blue-800 py-2">
            View All Payouts →
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Fee Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{earningsData.platform_stats.fee_rate}%</span>
            <span className="ml-2 flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm">1.2%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Platform commission rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payout Completion</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{earningsData.platform_stats.payout_completion}%</span>
            <span className="ml-2 flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm">3.5%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Orders completed and paid out</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dispute Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{earningsData.platform_stats.dispute_rate}%</span>
            <span className="ml-2 flex items-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-sm">0.4%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Payment disputes reported</p>
        </div>
      </div>
    </div>
  );
};

export default Earnings;