"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";
import { FiSettings, FiLogOut } from "react-icons/fi";
import React from "react";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, callback: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  return (
    <header className="relative z-10 flex items-center justify-between px-8 md:px-24 py-4 md:py-4">
      <Link
        href="/"
        className="flex items-center gap-4"
        tabIndex={0}
        aria-label="الصفحة الرئيسية"
        role="link"
      >
        <img src="/logo.jpg" alt="شعار سيرةAI" className="w-14 h-14 rounded shadow-lg" />
      </Link>
      <nav className="hidden md:flex gap-14 text-lg font-medium">
        <a
          href="#features"
          className="hover:text-indigo-400 transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring focus-visible:ring-indigo-400/60"
          tabIndex={0}
          aria-label="المميزات"
        >المميزات</a>
        <a
          href="#process"
          className="hover:text-indigo-400 transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring focus-visible:ring-indigo-400/60"
          tabIndex={0}
          aria-label="كيف يعمل"
        >كيف يعمل</a>
        <a
          href="#pricing"
          className="hover:text-indigo-400 transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring focus-visible:ring-indigo-400/60"
          tabIndex={0}
          aria-label="الأسعار"
        >الأسعار</a>
        <a
          href="#contact"
          className="hover:text-indigo-400 transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring focus-visible:ring-indigo-400/60"
          tabIndex={0}
          aria-label="تواصل معنا"
        >تواصل معنا</a>
      </nav>
      <div className="flex items-center gap-4">
        {token && user ? (
          <>
            <button
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors shadow focus:outline-none focus-visible:ring focus-visible:ring-indigo-400/60"
              tabIndex={0}
              aria-label="الإعدادات"
              onClick={() => {}}
              onKeyDown={e => handleKeyDown(e, () => {})}
            >
              <FiSettings className="w-6 h-6 text-zinc-300" aria-hidden="true" focusable="false" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors shadow focus:outline-none focus-visible:ring focus-visible:ring-pink-400/60"
              tabIndex={0}
              aria-label="تسجيل الخروج"
              onClick={handleLogout}
              onKeyDown={e => handleKeyDown(e, handleLogout)}
            >
              <FiLogOut className="w-6 h-6 text-zinc-300" aria-hidden="true" focusable="false" />
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors px-4 py-2 rounded focus:outline-none focus-visible:ring focus-visible:ring-indigo-400/60"
              tabIndex={0}
              aria-label="دخول"
              role="link"
            >
              دخول
            </Link>
            <Link
              href="/register"
              className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors px-4 py-2 rounded focus:outline-none focus-visible:ring focus-visible:ring-indigo-400/60"
              tabIndex={0}
              aria-label="تسجيل"
              role="link"
            >
              تسجيل
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 