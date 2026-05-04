import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, setAuthChecked } from "./features/auth/authSlice";
import UserLayout from "./layout/UserLayout.jsx";
import Cart from "./features/cart/Cart.jsx"
import Checkout from "./Pages/user/Checkout.jsx";
import Payment from "./Pages/user/Payment.jsx";
import UserOrder from "./Pages/user/UserOrder.jsx"
import OrderDetails from "./features/orders/user/components/OrderDetails.jsx";
import Login from "./features/auth/Login";
import RegisterForm from "./features/auth/RegisterForm.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import DashboardHome from "./Pages/admin/DashboardHome.jsx";
import ProductForm from "./features/products/form/ProductForm.jsx";
import ManageProducts from "./Pages/admin/ManageProducts.jsx";
import AdminOrder from "./Pages/admin/AdminOrder.jsx";
import Wishlist from "./Pages/user/Wishlist.jsx";
import Home from "./Pages/public/Home.jsx";
import CategoryFilter from "./features/products/category/CateogryFilter.jsx";
import ProductDetail from "./features/products/details/ProductDetail.jsx";
import ProductListing from "./features/products/components/ProductListing.jsx";
import ProtectedRoute from "./components/common/ProtectedRote.jsx"
import Profile from "./Pages/user/Profile.jsx";
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js";
import BannerForm from "./features/Banners/form/BannerForm.jsx";
import BannerManagement from "./Pages/admin/BannerManagement.jsx";
import NotFound from "./components/common/NotFound.jsx";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollToSection from "./features/products/section/ScrollToSection.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import Loader from "./components/common/Loader.jsx";
const stripePromise = loadStripe("pk_test_51QlWeFQemhG2QfvsGG1PqGASRwoKpb3CV9iBeVeHpYYiDiXApNSn2i9YiHUU3XiLRb7QPXem90utPmVVJ5f0Ewoh00shYEBk3E")

function AppContent() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");

    const initAuth = async () => {
      if (!token) {
        dispatch(setAuthChecked(true));
        return;
      }

      try {
        await dispatch(fetchUser()).unwrap();
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    initAuth();
  }, [dispatch]);
  const { authChecked, loading } = useSelector((state) => state.auth);

  if (!authChecked || loading) return <Loader />;
  return (
    <Routes>
      {/* User pages wrapped in UserLayout */}
      <Route path="*" element={<NotFound />} />
      <Route element={<UserLayout />}>

        <Route index element={<Home />} />

        <Route path="category/:category" element={<CategoryFilter />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Elements stripe={stripePromise}>
            <Payment />

          </Elements>} />
          <Route path="profile" element={<Profile />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders" element={<UserOrder />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login form="register" />} />
      </Route>




      {/* Dashboard */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="add-product" element={<ProductForm />} />
          <Route path="update-product/:id" element={<ProductForm isEdit={true} />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="orders/:id" element={<OrderDetails isAdmin={true} />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="banners/create" element={<BannerForm />} />
          <Route path="banners/:id/edit" element={<BannerForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>

      <Router>
        <ScrollToTop />
        <ScrollToSection />
        <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999, position: "relative", top: "50px", transform: "translateX(-50%)" } }} />
        <AppContent />

      </Router>
    </ErrorBoundary>
  );
}
