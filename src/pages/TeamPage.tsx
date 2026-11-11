import { ErrorState, EmptyState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import { UserRound } from 'lucide-react';

export function TeamPage() {
  const { data, loading, error, reload } = useAsync(() => services.content.getTeam(), []);

  return (
    <div className="space-y-6">
      <PageHeader title="فريق النادي" subtitle="أعضاء الفريق الذين يشرفون على برامج النادي." showBack />
      {loading ? (
        <ListSkeleton count={3} height="h-24" />
      ) : error ? (
        <ErrorState message="تعذر تحميل أعضاء الفريق." onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="لم يتم نشر أعضاء الفريق بعد" />
      ) : (
        <ul className="space-y-3">
          {data.map((member) => (
            <li key={member.id} className="flex items-center gap-4 rounded-xl2 border border-stone-200 bg-stone-100 p-4">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} loading="lazy" className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-400" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-600" aria-hidden="true">
                  <UserRound size={26} />
                </div>
              )}
              <div>
                <p className="font-bold text-stone-900">{member.name}</p>
                <p className="text-sm text-brand-700">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
