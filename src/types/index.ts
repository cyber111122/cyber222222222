export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'MEMBER';

export type MembershipStatus = 'active' | 'suspended' | 'inactive' | 'pending';

export interface Member {
  id: string;
  membershipNumber: string;
  fullName: string;
  photoUrl: string | null;
  joinedAt: string;
  status: MembershipStatus;
  email?: string;
  phone?: string;
}

export interface Session {
  userId: string;
  email: string;
  role: Role;
  member: Member | null;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string | null;
  publishedAt: string;
}

export type ClubEventKind = 'activity' | 'event' | 'workshop';

export interface ClubEvent {
  id: string;
  kind: ClubEventKind;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  imageUrl: string | null;
  registrationOpen: boolean;
  registrationDeadline: string | null;
}

export type OpportunityCategory =
  | 'training'
  | 'technology'
  | 'robotics'
  | 'drones'
  | 'entrepreneurship'
  | 'culture'
  | 'volunteering'
  | 'competitions'
  | 'forums';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  location: string;
  date: string;
  requirements: string;
  deadline: string | null;
  registrationUrl: string | null;
  imageUrl: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
}

export interface Announcement {
  id: string;
  text: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export type ScanStatus = 'active' | 'suspended' | 'inactive' | 'pending' | 'not_found' | 'invalid';

export interface ScanLogEntry {
  id: string;
  membershipNumber: string;
  status: ScanStatus;
  scannedAt: string;
  adminName: string;
}
