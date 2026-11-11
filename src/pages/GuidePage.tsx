import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { OpportunityCard } from '@/components/cards/ContentCards';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';
import type { Opportunity, OpportunityCategory } from '@/types';
import { isPast } from '@/utils/format';
import { opportunityCategoryLabels } from '@/utils/opportunityLabels';

type CategoryFilter = 'all' | OpportunityCategory;
type RegistrationFilter = 'all' | 'open' | 'closed';

const categoryOrder = Object.keys(opportunityCategoryLabels) as OpportunityCategory[];

function isRegistrationOpen(opportunity: Opportunity): boolean {
  return !isPast(opportunity.deadline);
}

export function GuidePage() {
  const { data, loading, error, reload } = useAsync(() => services.content.getOpportunities(), []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [registration, setRegistration] = useState<RegistrationFilter>('all');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data ?? [])
      .filter((o) => category === 'all' || o.category === category)
      .filter((o) => {
        if (registration === 'all') return true;
        return registration === 'open' ? isRegistrationOpen(o) : !isRegistrationOpen(o);
      })
      .filter((o) => !term || o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, query, category, registration]);

  return (
    <div className="space-y-6">
      <PageHeader title="دليل الشباب" subtitle="فرص التكوين والمشاركة والتطوع في مكان واحد." />

      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">ابحث في الفرص</span>
          <Search size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-stone-600" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن فرصة أو مجال..."
            className="w-full rounded-xl border border-stone-200 bg-stone-100 py-3 pe-11 ps-4 text-sm text-stone-900 placeholder:text-stone-600 focus:border-brand-200 focus:outline-none"
          />
        </label>

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]" role="group" aria-label="تصفية حسب المجال">
          {(['all', ...categoryOrder] as CategoryFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              aria-pressed={category === key}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold ${
                category === key
                  ? 'border-brand-200 bg-brand-600 text-white'
                  : 'border-stone-200 bg-stone-100 text-stone-600 hover:border-brand-200'
              }`}
            >
              {key === 'all' ? 'الكل' : opportunityCategoryLabels[key]}
            </button>
          ))}
        </div>

        <div className="flex gap-2" role="group" aria-label="تصفية حسب التسجيل">
          {(
            [
              ['all', 'الكل'],
              ['open', 'التسجيل مفتوح'],
              ['closed', 'التسجيل مغلق'],
            ] as [RegistrationFilter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setRegistration(key)}
              aria-pressed={registration === key}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                registration === key ? 'bg-brand-500/20 text-brand-700' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <ListSkeleton count={4} height="h-28" />
      ) : error ? (
        <ErrorState message="تعذر تحميل فرص الدليل. تحقق من اتصالك بالإنترنت." onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={data && data.length > 0 ? 'لا توجد نتائج مطابقة' : 'لا توجد فرص منشورة حاليًا'}
          description={data && data.length > 0 ? 'جرّب تغيير الفلاتر أو كلمة البحث.' : 'ستظهر الفرص هنا عند نشرها من الإدارة.'}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
}
