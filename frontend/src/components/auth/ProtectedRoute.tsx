'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { token, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/login');
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-indigo-500 text-lg font-semibold animate-pulse">جاري التحقق...</span>
      </div>
    );
  }

  if (!token) return null;

  return <>{children}</>;
};

export default ProtectedRoute; 