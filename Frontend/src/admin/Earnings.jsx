import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const Earnings = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Mock data for earnings
  const earningsData = {
    totalEarnings: 120450,
    platformFees: 18450,
    sellerPayouts: 102000,
    pendingPayouts: 12500,
    completedPayouts: 89500,
    growthRate: 12.5,
    transactions: 1245,
    averageTransaction: 96.75,
    chartData: [
      { month: "Jan", earnings: 85000, fees: 12750, payouts: 72250 },
      { month: "Feb", earnings: 92000, fees: 13800, payouts: 78200 },
      { month: "Mar", earnings: 87500, fees: 13125, payouts: 74375 },
      { month: "Apr", earnings: 96500, fees: 14475, payouts: 82025 },
      { month: "May", earnings: 102000, fees: 15300, payouts: 86700 },
      { month: "Jun", earnings: 110000, fees: 16500, payouts: 93500 },
      { month: "Jul", earnings: 105000, fees: 15750, payouts: 89250 },
      { month: "Aug", earnings: 112000, fees: 16800, payouts: 95200 },
      { month: "Sep", earnings: 118000, fees: 17700, payouts: 100300 },
      { month: "Oct", earnings: 115000, fees: 17250, payouts: 97750 },
      { month: "Nov", earnings: 120000, fees: 18000, payouts: 102000 },
      { month: "Dec", earnings: 120450, fees: 18450, payouts: 102000 },
    ],
    topSellers: [
      { name: "Electronics Hub", earnings: 24500, sales: 245 },
      { name: "Fashion Empire", earnings: 19800, sales: 198 },
      { name: "Home Essentials", earnings: 17600, sales: 176 },
      { name: "Book World", earnings: 15200, sales: 152 },
      { name: "Sports Gear", earnings: 14300, sales: 143 }
    ],
    recentPayouts: [
      { id: 'PAY-7842', seller: "Electronics Hub", date: '2023-12-15', amount: 12450, status: 'completed' },
      { id: 'PAY-7841', seller: "Fashion Empire", date: '2023-12-14', amount: 9950, status: 'completed' },
      { id: 'PAY-7840', seller: "Home Essentials", date: '2023-12-14', amount: 8800, status: 'pending' },
      { id: 'PAY-7839', seller: "Book World", date: '2023-12-13', amount: 7600, status: 'completed' },
      { id: 'PAY-7838', seller: "Sports Gear", date: '2023-12-12', amount: 7150, status: 'completed' }
    ]
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
      categories: earningsData.chartData.map(item => item.month),
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
          return '$' + value.toLocaleString();
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
          return '$' + value.toLocaleString();
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
      data: earningsData.chartData.map(item => item.earnings)
    },
    {
      name: 'Platform Fees',
      data: earningsData.chartData.map(item => item.fees)
    },
    {
      name: 'Seller Payouts',
      data: earningsData.chartData.map(item => item.payouts)
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
                return '$' + earningsData.sellerPayouts.toLocaleString();
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
    Math.round((earningsData.completedPayouts / earningsData.sellerPayouts) * 100),
    Math.round((earningsData.pendingPayouts / earningsData.sellerPayouts) * 100)
  ];

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
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(earningsData.totalEarnings)}</div>
            <div className={`flex items-center mt-2 ${earningsData.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {earningsData.growthRate >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(earningsData.growthRate)}%</span>
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
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(earningsData.platformFees)}</div>
            <div className="text-sm text-gray-500 mt-2">
              {((earningsData.platformFees / earningsData.totalEarnings) * 100).toFixed(1)}% of total earnings
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
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(earningsData.sellerPayouts)}</div>
            <div className="text-sm text-gray-500 mt-2">
              {earningsData.transactions} transactions
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
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(earningsData.averageTransaction)}</div>
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
              <div className="text-xl font-bold text-green-900">{formatCurrency(earningsData.completedPayouts)}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-800 font-medium">Pending Payouts</div>
              <div className="text-xl font-bold text-yellow-900">{formatCurrency(earningsData.pendingPayouts)}</div>
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
            {earningsData.topSellers.map((seller, index) => (
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
            {earningsData.recentPayouts.map((payout) => (
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
            <span className="text-3xl font-bold text-gray-900">15.3%</span>
            <span className="ml-2 flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm">1.2%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Increased from last quarter</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payout Completion</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">87.7%</span>
            <span className="ml-2 flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm">3.5%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Improved from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dispute Rate</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">2.1%</span>
            <span className="ml-2 flex items-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-sm">0.4%</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Increased from last month</p>
        </div>
      </div>
    </div>
  );
};

export default Earnings;