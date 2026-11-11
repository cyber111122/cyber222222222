import type { Announcement, ClubEvent, ClubEventKind, NewsItem, Opportunity, TeamMember } from '@/types';

export interface ContentService {
  getAnnouncements(): Promise<Announcement[]>;
  getNews(): Promise<NewsItem[]>;
  getNewsItem(id: string): Promise<NewsItem | null>;
  getClubEvents(kind?: ClubEventKind): Promise<ClubEvent[]>;
  getClubEvent(id: string): Promise<ClubEvent | null>;
  getOpportunities(): Promise<Opportunity[]>;
  getOpportunity(id: string): Promise<Opportunity | null>;
  getTeam(): Promise<TeamMember[]>;
}
