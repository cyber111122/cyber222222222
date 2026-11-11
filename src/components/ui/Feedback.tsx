import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function ListSkeleton({ count = 3, height = 'h-32' }: { count?: number; height?: string }) {
  return (
    <div className="space-y-4" role="status" aria-label="جارٍ التحميل">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={`${height} w-full`} />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl2 border border-dashed border-stone-200 bg-stone-100 px-6 py-10 text-center animate-fade-up">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-brand-700">
        <Inbox size={22} />
      </div>
      <p className="font-semibold text-stone-900">{title}</p>
      {description && <p className="text-sm leading-relaxed text-stone-600">{description}</p>}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl2 border border-danger-300 bg-danger-50 px-6 py-8 text-center">
      <AlertTriangle className="text-danger-700" size={26} />
      <p className="text-sm leading-relaxed text-danger-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
