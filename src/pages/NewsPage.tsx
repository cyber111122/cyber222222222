import { useParams } from 'react-router-dom';
import { ContentImage } from '@/components/cards/ContentImage';
import { NewsCard } from '@/components/cards/ContentCards';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import { formatDate } from '@/utils/format';

export function NewsPage() {
  const { data, loading, error, reload } = useAsync(() => services.content.getNews(), []);

  return (
    <div className="space-y-6">
      <PageHeader title="الأخبار" subtitle="آخر مستجدات نادي المسار." />
      {loading ? (
        <ListSkeleton count={3} height="h-64" />
      ) : error ? (
        <ErrorState message="تعذر تحميل الأخبار. تحقق من اتصالك بالإنترنت." onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="لا توجد أخبار منشورة حاليًا" />
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export function NewsDetailPage() {
  const { id = '' } = useParams();
  const { data, loading, error, reload } = useAsync(() => services.content.getNewsItem(id), [id]);

  if (loading) return <ListSkeleton count={2} height="h-40" />;
  if (error) return <ErrorState message="تعذر تحميل الخبر." onRetry={reload} />;
  if (!data) return <EmptyState title="هذا الخبر غير متاح" description="ربما تم حذفه من الموقع الرسمي." />;

  return (
    <article className="space-y-6">
      <PageHeader title={data.title} showBack />
      <p className="text-sm text-brand-700">{formatDate(data.publishedAt)}</p>
      <ContentImage src={data.imageUrl} alt={data.title} className="h-60 w-full rounded-xl2 border border-stone-200" />
      <p className="whitespace-pre-line leading-loose text-stone-600">{data.body}</p>
    </article>
  );
}
