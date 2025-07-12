import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950">
      <LoginForm />
    </main>
  );
} 