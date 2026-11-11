import type { Session } from '@/types';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;

export function isAdminSession(session: Session | null): boolean {
  return session !== null && (ADMIN_ROLES as readonly string[]).includes(session.role);
}
