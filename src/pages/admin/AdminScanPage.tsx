import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keyboard, ScanLine, Search } from 'lucide-react';
import { QrScanner } from '@/components/admin/QrScanner';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { parseMembershipQr } from '@/services/qr/membershipQr';

const inputClass =
  'w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 font-mono text-sm tracking-wider text-stone-900 placeholder:text-stone-600 focus:border-brand-200 focus:outline-none';

export function AdminScanPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const [manualValue, setManualValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  function openMember(raw: string): boolean {
    const membershipNumber = parseMembershipQr(raw);
    if (!membershipNumber) return false;
    navigate(`/admin/scan/${encodeURIComponent(membershipNumber)}`);
    return true;
  }

  function handleDetect(raw: string) {
    if (openMember(raw)) return;
    setMessage('الرمز الممسوح ليس رقم عضوية صالحًا. حاول مرة أخرى.');
    setScanKey((k) => k + 1);
  }

  function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!openMember(manualValue)) {
      setMessage('صيغة رقم العضوية غير صحيحة. مثال: EM-2026-001');
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="فحص العضوية" subtitle="امسح رمز QR الموجود على بطاقة العضو للتحقق من حالته." />

      <section className="space-y-4">
        {scanning ? (
          <>
            <QrScanner key={scanKey} onDetect={handleDetect} />
            <Button variant="secondary" block onClick={() => setScanning(false)}>
              إيقاف الكاميرا
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setScanning(true);
            }}
            className="flex w-full flex-col items-center gap-4 rounded-xl2 border border-brand-200 bg-stone-100 p-8 text-center transition-all hover:border-brand-200"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
              <ScanLine size={30} />
            </span>
            <span className="font-bold text-stone-900">تشغيل ماسح QR</span>
            <span className="text-sm text-stone-600">سيطلب التطبيق إذن الكاميرا عند أول استخدام.</span>
          </button>
        )}

        {message && (
          <p role="alert" className="rounded-xl border border-warning-300 bg-warning-50 p-3 text-sm text-warning-700">
            {message}
          </p>
        )}
      </section>

      <section className="space-y-4 rounded-xl2 border border-stone-200 bg-stone-100 p-5">
        <div className="flex items-center gap-2">
          <Keyboard size={18} className="text-brand-700" />
          <h2 className="font-bold text-stone-900">البحث اليدوي</h2>
        </div>
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <label htmlFor="manual-membership" className="sr-only">
            رقم العضوية
          </label>
          <input
            id="manual-membership"
            type="text"
            dir="ltr"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            placeholder="EM-2026-001"
            autoCapitalize="characters"
            autoComplete="off"
            className={inputClass}
          />
          <Button type="submit" block icon={<Search size={18} />} disabled={manualValue.trim() === ''}>
            بحث عن العضو
          </Button>
        </form>
      </section>
    </div>
  );
}
