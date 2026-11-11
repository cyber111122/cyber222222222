import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showBack?: boolean;
}

export function PageHeader({ title, subtitle, action, showBack = false }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="flex items-start justify-between gap-4 pb-6 pt-2 animate-fade-up">
      <div className="flex min-w-0 items-start gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="رجوع"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-900 hover:bg-stone-100"
          >
            <ChevronRight size={20} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-stone-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm leading-relaxed text-stone-600">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-stone-900">{title}</h2>
      {action}
    </div>
  );
}
