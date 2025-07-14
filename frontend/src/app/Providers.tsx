'use client';

import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch, RootState } from '@/store/store';
import { hydrateAuth } from '@/store/slices/authSlice';

function HydrateAuthOnMount({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const hydrated = useSelector((state: RootState) => state.auth.hydrated);
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-zinc-950">
        <span className="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-label="جاري التحميل" />
      </div>
    );
  }
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HydrateAuthOnMount>{children}</HydrateAuthOnMount>
    </Provider>
  );
} 