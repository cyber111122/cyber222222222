import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BookOpen, CalendarDays, ExternalLink, HandHeart, IdCard, Megaphone, UserPlus } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ClubEventCard, NewsCard, OpportunityCard } from '@/components/cards/ContentCards';
import { ListSkeleton, ErrorState, EmptyState } from '@/components/ui/Feedback';
import { SectionHeading } from '@/components/ui/PageHeader';
import { appConfig } from '@/config/app.config';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import { openExternalLink } from '@/utils/openExternalLink';
import { isPast } from '@/utils/format';

const actions = [
  { label: 'انضم إلى النادي', icon: UserPlus, external: true },
  { label: 'بطاقة العضوية', icon: IdCard, to: '/card' },
  { label: 'دليل الشباب', icon: BookOpen, to: '/guide' },
  { label: 'الأنشطة', icon: CalendarDays, to: '/activities' },
] as const;

function AnnouncementTicker() {
  const { data, loading } = useAsync(() => services.content.getAnnouncements(), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!data || data.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % data.length), 5000);
    return () => window.clearInterval(timer);
  }, [data]);

  if (loading) return <div className="skeleton h-12 w-full" />;
  if (!data || data.length === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3" role="status" aria-live="polite">
      <Megaphone size={18} className="shrink-0 text-brand-700" />
      <p key={index} className="text-sm leading-relaxed text-brand-700 animate-fade-up">
        {data[index].text}
      </p>
    </div>
  );
}

export function HomePage() {
  const events = useAsync(() => services.content.getClubEvents(), []);
  const news = useAsync(() => services.content.getNews(), []);
  const opportunities = useAsync(() => services.content.getOpportunities(), []);

  const upcoming = events.data?.filter((e) => !isPast(e.startsAt)) ?? [];
  const volunteering = opportunities.data?.filter((o) => o.category === 'volunteering') ?? [];

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between gap-4 animate-fade-up">
        <div className="flex items-center gap-3">
          <Logo size={52} />
          <div>
            <p className="text-xs text-stone-600">مرحبًا بك في</p>
            <h1 className="text-lg font-bold leading-snug text-stone-900">{appConfig.appNameAr}</h1>
          </div>
        </div>
        <Link
          to="/notifications"
          aria-label="الإشعارات"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-900 hover:bg-stone-100"
        >
          <Bell size={20} />
        </Link>
      </header>

      <section className="space-y-4 animate-fade-up [animation-delay:80ms]">
        <div className="rounded-xl2 border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-100 p-5">
          <p className="text-sm leading-relaxed text-stone-600">
            {appConfig.clubNameAr} يفتح لك أبواب العلم والتقنية والسياحة، ويرافقك في رحلتك نحو المستقبل.
          </p>
        </div>
        <AnnouncementTicker />
      </section>

      <section className="grid grid-cols-2 gap-3 animate-fade-up [animation-delay:120ms]">
        {actions.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon size={20} />
              </span>
              <span className="text-sm font-semibold text-stone-900">{action.label}</span>
              {'external' in action && <ExternalLink size={14} className="absolute end-4 top-4 text-stone-600" />}
            </>
          );
          const className =
            'relative flex flex-col items-start gap-3 rounded-xl2 border border-stone-200 bg-stone-100 p-4 text-start transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200';
          return 'external' in action ? (
            <button key={action.label} type="button" onClick={() => openExternalLink(appConfig.joinUrl)} className={className}>
              {content}
            </button>
          ) : (
            <Link key={action.label} to={action.to} className={className}>
              {content}
            </Link>
          );
        })}
      </section>

      <section aria-labelledby="home-upcoming">
        <SectionHeading
          title="الأنشطة القادمة"
          action={<Link to="/activities" className="text-sm font-semibold text-brand-700">عرض الكل</Link>}
        />
        {events.loading ? (
          <ListSkeleton count={2} height="h-56" />
        ) : events.error ? (
          <ErrorState message="تعذر تحميل الأنشطة. تحقق من اتصالك بالإنترنت." onRetry={events.reload} />
        ) : upcoming.length === 0 ? (
          <EmptyState title="لا توجد أنشطة قادمة حاليًا" description="ستظهر هنا الأنشطة والفعاليات فور نشرها." />
        ) : (
          <div className="space-y-4">
            {upcoming.slice(0, 2).map((event) => (
              <ClubEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="home-news">
        <SectionHeading
          title="آخر الأخبار"
          action={<Link to="/news" className="text-sm font-semibold text-brand-700">عرض الكل</Link>}
        />
        {news.loading ? (
          <ListSkeleton count={1} height="h-56" />
        ) : news.error ? (
          <ErrorState message="تعذر تحميل الأخبار. تحقق من اتصالك بالإنترنت." onRetry={news.reload} />
        ) : !news.data || news.data.length === 0 ? (
          <EmptyState title="لا توجد أخبار منشورة حاليًا" description="ستظهر الأخبار هنا عند نشرها من إدارة النادي." />
        ) : (
          <div className="space-y-4">
            {news.data.slice(0, 2).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="home-opportunities">
        <SectionHeading
          title="فرص الشباب"
          action={<Link to="/guide" className="text-sm font-semibold text-brand-700">دليل الشباب</Link>}
        />
        {opportunities.loading ? (
          <ListSkeleton count={2} height="h-28" />
        ) : opportunities.error ? (
          <ErrorState message="تعذر تحميل الفرص. تحقق من اتصالك بالإنترنت." onRetry={opportunities.reload} />
        ) : !opportunities.data || opportunities.data.length === 0 ? (
          <EmptyState title="لا توجد فرص منشورة حاليًا" description="ستظهر الفرص هنا عند نشرها من إدارة النادي." />
        ) : (
          <div className="space-y-4">
            {opportunities.data.slice(0, 3).map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="home-volunteering" className="rounded-xl2 border border-brand-200 bg-gradient-to-br from-brand-600/15 to-stone-100 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            <HandHeart size={22} />
          </span>
          <div className="min-w-0">
            <h2 id="home-volunteering" className="font-bold text-stone-900">فرص المشاركة والتطوع</h2>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">
              شارك في المبادرات التطوعية وساهم في خدمة مجتمعك.
            </p>
          </div>
        </div>
        {volunteering.length > 0 && (
          <div className="mt-4 space-y-3">
            {volunteering.slice(0, 1).map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </section>

      <section className="flex items-center justify-center gap-2 pb-4 text-xs text-stone-600">
        <Megaphone size={14} />
        <Link to="/about" className="hover:text-stone-900">من نحن</Link>
      </section>
    </div>
  );
}
