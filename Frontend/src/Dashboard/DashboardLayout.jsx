import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const baseClasses =
    "flex items-center p-3 rounded-lg transition-all duration-200 group";
  const activeClasses = "bg-gray-700 text-yellow-300";
  const inactiveClasses = "hover:bg-gray-700";

  // Helper: Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Fetch logged-in user info
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/get_current_user", {
        credentials: "include", // keep cookies
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data); 
      } else {
        setUser(null); // not logged in
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    }
  };
  fetchUser();
}, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-r from-green-500 to-yellow-500 text-white p-6 shadow-lg fixed h-full overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-64 w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">DASHBOARD</h2>
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <NavLink
            to="/products/dashboard-home"
            end
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span className="mr-3">🏠</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              Dashboard Home
            </span>
          </NavLink>

          <NavLink
            to="clothes"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span className="mr-3">👕</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              Clothes
            </span>
          </NavLink>

          <NavLink
            to="cosmetics"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span className="mr-3">💄</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              Cosmetics
            </span>
          </NavLink>

          <NavLink
            to="electronics"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span className="mr-3">📱</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              Electronics
            </span>
          </NavLink>

          <NavLink
            to="sports"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span className="mr-3">🏀</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              Sports
            </span>
          </NavLink>

          <NavLink
            to="Profilee"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span className="mr-3">👤</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              Profile
            </span>
          </NavLink>

          <NavLink
            to="Notifications"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span className="mr-3">🔔</span>
            <span className="font-medium group-hover:translate-x-1 transition-transform">
              Notifications
            </span>
          </NavLink>
          
          </nav>
             
          {/* Footer */}
          <div className="mt-8 border-t border-white/30 pt-4">
          {user && (
            <div className="flex items-center mb-4 gap-3">
              <div className="w-12 h-12 rounded-full bg-white text-green-600 flex items-center justify-center text-lg font-bold shadow-md">
                {getInitials(user.fullname)}
              </div>
              <div>
                <p className="text-sm">👋 Welcome</p>
                <p className="font-semibold">{user.fullname}</p>
              </div>
            </div>
          )}
         <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
          >
            🚪 Logout
          </button>
          </div>
          </aside>

          {/* Content */}
          <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
        
          <button
            className="lg:hidden text-gray-700 text-2xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          

          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-8rem)]">
          <Outlet />
          </div>
      </main>
    </div>
  );
};

export default DashboardLayout;