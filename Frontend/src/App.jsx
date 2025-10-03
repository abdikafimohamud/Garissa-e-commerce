import { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import the unified protected route

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Deals from "./pages/Deals";
import Contact from "./pages/Contact";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";

// Seller Dashboard Imports
import SellerDashboardLayout from "./sellers/SellerDashboardLayout";
import SellerHome from "./sellers/SellerHome";
import Sellerclothes from "./sellers/Sellerclothes";
import SellerCosmetics from "./sellers/SellerCosmetics";
import SellerElectronics from "./sellers/SellerElectronics";
import SellerSports from "./sellers/SellerSports";
import SellerOrders from "./sellers/SellerOrders";
import SellerAnalytics from "./sellers/SellerAnalytics";
import SellerEarnings from "./sellers/SellerEarnings";
import SellerNotifications from "./sellers/SellerNotifications";
import SellerProfile from "./sellers/SellerProfile";

// User Dashboard
import DashboardLayout from "./Dashboard/DashboardLayout";
import DashboardHome from "./Dashboard/DashboardHome";
import Clothes from "./Dashboard/Clothes";
import Cosmetics from "./Dashboard/Cosmetics";
import Electronics from "./Dashboard/Electronics";
import Sports from "./Dashboard/Sports";
import Cart from "./Dashboard/Cart";
import Checkout from "./Dashboard/Checkout";
import OrderDetails from "./Dashboard/OrderDetails";
import BuyerProfile from "./Dashboard/BuyerProfile";
import Notifications from "./Dashboard/Notifications";

// Admin Dashboard
import AdminDashboardLayout from "./admin/AdminDashboardLayout";
import AdminHome from "./admin/AdminHome";
import SellersManagement from "./admin/SellersManagement";
import BuyersManagement from "./admin/BuyersManagement";
import OrdersManagement from "./admin/OrdersManagement";
import Analytics from "./admin/Analytics";
import Earnings from "./admin/Earnings";
import NotificationManagement from "./admin/NotificationManagement";

// ✅ Layout wrapper ONLY for public pages
function PublicLayout({ cartItems }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cartItems={cartItems} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);

  // 🛒 Cart functions
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Clear cart function for checkout
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AuthProvider>
      <Routes>
        {/* 🌍 Public layout (only Navbar + Footer here) */}
        <Route element={<PublicLayout cartItems={cartItems} />}>
          <Route
            path="/"
            element={
              <Home addToCart={addToCart} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/header" element={<Header />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 👤 User Dashboard (protected, no duplicate navbar/footer) */}
        <Route
          path="/Buyers"
          element={
            // <ProtectedRoute role="buyer">
              <DashboardLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard-home" replace />} />
          <Route path="dashboard-home" element={<DashboardHome />} />
          <Route
            path="clothes"
            element={<Clothes addToCart={addToCart} />}
          />
          <Route
            path="cosmetics"
            element={<Cosmetics addToCart={addToCart} />}
          />
          <Route
            path="electronics"
            element={<Electronics addToCart={addToCart} />}
          />
          <Route
            path="sports"
            element={<Sports addToCart={addToCart} />}
          />
          <Route path="profile" element={<BuyerProfile />} />
          <Route
            path="cart"
            element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route
            path="checkout"
            element={<Checkout cartItems={cartItems} clearCart={clearCart} />}
          />
          <Route path="/Buyers/order-details" element={<OrderDetails />} />
          <Route path="Notifications" element={<Notifications />} />
        </Route>

        {/* 🏬 Sellers dashboard */}
        <Route
          path="/seller"
          element={
            // <ProtectedRoute role="seller">
              <SellerDashboardLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard-home" replace />} />
          <Route path="dashboard-home" element={<SellerHome />} />
          <Route path="clothes" element={<Sellerclothes />} />
          <Route path="cosmetics" element={<SellerCosmetics />} />
          <Route path="electronics" element={<SellerElectronics />} />
          <Route path="sports" element={<SellerSports />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="earnings" element={<SellerEarnings />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="profile-settings" element={<SellerProfile />} />
        </Route>

        {/* ===== Admin Routes ===== */}
        {/* Admin Login - Public Route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Dashboard - Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard-home" replace />} />
          <Route path="dashboard-home" element={<AdminHome />} />
          <Route path="sellers" element={<SellersManagement />} />
          <Route path="buyers" element={<BuyersManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="NotificationManagement" element={<NotificationManagement />} />
        </Route>

        {/* 🚫 Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
