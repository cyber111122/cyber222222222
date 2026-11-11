import type { Session } from '@/types';

export interface AuthService {
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
}
