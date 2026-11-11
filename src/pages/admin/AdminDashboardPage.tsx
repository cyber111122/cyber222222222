import { Link } from 'react-router-dom';
import { BadgeCheck, CircleSlash, ScanLine, UserPlus, Users, Clock, Search } from 'lucide-react';
import { EmptyState, ErrorState, ListSkeleton, Skeleton } from '@/components/ui/Feedback';
import { PageHeader, SectionHeading } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import { formatDateTime } from '@/utils/format';
import { scanStatusMeta } from '@/utils/scanStatus';

const statIcons = [Users, BadgeCheck, CircleSlash, UserPlus] as const;

export function AdminDashboardPage() {
  const stats = useAsync(() => services.members.getStats(), []);
  const log = useAsync(() => services.members.getScanLog(), []);

  const statCards = stats.data
    ? [
        { label: 'عدد المنخرطين', value: stats.data.totalMembers },
        { label: 'عضويات نشطة', value: stats.data.activeMemberships },
        { label: 'عضويات موقوفة', value: stats.data.suspendedMemberships },
        { label: 'طلبات انخراط', value: stats.data.membershipRequests },
      ]
    : [];

  return (
    <div className="space-y-8">
      <PageHeader title="لوحة الإدارة" subtitle="متابعة المنخرطين وفحص العضويات." />

      <section aria-labelledby="admin-stats">
        <SectionHeading title="إحصائيات سريعة" />
        {stats.loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : stats.error ? (
          <ErrorState message="تعذر تحميل الإحصائيات." onRetry={stats.reload} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((card, i) => {
              const Icon = statIcons[i];
              return (
                <div key={card.label} className="rounded-xl2 border border-stone-200 bg-stone-100 p-4">
                  <Icon size={18} className="text-brand-700" />
                  <p className="mt-3 text-2xl font-bold text-stone-900">{card.value}</p>
                  <p className="mt-1 text-xs text-stone-600">{card.label}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3" aria-label="اختصارات الإدارة">
        <Link
          to="/admin/scan"
          className="flex flex-col gap-3 rounded-xl2 border border-brand-200 bg-brand-50 p-4 hover:border-brand-200"
        >
          <ScanLine size={22} className="text-brand-700" />
          <span className="font-bold text-stone-900">فحص عضوية</span>
        </Link>
        <Link
          to="/admin/members"
          className="flex flex-col gap-3 rounded-xl2 border border-stone-200 bg-stone-100 p-4 hover:border-brand-200"
        >
          <Search size={22} className="text-brand-700" />
          <span className="font-bold text-stone-900">بحث عن المنخرطين</span>
        </Link>
      </section>

      <section aria-labelledby="admin-log">
        <SectionHeading title="آخر عمليات الفحص" />
        {log.loading ? (
          <ListSkeleton count={3} height="h-16" />
        ) : log.error ? (
          <ErrorState message="تعذر تحميل سجل الفحص." onRetry={log.reload} />
        ) : !log.data || log.data.length === 0 ? (
          <EmptyState title="لا توجد عمليات فحص بعد" description="ستظهر هنا نتائج الفحوصات التي تتم عبر الماسح." />
        ) : (
          <ul className="space-y-3">
            {log.data.slice(0, 5).map((entry) => (
              <li key={entry.id} className="rounded-xl border border-stone-200 bg-stone-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm tracking-wider text-stone-900" dir="ltr">
                    {entry.membershipNumber}
                  </span>
                  <span className="text-xs font-semibold text-stone-600">{scanStatusMeta[entry.status].label}</span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-600">
                  <Clock size={12} />
                  {formatDateTime(entry.scannedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
