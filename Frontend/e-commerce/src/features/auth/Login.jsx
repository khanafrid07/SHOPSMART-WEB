import { useState } from "react";
import { loginUser, logout, forgotPasswordSendOtp, forgotPasswordVerifyOtp } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { notifyError, notifySuccess } from "../../utils/notify";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import ForgotPassword from "./ForgotPassword";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [switchForm, setSwitchForm] = useState(() => {
    return window.location.pathname.includes("register")
      ? "register"
      : window.location.pathname.includes("forgot-password")
        ? "forgot-password"
        : "login"
  });
  const [name, setName] = useState("");
  const [step, setStep] = useState("form");

  const { user, error, otpLoading, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      notifySuccess("Welcome back!");
      navigate("/");
    } catch (error) {
      notifyError(error.message || "Login failed");
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    notifySuccess("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 relative overflow-hidden">

      {/* BACKGROUND IMAGE + OVERLAY (FIXED CONTRAST) */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/4005039/pexels-photo-4005039.jpeg"
          className="w-full h-full object-cover"
        />
        {/* darker premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* LEFT BRAND SIDE */}
      <div className="relative hidden md:flex flex-col justify-center items-center text-white p-10">

        <div className="text-center space-y-5 max-w-md">
          <ShoppingBag className="w-12 h-12 mx-auto text-white/90" />

          <h1 className="text-4xl font-extrabold leading-tight">
            Shop Smart.<br />
            Live Better.
          </h1>

          <p className="text-white/70 text-sm leading-relaxed">
            Discover premium fashion, trending styles, and exclusive deals
            tailored just for you.
          </p>
        </div>

        {user && (
          <button
            onClick={logoutUser}
            className="absolute top-6 right-6 px-4 py-2 rounded-full border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            Logout
          </button>
        )}
      </div>

      {/* RIGHT LOGIN SIDE */}
      <div className="relative flex items-center justify-center p-6">

        {/* PREMIUM GLASS CARD */}
        <div className=" max-w-md backdrop-blur-2xl bg-white/90 border border-white/30 shadow-2xl rounded-3xl p-6">

          {/* subtle header (optional but premium feel)
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {switchForm === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-500">
              {switchForm === "login"
                ? "Login to continue shopping"
                : "Join and explore premium products"}
            </p>
          </div> */}

          {switchForm === "login" && (
            <LoginForm
              key={"login"}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              switchForm={switchForm}
              setSwitchForm={setSwitchForm}
            />
          )}
          {switchForm === "register" && (
            <RegisterForm
              key={"register"}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
              otpLoading={otpLoading}

              error={error}
              switchForm={switchForm}
              setSwitchForm={setSwitchForm}
              name={name}
              setName={setName}
              step={step}
              setStep={setStep}
            />
          )}
          {switchForm === "forgot-password" && (
            <ForgotPassword
              key={"forgot-password"}
              email={email}
              setEmail={setEmail}
              otpLoading={otpLoading}
              error={error}
              switchForm={switchForm}
              setSwitchForm={setSwitchForm}
              name={name}
              setName={setName}
              step={step}
              setStep={setStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}