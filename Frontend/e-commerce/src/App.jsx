import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, setAuthChecked } from "./features/auth/authSlice";
import UserLayout from "./layout/UserLayout.jsx";
import Cart from "./features/cart/Cart.jsx";
import Checkout from "./Pages/user/Checkout.jsx";
import Payment from "./Pages/user/Payment.jsx";
import UserOrder from "./Pages/user/UserOrder.jsx";
import OrderDetails from "./features/orders/user/components/OrderDetails.jsx";
import Wishlist from "./features/wishlist/Wishlist.jsx";
import Login from "./features/auth/Login";
import ForgotPassword from "./features/auth/ForgotPassword.jsx";
import Home from "./Pages/public/Home.jsx";
import CategoryFilter from "./features/products/category/CateogryFilter.jsx";
import ProductDetail from "./features/products/details/ProductDetail.jsx";
import ProductListing from "./features/products/components/ProductListing.jsx";
import ProtectedRoute from "./components/common/ProtectedRote.jsx";
import Profile from "./Pages/user/Profile.jsx";
import NotFound from "./components/common/NotFound.jsx";
import Loader from "./components/common/Loader.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollToSection from "./features/products/section/ScrollToSection.jsx";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "react-hot-toast";

const stripePromise = loadStripe("pk_test_51QlWeFQemhG2QfvsGG1PqGASRwoKpb3CV9iBeVeHpYYiDiXApNSn2i9YiHUU3XiLRb7QPXem90utPmVVJ5f0Ewoh00shYEBk3E");

// ================= LAZY ADMIN =================
const DashboardLayout = lazy(() => import("./layout/DashboardLayout.jsx"));
const DashboardHome = lazy(() => import("./Pages/admin/DashboardHome.jsx"));
const ManageProducts = lazy(() => import("./Pages/admin/ManageProducts.jsx"));
const ProductForm = lazy(() => import("./features/products/form/ProductForm.jsx"));
const AdminOrder = lazy(() => import("./Pages/admin/AdminOrder.jsx"));
const BannerManagement = lazy(() => import("./Pages/admin/BannerManagement.jsx"));
const BannerForm = lazy(() => import("./features/Banners/form/BannerForm.jsx"));

// ================= APP CONTENT =================
function AppContent() {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(fetchUser()).unwrap();
      } catch {

      }
    };

    initAuth();
  }, [dispatch]);

  if (!authChecked) return <Loader />;

  return (
    <Routes>
      {/* 404 */}
      <Route path="*" element={<NotFound />} />

      {/* USER LAYOUT */}
      <Route element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:category" element={<CategoryFilter />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:id" element={<ProductDetail />} />

        {/* PROTECTED USER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="payment"
            element={
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders" element={<UserOrder />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login form="register" />} />
      </Route>

      {/* ADMIN DASHBOARD */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<Loader />}>
              <DashboardLayout />
            </Suspense>
          }
        >
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

//ROOT 
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ScrollToSection />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              zIndex: 9999,
              position: "relative",
              top: "50px",
              transform: "translateX(-50%)",
            },
          }}
        />

        <Suspense fallback={<Loader />}>
          <AppContent />
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}