import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import type { ClubEvent, NewsItem, Opportunity } from '@/types';
import { ContentImage } from '@/components/cards/ContentImage';
import { formatDate, formatDateTime, isPast } from '@/utils/format';
import { opportunityCategoryLabels } from '@/utils/opportunityLabels';

const cardClass =
  'group block overflow-hidden rounded-xl2 border border-stone-200 bg-stone-100 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200';

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link to={`/news/${item.id}`} className={cardClass}>
      <ContentImage src={item.imageUrl} alt={item.title} className="h-40 w-full transition-transform duration-500 group-hover:scale-105" />
      <div className="space-y-2 p-4">
        <p className="text-xs text-brand-700">{formatDate(item.publishedAt)}</p>
        <h3 className="line-clamp-2 font-bold leading-snug text-stone-900">{item.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">{item.excerpt}</p>
      </div>
    </Link>
  );
}

export function ClubEventCard({ event }: { event: ClubEvent }) {
  const past = isPast(event.startsAt);
  return (
    <Link to={`/activities/${event.id}`} className={cardClass}>
      <ContentImage src={event.imageUrl} alt={event.title} className="h-36 w-full transition-transform duration-500 group-hover:scale-105" />
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {event.kind === 'workshop' ? 'ورشة' : event.kind === 'event' ? 'فعالية' : 'نشاط'}
          </span>
          {past ? (
            <span className="text-xs text-stone-600">انتهى</span>
          ) : event.registrationOpen ? (
            <span className="text-xs font-semibold text-success-700">التسجيل مفتوح</span>
          ) : (
            <span className="text-xs text-stone-600">التسجيل مغلق</span>
          )}
        </div>
        <h3 className="line-clamp-2 font-bold leading-snug text-stone-900">{event.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={13} />
            {formatDateTime(event.startsAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {event.location}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Link to={`/guide/${opportunity.id}`} className={cardClass}>
      <div className="flex gap-4 p-4">
        <ContentImage src={opportunity.imageUrl} alt={opportunity.title} className="h-20 w-20 shrink-0 rounded-xl" />
        <div className="min-w-0 space-y-1.5">
          <span className="text-xs font-semibold text-brand-700">{opportunityCategoryLabels[opportunity.category]}</span>
          <h3 className="line-clamp-2 font-bold leading-snug text-stone-900">{opportunity.title}</h3>
          <p className="inline-flex items-center gap-1 text-xs text-stone-600">
            <Clock size={12} />
            {opportunity.deadline ? `آخر موعد: ${formatDate(opportunity.deadline)}` : 'التسجيل مفتوح'}
          </p>
        </div>
      </div>
    </Link>
  );
}
