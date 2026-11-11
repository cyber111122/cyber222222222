import { Clock } from 'lucide-react';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import { formatDateTime } from '@/utils/format';

export function NotificationsPage() {
  const { data, loading, error, reload } = useAsync(() => services.notifications.getNotifications(), []);

  return (
    <div className="space-y-6">
      <PageHeader title="الإشعارات" subtitle="آخر التحديثات المتعلقة بعضويتك وأنشطتك." showBack />
      {loading ? (
        <ListSkeleton count={3} height="h-24" />
      ) : error ? (
        <ErrorState message="تعذر تحميل الإشعارات." onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="لا توجد إشعارات حاليًا"
          description="ستظهر هنا إشعارات الأنشطة وتحديثات حالة العضوية."
        />
      ) : (
        <ul className="space-y-3">
          {data.map((item) => (
            <li
              key={item.id}
              className={`rounded-xl border p-4 ${item.read ? 'border-stone-200 bg-stone-100' : 'border-brand-200 bg-brand-50'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-stone-900">{item.title}</p>
                {!item.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="غير مقروء" />}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{item.body}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-600">
                <Clock size={12} />
                {formatDateTime(item.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
