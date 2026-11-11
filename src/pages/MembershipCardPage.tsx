import { CalendarClock, Mail } from 'lucide-react';
import { MembershipCard } from '@/components/membership/MembershipCard';
import { EmptyState } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { membershipStatusMeta } from '@/utils/membershipStatus';

export function MembershipCardPage() {
  const { session } = useAuth();
  const member = session?.member ?? null;

  if (!member) {
    return (
      <div className="space-y-6">
        <PageHeader title="بطاقتي" />
        <EmptyState
          title="لا توجد عضوية مرتبطة بحسابك"
          description="بعد اعتماد عضويتك من الإدارة ستظهر بطاقتك الرقمية هنا."
        />
      </div>
    );
  }

  if (member.status !== 'active') {
    return (
      <div className="space-y-6">
        <PageHeader title="بطاقتي" />
        <div className="space-y-4 rounded-xl2 border border-warning-300 bg-warning-50 p-6 text-center animate-fade-up">
          <StatusBadge status={member.status} />
          <p className="leading-relaxed text-stone-600">{membershipStatusMeta[member.status].description}</p>
          <p className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <Mail size={16} />
            للاستفسار تواصل مع إدارة النادي.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="بطاقتي" subtitle="أظهر رمز QR لفريق النادي عند الحاجة للتحقق من عضويتك." />
      <MembershipCard member={member} />
      <p className="flex items-center justify-center gap-2 text-xs text-stone-600">
        <CalendarClock size={14} />
        تحتوي البطاقة على رقم العضوية فقط داخل رمز QR.
      </p>
    </div>
  );
}
