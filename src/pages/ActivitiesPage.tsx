import { useState } from 'react';
import { ClubEventCard } from '@/components/cards/ContentCards';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import type { ClubEventKind } from '@/types';

type Tab = 'all' | ClubEventKind;

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'activity', label: 'الأنشطة' },
  { key: 'event', label: 'الفعاليات' },
  { key: 'workshop', label: 'الورشات' },
];

export function ActivitiesPage() {
  const [tab, setTab] = useState<Tab>('all');
  const { data, loading, error, reload } = useAsync(() => services.content.getClubEvents(), []);

  const visible = (data ?? [])
    .filter((e) => tab === 'all' || e.kind === tab)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return (
    <div className="space-y-6">
      <PageHeader title="الأنشطة والفعاليات" subtitle="تابع أنشطة النادي وورشاته وفعالياته القادمة." />

      <div role="tablist" aria-label="تصنيف الأنشطة" className="grid grid-cols-4 gap-1 rounded-xl border border-stone-200 bg-stone-100 p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={tab === item.key}
            onClick={() => setTab(item.key)}
            className={`rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
              tab === item.key ? 'bg-brand-600 text-white shadow-glow' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton count={3} height="h-64" />
      ) : error ? (
        <ErrorState message="تعذر تحميل الأنشطة. تحقق من اتصالك بالإنترنت." onRetry={reload} />
      ) : visible.length === 0 ? (
        <EmptyState title="لا توجد عناصر في هذا القسم" description="ستظهر هنا عند نشرها من الإدارة." />
      ) : (
        <div className="space-y-4">
          {visible.map((event) => (
            <ClubEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
