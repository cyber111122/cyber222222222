import type { AuthService } from '@/services/auth/authService';
import type { ContentService } from '@/services/content/contentService';
import type { ClubStats, MemberService } from '@/services/members/memberService';
import type { NotificationService } from '@/services/notifications/notificationService';
import { supabase } from '@/services/database/supabaseClient';
import type { Announcement, AppNotification, ClubEvent, ClubEventKind, Member, NewsItem, Opportunity, ScanLogEntry, Session, TeamMember } from '@/types';

function throwIfError(error: { message: string } | null, operation: string): void {
  if (error) {
    console.error(`${operation} failed`, error);
    throw new Error('تعذر تحميل البيانات. حاول مرة أخرى.');
  }
}

function mapMember(row: Record<string, unknown>): Member {
  return {
    id: String(row.id),
    membershipNumber: String(row.membership_number ?? ''),
    fullName: String(row.full_name ?? ''),
    photoUrl: typeof row.photo_url === 'string' ? row.photo_url : null,
    joinedAt: String(row.joined_at),
    status: row.status as Member['status'],
    email: typeof row.email === 'string' ? row.email : undefined,
    phone: typeof row.phone === 'string' ? row.phone : undefined,
  };
}

async function getMember(userId: string): Promise<{ member: Member | null; role: Session['role'] }> {
  const { data, error } = await supabase.from('members').select('*').eq('id', userId).maybeSingle();
  throwIfError(error, 'member lookup');
  const row = data as Record<string, unknown> | null;
  const role = (row?.role as Session['role'] | undefined) ?? 'MEMBER';
  return { member: row ? mapMember(row) : null, role };
}

async function sessionFromSupabase(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  throwIfError(error, 'session lookup');
  if (!data.session?.user) return null;
  const { member, role } = await getMember(data.session.user.id);
  return { userId: data.session.user.id, email: data.session.user.email ?? '', role, member };
}

export const supabaseAuthService: AuthService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      console.error('sign in failed', error);
      throw new Error('بيانات الدخول غير صحيحة أو تعذر الاتصال بالنادي.');
    }
    const { member, role } = await getMember(data.user.id);
    return { userId: data.user.id, email: data.user.email ?? email.trim(), role, member };
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    throwIfError(error, 'sign out');
  },
  getSession: sessionFromSupabase,
};

export function subscribeToAuthChanges(onSession: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_, nextSession) => {
    (async () => {
      if (!nextSession?.user) {
        onSession(null);
        return;
      }
      const { member, role } = await getMember(nextSession.user.id);
      onSession({ userId: nextSession.user.id, email: nextSession.user.email ?? '', role, member });
    })().catch((error: unknown) => {
      console.error('auth state refresh failed', error);
      onSession(null);
    });
  });
  return () => data.subscription.unsubscribe();
}

function mapNews(row: Record<string, unknown>): NewsItem {
  return { id: String(row.id), title: String(row.title), excerpt: String(row.excerpt ?? ''), body: String(row.body), imageUrl: typeof row.image_url === 'string' ? row.image_url : null, publishedAt: String(row.published_at) };
}

function mapEvent(row: Record<string, unknown>): ClubEvent {
  return { id: String(row.id), kind: row.kind as ClubEventKind, title: String(row.title), description: String(row.description), location: String(row.location ?? ''), startsAt: String(row.starts_at), imageUrl: typeof row.image_url === 'string' ? row.image_url : null, registrationOpen: Boolean(row.registration_open), registrationDeadline: typeof row.registration_deadline === 'string' ? row.registration_deadline : null };
}

function mapOpportunity(row: Record<string, unknown>): Opportunity {
  return { id: String(row.id), title: String(row.title), description: String(row.description), category: row.category as Opportunity['category'], location: String(row.location ?? ''), date: String(row.date), requirements: String(row.requirements ?? ''), deadline: typeof row.deadline === 'string' ? row.deadline : null, registrationUrl: typeof row.registration_url === 'string' ? row.registration_url : null, imageUrl: typeof row.image_url === 'string' ? row.image_url : null };
}

