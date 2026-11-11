import { useParams } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock, MapPin, ScrollText } from 'lucide-react';
import { ContentImage } from '@/components/cards/ContentImage';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import { formatDate, isPast } from '@/utils/format';
import { opportunityCategoryLabels } from '@/utils/opportunityLabels';
import { openExternalLink } from '@/utils/openExternalLink';

export function GuideDetailPage() {
  const { id = '' } = useParams();
  const { data, loading, error, reload } = useAsync(() => services.content.getOpportunity(id), [id]);

  if (loading) return <ListSkeleton count={2} height="h-40" />;
  if (error) return <ErrorState message="تعذر تحميل تفاصيل الفرصة." onRetry={reload} />;
  if (!data) return <EmptyState title="هذه الفرصة غير متاحة" description="ربما تم إغلاقها أو حذفها من الإدارة." />;

  const registrationOpen = !isPast(data.deadline);

  return (
    <article className="space-y-6">
      <PageHeader title={data.title} showBack />
      <ContentImage src={data.imageUrl} alt={data.title} className="h-56 w-full rounded-xl2 border border-stone-200" />

      <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
        {opportunityCategoryLabels[data.category]}
      </span>

      <p className="leading-relaxed text-stone-600">{data.description}</p>

      <dl className="grid gap-3 rounded-xl2 border border-stone-200 bg-stone-100 p-5">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <dt className="text-xs text-stone-600">المكان</dt>
            <dd className="font-semibold text-stone-900">{data.location}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <dt className="text-xs text-stone-600">التاريخ</dt>
            <dd className="font-semibold text-stone-900">{formatDate(data.date)}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ScrollText size={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <dt className="text-xs text-stone-600">شروط المشاركة</dt>
            <dd className="leading-relaxed text-stone-900">{data.requirements}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock size={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <dt className="text-xs text-stone-600">آخر موعد للتسجيل</dt>
            <dd className="font-semibold text-stone-900">{data.deadline ? formatDate(data.deadline) : 'غير محدد'}</dd>
          </div>
        </div>
      </dl>

      {registrationOpen ? (
        data.registrationUrl ? (
          <Button block icon={<CheckCircle2 size={18} />} onClick={() => openExternalLink(data.registrationUrl!)}>
            سجّل في هذه الفرصة
          </Button>
        ) : (
          <p className="rounded-xl border border-brand-200 bg-brand-500/10 p-4 text-center text-sm text-brand-700">
            التسجيل لهذه الفرصة يتم عبر إدارة النادي مباشرة.
          </p>
        )
      ) : (
        <p className="rounded-xl border border-stone-200 bg-stone-100 p-4 text-center text-sm text-stone-600">
          انتهى باب التسجيل لهذه الفرصة.
        </p>
      )}
    </article>
  );
}
