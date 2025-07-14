"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { loginUser, logout } from "@/store/slices/authSlice";
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, user, token } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect immediately if already logged in
  useEffect(() => {
    if (token && user) {
      router.replace("/");
    }
  }, [token, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    dispatch(loginUser({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
    setSuccess(false);
    setEmail("");
    setPassword("");
  };

  // Show success and replace history after login
  useEffect(() => {
    if (token && user) {
      setSuccess(true);
      const timeout = setTimeout(() => {
        router.replace("/");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [token, user, router]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-zinc-900/60 rounded-xl p-8 border border-zinc-800 mt-8 shadow-lg"
      aria-label="تسجيل الدخول"
      autoComplete="off"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-100">تسجيل الدخول</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 text-zinc-300 font-medium">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block mb-1 text-zinc-300 font-medium">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}
      {success && (
        <div className="mb-4 text-green-400 text-sm text-center">تم تسجيل الدخول بنجاح!</div>
      )}
      <button
        type="submit"
        className="w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-semibold text-lg disabled:opacity-60"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "جاري الدخول..." : "دخول"}
      </button>
    </form>
  );
};

export default LoginForm; 