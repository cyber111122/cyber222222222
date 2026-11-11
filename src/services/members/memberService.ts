import type { Member, ScanLogEntry } from '@/types';

export interface ClubStats {
  totalMembers: number;
  activeMemberships: number;
  suspendedMemberships: number;
  membershipRequests: number;
}

export interface MemberService {
  findMemberByNumber(membershipNumber: string): Promise<Member | null>;
  listMembers(search: string): Promise<Member[]>;
  getStats(): Promise<ClubStats>;
  getScanLog(): Promise<ScanLogEntry[]>;
  recordScan(entry: Omit<ScanLogEntry, 'id' | 'scannedAt'>): Promise<ScanLogEntry>;
}
