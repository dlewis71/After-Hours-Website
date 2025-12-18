// AuthProfile.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

// --- Token Utility ---
const setToken = (token) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

// --- Message Box ---
const MessageBox = ({ message, type = "error", onClose }) => {
  if (!message) return null;
  const isError = type === "error" || message.startsWith("❌");
  const colorClass = isError
    ? "bg-red-100 border-red-400 text-red-700"
    : "bg-green-100 border-green-400 text-green-700";

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-xl ${colorClass} max-w-sm animate-fade-in`}
      role="alert"
    >
      <p className="font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-lg font-bold hover:text-black focus:outline-none"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

// --- Auth Component ---
export default function AuthProfile({ onLogin }) {
  const [mode, setMode] = useState("login"); // login/register
  const [apiMessage, setApiMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState(null);
  const [trialInfo, setTrialInfo] = useState("");

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password", "");

  const API = axios.create({
    baseURL: "http://localhost:5000/api/user",
    withCredentials: true,
  });

  // --- Trial Countdown ---
  useEffect(() => {
    if (!trialEndDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = trialEndDate - now;

      if (diff <= 0) setTrialInfo("Trial expired");
      else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTrialInfo(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [trialEndDate]);

  // --- Form Submission ---
  const onSubmit = async (data) => {
    setApiMessage(null);

    try {
      let response;

      if (mode === "login") {
        response = await API.post("/login", {
          username: data.username.trim().toLowerCase(),
          password: data.password,
        });
      } else {
        if (data.password !== data.confirmPassword) {
          setApiMessage("❌ Passwords do not match");
          setMessageType("error");
          return;
        }

        response = await API.post("/register", {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          username: data.username.trim().toLowerCase(),
          email: data.email.trim().toLowerCase(),
          password: data.password,
        });
      }

      const { token, trialEnd, ...userData } = response.data;

      // --- Full user payload ---
      const fullUser = {
        ...userData,
        token,
        age: userData.age || "",
        sex: userData.sex || "",
        ethnicity: userData.ethnicity || "",
        hairColor: userData.hairColor || "",
        skinColor: userData.skinColor || "",
        eyeColor: userData.eyeColor || "",
        bodyType: userData.bodyType || "",
        weight: userData.weight || "",
        avatar: userData.avatar || null,
        trialEnd: trialEnd ? new Date(trialEnd).toISOString() : null,
      };

      setToken(token);
      if (onLogin) onLogin(fullUser);
      if (trialEnd) setTrialEndDate(new Date(trialEnd));

      setApiMessage(
        mode === "login"
          ? `✅ Welcome back, ${userData.username || userData.email}!`
          : "✅ Account created successfully!"
      );
      setMessageType("success");
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.message.includes("Network Error")
          ? "❌ Cannot connect to server. Check backend is running."
          : err.message);
      setApiMessage(msg);
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-[#fcefee] px-4 pt-[60px]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#c94f7c] mb-2 animate-slide-down">
            {mode === "login" ? "Member Login" : "Create Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {mode === "login" ? "Sign in to continue" : "Fill out the form to register"}
          </p>
          {trialInfo && (
            <p className="mt-2 text-sm text-gray-500 font-medium">⏳ Trial: {trialInfo}</p>
          )}
        </div>

        {apiMessage && (
          <MessageBox
            message={apiMessage}
            type={messageType}
            onClose={() => setApiMessage(null)}
          />
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  {...register("firstName", { required: "First name is required" })}
                  placeholder="Your first name"
                  className={`w-full px-3 py-2 mt-1 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-[#c94f7c] focus:border-[#c94f7c] transition`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  {...register("lastName", { required: "Last name is required" })}
                  placeholder="Your last name"
                  className={`w-full px-3 py-2 mt-1 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-[#c94f7c] focus:border-[#c94f7c] transition`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="you@example.com"
                  className={`w-full px-3 py-2 mt-1 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-[#c94f7c] focus:border-[#c94f7c] transition`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              placeholder="Your username"
              className={`w-full px-3 py-2 mt-1 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-[#c94f7c] focus:border-[#c94f7c] transition`}
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="********"
                className={`w-full px-3 py-2 mt-1 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-[#c94f7c] focus:border-[#c94f7c] transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
                placeholder="********"
                className={`w-full px-3 py-2 mt-1 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-[#c94f7c] focus:border-[#c94f7c] transition`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-4 bg-[#c94f7c] text-white font-semibold rounded-md hover:bg-[#f8b195] transition disabled:opacity-70"
          >
            {isSubmitting
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setApiMessage(null);
              reset();
            }}
            className="text-[#c94f7c] font-semibold hover:underline focus:outline-none"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
