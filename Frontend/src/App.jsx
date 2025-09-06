import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Deals from "./pages/Deals";
import Contact from "./pages/Contact";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import ViewOrders from "./pages/ViewOrders";

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
import Profilee from "./Dashboard/Profilee";
import Notifications from "./Dashboard/Notifications";

// Admin Dashboard
import AdminDashboardLayout from "./admin/AdminDashboardLayout";
import AdminHome from "./admin/AdminHome";
import SellersManagement from "./admin/SellersManagement";
import BuyersManagement from "./admin/BuyersManagement";
import ProductsManagement from "./admin/ProductsManagement";
import OrdersManagement from "./admin/OrdersManagement";
import Analytics from "./admin/Analytics";
import Earnings from "./admin/Earnings";
import NotificationsManagement from "./admin/NotificationsManagement";


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

  // 🛍️ Dynamic product state
  const [clothes, setClothes] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [cosmetics, setCosmetics] = useState([]);
  const [sports, setSports] = useState([]);

  // 🔁 Fetch categories
  useEffect(() => {
    const fetchCategory = async (endpoint, setter) => {
      try {
        const res = await fetch(`http://localhost:5000/${endpoint}`);
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
      }
    };

    fetchCategory("clothes", setClothes);
    fetchCategory("electronics", setElectronics);
    fetchCategory("cosmetics", setCosmetics);
    fetchCategory("sports", setSports);
  }, []);

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

  return (
    <AuthProvider>
      <Routes>
        {/* 🌍 Public layout (only Navbar + Footer here) */}
        <Route element={<PublicLayout cartItems={cartItems} />}>
          <Route
            path="/"
            element={
              <Home
                clothes={clothes}
                electronics={electronics}
                cosmetics={cosmetics}
                sports={sports}
                addToCart={addToCart}
              />
            }
            Contact
          />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/ header" element={< Header />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
          <Route path="/orders" element={<ViewOrders />} />
        </Route>

        {/* 👤 User Dashboard (protected, no duplicate navbar/footer) */}
        <Route path="/Buyers" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard-home" replace />} />
          <Route path="dashboard-home" element={<DashboardHome />} />
          <Route
            path="clothes"
            element={<Clothes Buyers={clothes} addToCart={addToCart} />}
          />
          <Route
            path="cosmetics"
            element={<Cosmetics Buyers={cosmetics} addToCart={addToCart} />}
          />
          <Route
            path="electronics"
            element={<Electronics Buyers={electronics} addToCart={addToCart} />}
          />
          <Route
            path="sports"
            element={<Sports Buyers={sports} addToCart={addToCart} />}
          />
          <Route path="Profilee" element={<Profilee />} />
          <Route path="cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="Notifications" element={<Notifications />} />
        </Route>

        {/* 🏬 Sellers dashboard */}
        <Route path="/seller" element={<SellerDashboardLayout />}>
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
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="sellers" element={<SellersManagement />} />
          <Route path="buyers" element={<BuyersManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="notifications" element={<NotificationsManagement />} />
        </Route>

        {/* 🚫 Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;