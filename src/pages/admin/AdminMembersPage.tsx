import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';

export function AdminMembersPage() {
  const { data, loading, error, reload } = useAsync(() => services.members.listMembers(''), []);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter(
      (m) => m.fullName.toLowerCase().includes(term) || m.membershipNumber.toLowerCase().includes(term),
    );
  }, [data, query]);

  return (
    <div className="space-y-6">
      <PageHeader title="المنخرطون" subtitle="ابحث عن عضو بالاسم أو برقم العضوية." showBack />

      <label className="relative block">
        <span className="sr-only">ابحث عن عضو</span>
        <Search size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-stone-600" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="الاسم أو رقم العضوية"
          className="w-full rounded-xl border border-stone-200 bg-stone-100 py-3 pe-11 ps-4 text-sm text-stone-900 placeholder:text-stone-600 focus:border-brand-200 focus:outline-none"
        />
      </label>

      {loading ? (
        <ListSkeleton count={4} height="h-20" />
      ) : error ? (
        <ErrorState message="تعذر تحميل قائمة المنخرطين." onRetry={reload} />
      ) : visible.length === 0 ? (
        <EmptyState title="لا توجد نتائج" description="جرّب اسمًا أو رقم عضوية آخر." />
      ) : (
        <ul className="space-y-3">
          {visible.map((member) => (
            <li key={member.id}>
              <Link
                to={`/admin/scan/${encodeURIComponent(member.membershipNumber)}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-100 p-4 hover:border-brand-200"
              >
                <div className="min-w-0 space-y-2">
                  <p className="truncate font-bold text-stone-900">{member.fullName}</p>
                  <p className="font-mono text-xs tracking-wider text-brand-700" dir="ltr">
                    {member.membershipNumber}
                  </p>
                  <StatusBadge status={member.status} />
                </div>
                <ChevronLeft size={18} className="shrink-0 text-stone-600" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
