import { Info, Lock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { appConfig } from '@/config/app.config';

const roleLabels = {
  SUPER_ADMIN: 'مدير عام',
  ADMIN: 'مسؤول',
  EDITOR: 'محرر',
  MEMBER: 'منخرط',
} as const;

export function SettingsPage() {
  const { session } = useAuth();
  const member = session?.member ?? null;

  const rows = [
    { label: 'الاسم واللقب', value: member?.fullName ?? '-' },
    { label: 'رقم العضوية', value: member?.membershipNumber ?? '-', ltr: true },
    { label: 'البريد الإلكتروني', value: session?.email ?? '-', ltr: true },
    { label: 'نوع الحساب', value: session ? roleLabels[session.role] : '-' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="إعدادات الحساب" showBack />

      <section className="divide-y divide-white/10 rounded-xl2 border border-stone-200 bg-stone-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 p-4">
            <span className="text-sm text-stone-600">{row.label}</span>
            <span className="truncate text-sm font-semibold text-stone-900" dir={row.ltr ? 'ltr' : undefined}>
              {row.value}
            </span>
          </div>
        ))}
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-100 p-4">
        <Lock size={18} className="mt-0.5 shrink-0 text-brand-700" />
        <p className="text-sm leading-relaxed text-stone-600">
          بيانات العضوية والصلاحيات تُدار من إدارة النادي، ولا يمكن تعديلها من هذا التطبيق.
        </p>
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-100 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-brand-700" />
        <p className="text-sm leading-relaxed text-stone-600">
          {appConfig.appName} - الإصدار 1.0.0
        </p>
      </section>
    </div>
  );
}
