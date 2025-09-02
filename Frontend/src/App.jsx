import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ViewOrders from "./pages/ViewOrders";

// Sellers Dashboard
import SellerLayout from "./SellerDashboard/SellerLayout";
import SellerHome from "./SellerDashboard/SellerHome";
import Profile from "./SellerDashboard/Profile";
import Settingss from "./SellerDashboard/Settingss";

// User Dashboard
import DashboardLayout from "./Dashboard/DashboardLayout";
import DashboardHome from "./Dashboard/DashboardHome";
import Clothes from "./Dashboard/Clothes";
import Cosmetics from "./Dashboard/Cosmetics";
import Electronics from "./Dashboard/Electronics";
import Sports from "./Dashboard/Sports";
import Profilee from "./Dashboard/Profilee";
import Notifications from "./Dashboard/Notifications";

// Admin Dashboard
import AdminDashboardLayout from "./admin/AdminDashboardLayout";
import ClothesManagement from "./admin/ClothesManagement";
import CosmeticsManagement from "./admin/CosmeticsManagement";
import ElectronicsManagement from "./admin/ElectronicsManagement";
import OrdersManagement from "./admin/OrdersManagement";
import UserManagement from "./admin/UserManagement";
import SportsManagement from "./admin/SportsManagement";
import NotificationsManagement from "./admin/NotificationsManagement";
import Reports from "./admin/Reports";

// ✅ Layout wrapper with Navbar & Footer
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

  // 🛍️ Dynamic product state from backend
  const [clothes, setClothes] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [cosmetics, setCosmetics] = useState([]);
  const [sports, setSports] = useState([]);

  // 🔁 Fetch each category from backend
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

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, q) =>
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: q } : i))
    );

  const clearCart = () => setCartItems([]);

  return (
    <AuthProvider>
      <Routes>
        {/* 🌍 Public layout */}
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
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                clearCart={clearCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cartItems={cartItems} clearCart={clearCart} />}
          />

          {/* 👤 User Dashboard (protected) */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard-home" replace />} />
            <Route path="dashboard-home" element={<DashboardHome />} />
            <Route
              path="clothes"
              element={<Clothes products={clothes} addToCart={addToCart} />}
            />
            <Route
              path="cosmetics"
              element={<Cosmetics products={cosmetics} addToCart={addToCart} />}
            />
            <Route
              path="electronics"
              element={
                <Electronics products={electronics} addToCart={addToCart} />
              }
            />
            <Route
              path="sports"
              element={<Sports products={sports} addToCart={addToCart} />}
            />
            <Route path="Profilee" element={<Profilee />} />
            <Route path="Notifications" element={<Notifications />} />
          </Route>

          <Route path="/orders" element={<ViewOrders />} />
        </Route>

        {/* 🏬 Sellers routes with SellerLayout */}
        <Route path="/Sellers" element={<SellerLayout />}>
          <Route index element={<Navigate to="Seller-Home" replace />} />
          <Route path="Seller-Home" element={<SellerHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settingss" element={<Settingss />} />
        </Route>

        {/* 🔐 Admin dashboard */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<ClothesManagement />} />
          <Route path="clothesmanagement" element={<ClothesManagement />} />
          <Route path="cosmeticsmanagement" element={<CosmeticsManagement />} />
          <Route
            path="electronicsmanagement"
            element={<ElectronicsManagement />}
          />
          <Route path="sportsmanagement" element={<SportsManagement />} />
          <Route path="ordersmanagement" element={<OrdersManagement />} />
          <Route
            path="NotificationsManagement"
            element={<NotificationsManagement />}
          />
          <Route path="usermanagement" element={<UserManagement />} />
          <Route path="Reports" element={<Reports />} />
        </Route>

        {/* 🚫 Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
