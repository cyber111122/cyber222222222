import { useParams } from 'react-router-dom';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { ContentImage } from '@/components/cards/ContentImage';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import { formatDate, formatDateTime, isPast } from '@/utils/format';

const kindLabels = { activity: 'نشاط', event: 'فعالية', workshop: 'ورشة' } as const;

export function ClubEventDetailPage() {
  const { id = '' } = useParams();
  const { data, loading, error, reload } = useAsync(() => services.content.getClubEvent(id), [id]);

  if (loading) return <ListSkeleton count={2} height="h-40" />;
  if (error) return <ErrorState message="تعذر تحميل تفاصيل النشاط." onRetry={reload} />;
  if (!data) return <EmptyState title="هذا النشاط غير متاح" description="ربما تم إلغاؤه أو حذفه من الإدارة." />;

  const past = isPast(data.startsAt);
  const registrationOpen = data.registrationOpen && !isPast(data.registrationDeadline);

  return (
    <article className="space-y-6">
      <PageHeader title={data.title} showBack />
      <ContentImage src={data.imageUrl} alt={data.title} className="h-56 w-full rounded-xl2 border border-stone-200" />

      <span className="inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700">
        {kindLabels[data.kind]}
      </span>

      <p className="leading-relaxed text-stone-600">{data.description}</p>

      <dl className="grid gap-3 rounded-xl2 border border-stone-200 bg-stone-100 p-5">
        <div className="flex items-start gap-3">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <dt className="text-xs text-stone-600">الموعد</dt>
            <dd className="font-semibold text-stone-900">{formatDateTime(data.startsAt)}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <dt className="text-xs text-stone-600">المكان</dt>
            <dd className="font-semibold text-stone-900">{data.location}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock size={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <dt className="text-xs text-stone-600">آخر موعد للتسجيل</dt>
            <dd className="font-semibold text-stone-900">
              {data.registrationDeadline ? formatDate(data.registrationDeadline) : 'غير محدد'}
            </dd>
          </div>
        </div>
      </dl>

      {past ? (
        <p className="rounded-xl border border-stone-200 bg-stone-100 p-4 text-center text-sm text-stone-600">
          انتهى هذا النشاط.
        </p>
      ) : registrationOpen ? (
        <p className="rounded-xl border border-success-300 bg-success-50 p-4 text-center text-sm text-success-700">
          التسجيل مفتوح. سيتوفر تسجيل المشاركة من داخل التطبيق قريبًا.
        </p>
      ) : (
        <p className="rounded-xl border border-stone-200 bg-stone-100 p-4 text-center text-sm text-stone-600">
          التسجيل مغلق لهذا النشاط.
        </p>
      )}
    </article>
  );
}
