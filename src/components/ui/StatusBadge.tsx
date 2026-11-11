import { membershipStatusMeta } from '@/utils/membershipStatus';
import type { MembershipStatus } from '@/types';

const toneClasses = {
  success: 'bg-success-50 text-success-700 border-success-300',
  warning: 'bg-warning-50 text-warning-700 border-warning-300',
  danger: 'bg-danger-50 text-danger-700 border-danger-300',
  neutral: 'bg-stone-100 text-stone-600 border-stone-200',
};

export function StatusBadge({ status }: { status: MembershipStatus }) {
  const meta = membershipStatusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[meta.tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}
