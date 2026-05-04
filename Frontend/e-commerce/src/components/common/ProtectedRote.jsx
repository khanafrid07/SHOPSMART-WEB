import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";
import { notifyError } from "../../utils/notify";

export default function ProtectedRoute({ role }) {
  const { user, authChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  const notified = useRef(false);

  if (!authChecked) return <Loader />;

  if (!user) {
    if (!notified.current) {
      notifyError("Please Login to Continue");
      notified.current = true;
    }

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    if (!notified.current) {
      notifyError("You are not authorized to access this page");
      notified.current = true;
    }

    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}