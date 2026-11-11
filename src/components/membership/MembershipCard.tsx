import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Maximize2, UserRound, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { appConfig } from '@/config/app.config';
import type { Member } from '@/types';
import { formatDate } from '@/utils/format';

function useMembershipQr(membershipNumber: string) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(membershipNumber, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 512,
      color: { dark: '#06132C', light: '#FFFFFF' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [membershipNumber]);

  return dataUrl;
}

function MemberPhoto({ member, className }: { member: Member; className: string }) {
  if (member.photoUrl) {
    return <img src={member.photoUrl} alt={member.fullName} className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-stone-100 text-stone-600 ${className}`} aria-hidden="true">
      <UserRound size={32} />
    </div>
  );
}

function CardFace({ member, qrSize }: { member: Member; qrSize: string }) {
  const qr = useMembershipQr(member.membershipNumber);
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-200 bg-gradient-to-br from-stone-100 via-stone-100 to-white p-6 shadow-glow">
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-brand-50 blur-3xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-700">{appConfig.clubNameAr}</p>
          <p className="mt-0.5 text-[11px] text-stone-600">بطاقة العضوية الرقمية</p>
        </div>
        <Logo size={52} />
      </div>

      <div className="relative mt-6 flex gap-4">
        <MemberPhoto member={member} className="h-24 w-24 shrink-0 rounded-2xl ring-2 ring-brand-400" />
        <div className="min-w-0 space-y-2">
          <p className="text-lg font-bold leading-snug text-stone-900">{member.fullName}</p>
          <p className="font-mono text-sm tracking-wider text-brand-700" dir="ltr">
            {member.membershipNumber}
          </p>
          <StatusBadge status={member.status} />
        </div>
      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] text-stone-600">تاريخ الانخراط</p>
          <p className="text-sm font-semibold text-stone-900">{formatDate(member.joinedAt)}</p>
        </div>
        <div className={`rounded-2xl bg-white p-2 ${qrSize}`}>
          {qr ? (
            <img src={qr} alt={`رمز QR لرقم العضوية ${member.membershipNumber}`} className="h-full w-full" />
          ) : (
            <div className="h-full w-full animate-pulse rounded-lg bg-stone-50" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export function MembershipCard({ member }: { member: Member }) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  return (
    <>
      <div className="space-y-4 animate-fade-up">
        <CardFace member={member} qrSize="h-28 w-28" />
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-100 py-3 text-sm font-semibold text-stone-900 hover:border-brand-200"
        >
          <Maximize2 size={16} />
          عرض البطاقة بملء الشاشة
        </button>
      </div>

      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="بطاقة العضوية بملء الشاشة"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white p-5 animate-fade-up"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="إغلاق"
            className="absolute end-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-900"
          >
            <X size={20} />
          </button>
          <div className="w-full max-w-sm">
            <CardFace member={member} qrSize="h-64 w-64 mx-auto" />
          </div>
        </div>
      )}
    </>
  );
}
