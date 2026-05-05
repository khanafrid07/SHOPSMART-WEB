import { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { Mail, Lock, User } from "lucide-react";
import OtpPage from "./OtpPage";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "./authSlice";
import { notifySuccess, notifyError } from "../../utils/notify";
import { useNavigate } from "react-router-dom";
export default function RegisterForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  setSwitchForm,
  name,
  setName,
  step,
  setStep,
  otpLoading
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const [otp, setOtp] = useState("");
  // "form" | "otp"


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (step === "form") {
        // SEND OTP
        await dispatch(
          sendOtp({ name, email, password })
        ).unwrap();

        setStep("otp");
      } else {

        await dispatch(
          verifyOtp({ name, email, otp })
        ).unwrap();

        notifySuccess("Account created successfully")
        setSwitchForm("login")
        setName("")
        setEmail("")
        setPassword("")
        setOtp("")
        setStep("form")
        navigate("/")
      }
    } catch (err) {
      console.error("SEND OTP ERROR:", err);
      notifyError(err?.message || err);
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(
        sendOtp({ name, email, password })
      ).unwrap();
      notifySuccess("OTP sent successfully")
    }
    catch (err) {

      notifyError(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full sm:w-[24rem] bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-7 space-y-5">

        {/* HEADER */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-sm text-gray-500">
            Join us and shop smart, shop easy
          </p>
        </div>


        {step === "form" ? (
          <div className="space-y-4">

            <input
              className="input input-bordered w-full"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />

            <input
              className="input input-bordered w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <input
              className="input input-bordered w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
        ) : (
          <OtpPage otp={otp} setOtp={setOtp} handleResendOtp={handleResendOtp} />
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-xs text-center">{error || "Something went wrong"}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="btn btn-primary w-full rounded-xl"
        >
          {otpLoading
            ? "Processing..."
            : step === "form"
              ? "Send OTP"
              : "Verify OTP"}
        </button>

        {/* SOCIAL */}
        <div className="flex flex-col items-center gap-2">
          <GoogleLoginButton />
        </div>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setSwitchForm("login")}
            className="text-primary font-medium"
          >
            Login
          </button>
        </p>

      </div>
    </form>
  );
}