export const supabaseContentService: ContentService = {
  async getAnnouncements() {
    const { data, error } = await supabase.from('announcements').select('id, text').eq('published', true).order('created_at', { ascending: false });
    throwIfError(error, 'announcements lookup');
    return (data ?? []) as Announcement[];
  },
  async getNews() {
    const { data, error } = await supabase.from('news_items').select('*').eq('published', true).order('published_at', { ascending: false });
    throwIfError(error, 'news lookup');
    return ((data ?? []) as Record<string, unknown>[]).map(mapNews);
  },
  async getNewsItem(id) {
    const { data, error } = await supabase.from('news_items').select('*').eq('id', id).eq('published', true).maybeSingle();
    throwIfError(error, 'news item lookup');
    return data ? mapNews(data as Record<string, unknown>) : null;
  },
  async getClubEvents(kind) {
    let query = supabase.from('club_events').select('*').eq('published', true).order('starts_at', { ascending: true });
    if (kind) query = query.eq('kind', kind);
    const { data, error } = await query;
    throwIfError(error, 'events lookup');
    return ((data ?? []) as Record<string, unknown>[]).map(mapEvent);
  },
  async getClubEvent(id) {
    const { data, error } = await supabase.from('club_events').select('*').eq('id', id).eq('published', true).maybeSingle();
    throwIfError(error, 'event lookup');
    return data ? mapEvent(data as Record<string, unknown>) : null;
  },
  async getOpportunities() {
    const { data, error } = await supabase.from('opportunities').select('*').eq('published', true).order('date', { ascending: true });
    throwIfError(error, 'opportunities lookup');
    return ((data ?? []) as Record<string, unknown>[]).map(mapOpportunity);
  },
  async getOpportunity(id) {
    const { data, error } = await supabase.from('opportunities').select('*').eq('id', id).eq('published', true).maybeSingle();
    throwIfError(error, 'opportunity lookup');
    return data ? mapOpportunity(data as Record<string, unknown>) : null;
  },
  async getTeam() {
    const { data, error } = await supabase.from('team_members').select('id, name, role, photo_url').eq('published', true).order('name');
    throwIfError(error, 'team lookup');
    return ((data ?? []) as Record<string, unknown>[]).map((row): TeamMember => ({ id: String(row.id), name: String(row.name), role: String(row.role), photoUrl: typeof row.photo_url === 'string' ? row.photo_url : null }));
  },
};

export const supabaseMemberService: MemberService = {
  async findMemberByNumber(membershipNumber) {
    const { data, error } = await supabase.from('members').select('*').eq('membership_number', membershipNumber.trim().toUpperCase()).maybeSingle();
    throwIfError(error, 'member lookup');
    return data ? mapMember(data as Record<string, unknown>) : null;
  },
  async listMembers(search) {
    let query = supabase.from('members').select('*').order('full_name');
    const term = search.trim();
    if (term) query = query.or(`full_name.ilike.%${term}%,membership_number.ilike.%${term}%`);
    const { data, error } = await query;
    throwIfError(error, 'members lookup');
    return ((data ?? []) as Record<string, unknown>[]).map(mapMember);
  },
  async getStats(): Promise<ClubStats> {
    const members = await this.listMembers('');
    return { totalMembers: members.length, activeMemberships: members.filter((m) => m.status === 'active').length, suspendedMemberships: members.filter((m) => m.status === 'suspended').length, membershipRequests: members.filter((m) => m.status === 'pending').length };
  },
  async getScanLog() {
    const { data, error } = await supabase.from('scan_logs').select('*').order('scanned_at', { ascending: false });
    throwIfError(error, 'scan log lookup');
    return ((data ?? []) as Record<string, unknown>[]).map((row): ScanLogEntry => ({ id: String(row.id), membershipNumber: String(row.membership_number), status: row.status as ScanLogEntry['status'], scannedAt: String(row.scanned_at), adminName: String(row.admin_name) }));
  },
  async recordScan(entry) {
    const { data, error } = await supabase.from('scan_logs').insert({ membership_number: entry.membershipNumber, status: entry.status, admin_name: entry.adminName }).select('*').single();
    throwIfError(error, 'scan log insert');
    const row = data as Record<string, unknown>;
    return { id: String(row.id), membershipNumber: String(row.membership_number), status: row.status as ScanLogEntry['status'], scannedAt: String(row.scanned_at), adminName: String(row.admin_name) };
  },
};

export const supabaseNotificationService: NotificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    return [];
  },
};
