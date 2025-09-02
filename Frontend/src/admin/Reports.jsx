import { useState } from 'react';
import { FiBarChart2, FiPieChart, FiDownload, FiCalendar, FiFilter } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [chartView, setChartView] = useState('bar');

  // Sample report data
  const reportsData = {
    sales: {
      title: "Sales Performance",
      description: "Track revenue and order metrics",
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue ($)',
            data: [12500, 19000, 14200, 20500, 17800, 23400],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
          },
          {
            label: 'Orders',
            data: [120, 190, 140, 210, 180, 240],
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
          }
        ]
      }
    },
    products: {
      title: "Product Performance",
      description: "Top selling products by category",
      data: {
        labels: ['Electronics', 'Clothing', 'Home Goods', 'Beauty', 'Sports'],
        datasets: [
          {
            label: 'Units Sold',
            data: [1250, 1900, 1420, 2050, 1780],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
          }
        ]
      }
    },
    customers: {
      title: "Customer Insights",
      description: "Customer demographics and behavior",
      data: {
        labels: ['New', 'Returning', 'Inactive', 'Loyal'],
        datasets: [
          {
            label: 'Customers',
            data: [520, 310, 180, 420],
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(139, 92, 246, 0.7)',
            ],
          }
        ]
      }
    }
  };

  const handleExport = () => {
    // Export functionality would go here
    alert(`Exporting ${activeReport} report as CSV`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics Reports</h1>
            <p className="text-gray-600 mt-2">
              {reportsData[activeReport].description}
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Report Selection Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex overflow-x-auto">
            {Object.keys(reportsData).map((reportKey) => (
              <button
                key={reportKey}
                onClick={() => setActiveReport(reportKey)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeReport === reportKey
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {reportsData[reportKey].title}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <FiCalendar className="text-gray-500 mr-2" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="flex items-center">
              <FiFilter className="text-gray-500 mr-2" />
              <select
                value={chartView}
                onChange={(e) => setChartView(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="table">Table View</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            {reportsData[activeReport].title}
          </h2>

          <div className="h-96">
            {chartView === 'bar' ? (
              <Bar
                data={reportsData[activeReport].data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <Pie
                data={reportsData[activeReport].data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            )}
          </div>

          {/* Data Table (simplified) */}
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {reportsData[activeReport].data.labels.map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {label}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportsData[activeReport].data.datasets.map((dataset, idx) => (
                  <tr key={idx}>
                    {dataset.data.map((value, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {value}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {dataset.label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">$24,780</p>
            <p className="mt-1 text-sm text-green-600">↑ 12% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">1,240</p>
            <p className="mt-1 text-sm text-green-600">↑ 8% from last period</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Avg. Order Value</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">$98.45</p>
            <p className="mt-1 text-sm text-red-600">↓ 2% from last period</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;