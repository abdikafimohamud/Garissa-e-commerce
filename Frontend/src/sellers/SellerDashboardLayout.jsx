import { Outlet } from "react-router-dom";
import { useState } from "react";
import SellerSidebar from "../components/SellerSidebar";

import Header from "../components/Header";
import Footer from "../components/Footer";

const SellerDashboardLayout = ({ cartItems = [], setCartItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header
          cartItems={cartItems}
          setCartItems={setCartItems}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userType="seller"
        />
      </header>

      {/* Main Section (Sidebar + Content) */}
      <div className="flex flex-1 pt-16">
        {/* Fixed Sidebar */}
        <aside className="fixed top-16 bottom-0 left-0 z-40">
          <SellerSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 p-8 overflow-y-auto">
          {/* Mobile sidebar toggle button */}
          <button
            className="lg:hidden text-gray-700 text-2xl mb-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-12rem)]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer (not fixed, sits naturally at bottom) */}
      <footer className="bg-gray-100">
        <Footer />
      </footer>
    </div>
  );
};

export default SellerDashboardLayout;
