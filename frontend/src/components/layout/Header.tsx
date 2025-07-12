"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold text-indigo-400">ibrahimAi</Link>
        </div>
        <div className="flex items-center gap-4">
          {token && user ? (
            <>
              <span className="text-zinc-100 font-medium text-sm hidden sm:inline-block">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">دخول</Link>
              <Link href="/register" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">تسجيل</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; 