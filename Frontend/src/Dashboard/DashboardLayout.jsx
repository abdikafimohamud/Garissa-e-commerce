// src/layouts/DashboardLayout.jsx
import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext"; // If you have a cart context

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { cartItems } = useContext(AuthContext); // Get cart items from context if available

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header - Using the DashboardHeader component */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header 
          cartItems={cartItems || []} // Pass actual cart items
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userType="buyer"
        />
      </header>

      {/* Main Section (Sidebar + Content) */}
      <div className="flex flex-1 pt-16">
        {/* Fixed Sidebar - Using the UserSidebar component */}
        <aside
          className={`fixed top-16 bottom-0 left-0 z-40 overflow-y-auto transition-transform duration-300 bg-white border-r border-gray-200 ${
            isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-64 w-64"
          }`}
        >
          <UserSidebar />
        </aside>

        {/* Scrollable Main Content */}
        <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}>
          {/* Mobile Sidebar Toggle */}
          {!isSidebarOpen && (
            <button
              className="lg:hidden text-gray-700 text-2xl mb-4 p-2 bg-gray-100 rounded-md"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
          )}

          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-12rem)]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer (not fixed) */}
      <footer className="bg-gray-100">
        <Footer />
      </footer>
    </div>
  );
};

export default DashboardLayout;