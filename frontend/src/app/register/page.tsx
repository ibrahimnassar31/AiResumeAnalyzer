import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950">
      <RegisterForm />
    </main>
  );
} 