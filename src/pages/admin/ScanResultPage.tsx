import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Copy, Mail, Phone, ScanLine, ShieldAlert, UserRound, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorState, Skeleton } from '@/components/ui/Feedback';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { services } from '@/services';
import { parseMembershipQr } from '@/services/qr/membershipQr';
import type { Member, ScanStatus } from '@/types';
import { formatDate } from '@/utils/format';
import { scanStatusMeta } from '@/utils/scanStatus';

interface ScanOutcome {
  status: ScanStatus;
  member: Member | null;
}

const heroTone: Record<ScanStatus, { ring: string; text: string; icon: 'ok' | 'bad' | 'info' }> = {
  active: { ring: 'border-success-300 bg-success-50', text: 'text-success-700', icon: 'ok' },
  pending: { ring: 'border-warning-300 bg-warning-50', text: 'text-warning-700', icon: 'info' },
  inactive: { ring: 'border-warning-300 bg-warning-50', text: 'text-warning-700', icon: 'info' },
  suspended: { ring: 'border-danger-300 bg-danger-50', text: 'text-danger-700', icon: 'bad' },
  not_found: { ring: 'border-stone-200 bg-stone-100', text: 'text-stone-600', icon: 'bad' },
  invalid: { ring: 'border-stone-200 bg-stone-100', text: 'text-stone-600', icon: 'bad' },
};

function ResultIcon({ kind }: { kind: 'ok' | 'bad' | 'info' }) {
  if (kind === 'ok') return <CheckCircle2 size={44} />;
  if (kind === 'info') return <Info size={44} />;
  return <XCircle size={44} />;
}

function AdminScanResultPanel({ membershipNumber, status, member }: { membershipNumber: string; status: ScanStatus; member: Member | null }) {
  const { session } = useAuth();
  const [copied, setCopied] = useState(false);
  const canSeeContacts = session?.role === 'SUPER_ADMIN' || session?.role === 'ADMIN';

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyNumber() {
    await navigator.clipboard.writeText(membershipNumber);
    setCopied(true);
  }

  const tone = heroTone[status];
  const meta = scanStatusMeta[status];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className={`flex flex-col items-center gap-3 rounded-xl2 border p-6 text-center ${tone.ring} ${tone.text}`} role="status">
        <ResultIcon kind={tone.icon} />
        <p className="text-lg font-bold">{meta.label}</p>
        <p className="font-mono text-sm tracking-wider text-stone-900/80" dir="ltr">
          {membershipNumber}
        </p>
      </div>

      {member ? (
        <section className="space-y-4 rounded-xl2 border border-stone-200 bg-stone-100 p-5">
          <div className="flex items-center gap-4">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.fullName} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-brand-400" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100 text-stone-600" aria-hidden="true">
                <UserRound size={30} />
              </div>
            )}
            <div className="min-w-0 space-y-2">
              <p className="text-lg font-bold text-stone-900">{member.fullName}</p>
              <StatusBadge status={member.status} />
            </div>
          </div>

          <dl className="divide-y divide-white/10 text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-stone-600">تاريخ الانخراط</dt>
              <dd className="font-semibold text-stone-900">{formatDate(member.joinedAt)}</dd>
            </div>
            {canSeeContacts && member.email && (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="flex items-center gap-2 text-stone-600">
                  <Mail size={14} />
                  البريد
                </dt>
                <dd className="truncate font-semibold text-stone-900" dir="ltr">{member.email}</dd>
              </div>
            )}
            {canSeeContacts && member.phone && (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="flex items-center gap-2 text-stone-600">
                  <Phone size={14} />
                  الهاتف
                </dt>
                <dd className="font-semibold text-stone-900" dir="ltr">{member.phone}</dd>
              </div>
            )}
          </dl>
        </section>
      ) : (
        <p className="rounded-xl border border-stone-200 bg-stone-100 p-4 text-center text-sm leading-relaxed text-stone-600">
          لم يتم العثور على عضو بهذا الرقم. تحقق من الرقم أو راجع سجل المنخرطين.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {member && (
          <Button variant="secondary" icon={<Copy size={16} />} onClick={copyNumber}>
            {copied ? 'تم النسخ' : 'نسخ الرقم'}
          </Button>
        )}
        <Link to="/admin/scan" className={member ? '' : 'col-span-2'}>
          <Button block variant="secondary" icon={<ScanLine size={16} />}>
            فحص عضو آخر
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function ScanResultPage() {
  const { membershipNumber: rawParam = '' } = useParams();
  const { session } = useAuth();
  const membershipNumber = parseMembershipQr(rawParam);
  const { data, loading, error, reload } = useAsync<ScanOutcome>(async () => {
    if (!membershipNumber) return { status: 'invalid', member: null };
    const member = await services.members.findMemberByNumber(membershipNumber);
    const status: ScanStatus = member ? member.status : 'not_found';
    await services.members.recordScan({
      membershipNumber,
      status,
      adminName: session?.email ?? 'مسؤول',
    });
    return { status, member };
  }, [membershipNumber]);

  return (
    <div className="space-y-6">
      <PageHeader title="نتيجة الفحص" showBack />

      {loading ? (
        <div className="space-y-4" role="status" aria-label="جارٍ التحقق">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : error ? (
        <ErrorState message="تعذر التحقق من العضوية بسبب مشكلة في الاتصال." onRetry={reload} />
      ) : data && membershipNumber ? (
        <AdminScanResultPanel membershipNumber={membershipNumber} status={data.status} member={data.member} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl2 border border-danger-300 bg-danger-50 p-6 text-center">
          <ShieldAlert size={36} className="text-danger-700" />
          <p className="text-sm leading-relaxed text-danger-700">رمز QR غير صالح. يجب أن يحتوي الرمز على رقم عضوية فقط.</p>
          <Link to="/admin/scan">
            <Button>العودة إلى الماسح</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
