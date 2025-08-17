import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 Clear auth session (adjust to your auth system)
    localStorage.removeItem("authToken");
    navigate("/login"); 
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col justify-between p-6 shadow-lg">
      {/* Top Nav Links */}
      <div>
        <h2 className="text-2xl font-bold mb-8 tracking-wide">Admin Panel</h2>
        <nav className="space-y-3">
          <NavLink to="/admin/clothesmanagement" className={linkClasses}>
            <span className="mr-3">👕</span>
            Manage Clothes
          </NavLink>

          <NavLink to="/admin/cosmeticsmanagement" className={linkClasses}>
            <span className="mr-3">💄</span>
            Manage Cosmetics
          </NavLink>

          <NavLink to="/admin/electronicsmanagement" className={linkClasses}>
            <span className="mr-3">📱</span>
            Manage Electronics
          </NavLink>

          <NavLink to="/admin/sportsmanagement" className={linkClasses}>
            <span className="mr-3">📱</span>
            Manage Sports
          </NavLink>

          <NavLink to="/admin/OrdersManagement" className={linkClasses}>
            <span className="mr-3">📱</span>
            Manage Orders
          </NavLink>

          <NavLink to="/admin/UserManagement" className={linkClasses}>
            <span className="mr-3">⚙️</span>
            Users
          </NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
      >
        <span className="mr-3">🚪</span>
        Logout
      </button>
    </aside>
  );
}
