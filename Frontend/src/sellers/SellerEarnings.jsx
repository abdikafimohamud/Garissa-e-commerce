// src/sellers/SellerEarnings.jsx
import { FiDollarSign, FiTrendingUp, FiCalendar, FiCreditCard } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const earningsData = [
  { month: "Jan", earnings: 1200 },
  { month: "Feb", earnings: 2100 },
  { month: "Mar", earnings: 1800 },
  { month: "Apr", earnings: 2600 },
  { month: "May", earnings: 3000 },
  { month: "Jun", earnings: 4000 },
];

const SellerEarnings = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Earnings Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FiDollarSign className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <h2 className="text-xl font-bold">$12,800</h2>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FiTrendingUp className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">This Month</p>
            <h2 className="text-xl font-bold">$3,200</h2>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FiCalendar className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-xl font-bold">$1,100</h2>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FiCreditCard className="text-orange-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <h2 className="text-xl font-bold">$11,700</h2>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Earnings Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Area type="monotone" dataKey="earnings" stroke="#3b82f6" fill="#93c5fd" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SellerEarnings;
