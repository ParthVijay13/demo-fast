"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Allow access if authenticated or if no auth provider is available
  const shouldAllowAccess = isAuthenticated || !user;

  useEffect(() => {
    if (!loading && !shouldAllowAccess) {
      router.push('/login');
    }
  }, [user, loading, router, shouldAllowAccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center mx-auto justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!shouldAllowAccess) {
    return null;
  }

  return <>{children}</>;
}