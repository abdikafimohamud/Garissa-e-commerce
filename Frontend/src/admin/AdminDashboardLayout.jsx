import { NavLink, Outlet } from "react-router-dom";

const AdminDashboardLayout = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-red-600 text-white"
        : "hover:bg-red-500 hover:text-white text-gray-200"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-red-800 text-white p-6 shadow-lg fixed h-full overflow-y-auto">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">ADMIN PANEL</h2>
        </div>

        <nav className="space-y-3">
          <NavLink to="ClothesManagement" className={linkClasses}>
            <span className="mr-3">👕</span>
            <span>Clothes</span>
          </NavLink>

          <NavLink to="CosmeticsManagement" className={linkClasses}>
            <span className="mr-3">💄</span>
            <span>Cosmetics</span>
          </NavLink>

          <NavLink to="ElectronicsManagement" className={linkClasses}>
            <span className="mr-3">📱</span>
            <span>Electronics</span>
          </NavLink>

          <NavLink to="SportsManagement" className={linkClasses}>
            <span className="mr-3">📱</span>
            <span>Sports</span>
          </NavLink>

          <NavLink to="OrdersManagement" className={linkClasses}>
            <span className="mr-3">📱</span>
            <span>Orders</span>
          </NavLink>

          <NavLink to="UserManagement" className={linkClasses}>
            <span className="mr-3">⚙️</span>
            <span>Users</span>
          </NavLink>
        </nav>
      </aside>

      {/* Scrollable Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
