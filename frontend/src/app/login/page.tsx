"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const { user, token, hydrated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (user && token) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [user, token, hydrated, router]);

  if (!hydrated || checking) return null;

  return <LoginForm />;
};

export default LoginPage; 