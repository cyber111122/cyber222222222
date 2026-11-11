import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isAdminSession } from '@/utils/roles';
import { ListSkeleton } from '@/components/ui/Feedback';

function AuthCheck({ children, requireAdmin }: { children: ReactNode; requireAdmin: boolean }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="pt-8">
        <ListSkeleton count={2} height="h-40" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdminSession(session)) {
    return <Navigate to="/account" replace />;
  }

  return children;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  return <AuthCheck requireAdmin={false}>{children}</AuthCheck>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  return <AuthCheck requireAdmin>{children}</AuthCheck>;
}
