import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from '@/contexts/AuthContext';
import { services } from '@/services';
import { subscribeToAuthChanges } from '@/services/supabaseServices';
import type { Session } from '@/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    services.auth
      .getSession()
      .then((current) => {
        if (!cancelled) setSession(current);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    const unsubscribe = subscribeToAuthChanges((nextSession) => {
      if (!cancelled) setSession(nextSession);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await services.auth.signIn(email, password);
    setSession(next);
    return next;
  }, []);

  const signOut = useCallback(async () => {
    await services.auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, loading, signIn, signOut }),
    [session, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
