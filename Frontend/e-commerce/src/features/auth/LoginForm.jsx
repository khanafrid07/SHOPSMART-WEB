import GoogleLoginButton from "./GoogleLoginButton";
import { Mail, Lock } from "lucide-react";
import { initGoogleAuth } from "./initGoogleAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  handleSubmit,
  switchForm,
  setSwitchForm,
}) {

  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-[100%] sm:w-[24rem] bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 sm:p-7 p-4 space-y-3 sm:space-y-5">

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">
            Shop smart, shop easy
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              className="input input-bordered w-full pl-10 focus:input-primary"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              className="input input-bordered w-full pl-10 focus:input-primary"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        {/* Forgot Password */}
        <div className="text-right">
          <button type="btn" onClick={() => setSwitchForm("forgot-password")} className="text-xs text-blue-600 hover:underline">Forgot password?</button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs text-center">{error}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          className="btn btn-primary w-full rounded-xl"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Social Login */}
        <div className="flex flex-col items-center gap-2">
          <GoogleLoginButton />


        </div>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500">
          Don’t have an account?{" "}
          <button onClick={() => setSwitchForm("register")} className="text-primary font-medium">
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
}