"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
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

  return <RegisterForm />;
};

export default RegisterPage; 