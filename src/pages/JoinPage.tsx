import { CheckCircle2, ExternalLink, Info, Target, Users, Zap } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { PageHeader, SectionHeading } from '@/components/ui/PageHeader';
import { appConfig } from '@/config/app.config';
import { openExternalLink } from '@/utils/openExternalLink';

const steps = [
  'افتح صفحة الانخراط الرسمية واملأ البيانات المطلوبة.',
  'أرسل طلبك، وسيصل إلى إدارة النادي ضمن قاعدة البيانات نفسها.',
  'انتظر اعتماد الإدارة، ثم تظهر عضويتك وبطاقتك الرقمية في التطبيق.',
];

const benefits = [
  { icon: Users, text: 'مجتمع شبابي من مختلف التخصصات.' },
  { icon: Zap, text: 'أولوية في التسجيل بالورشات والبرامج.' },
  { icon: Target, text: 'بطاقة عضوية رقمية مع رمز QR للتحقق.' },
];

export function JoinPage() {
  return (
    <div className="space-y-10">
      <PageHeader title="انضم إلى عائلة المسار" subtitle="كن جزءًا من نادٍ يصنع الفرق في مجال العلوم والتكنولوجيا والسياحة." />

      <section className="flex flex-col items-center gap-5 rounded-xl2 border border-brand-200 bg-gradient-to-b from-brand-600/10 to-stone-100 p-6 text-center animate-fade-up">
        <Logo size={96} />
        <p className="text-sm leading-relaxed text-stone-600">
          طلب الانخراط يتم عبر الموقع الرسمي للنادي، ليبقى في قاعدة البيانات نفسها ويخضع للمراجعة الإدارية المعتمدة.
        </p>
        <Button block icon={<ExternalLink size={18} />} onClick={() => openExternalLink(appConfig.joinUrl)}>
          انضم الآن
        </Button>
      </section>

      <section>
        <SectionHeading title="خطوات الانضمام" />
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-4 rounded-xl border border-stone-200 bg-stone-100 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-1 text-sm leading-relaxed text-stone-600">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionHeading title="فوائد الانخراط" />
        <ul className="space-y-3">
          {benefits.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-stone-600">
              <CheckCircle2 size={18} className="shrink-0 text-success-700" />
              <Icon size={16} className="shrink-0 text-brand-700" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-500/10 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-brand-700" />
        <p className="text-sm leading-relaxed text-brand-700">
          بعد اعتماد طلبك، سجّل الدخول بالبريد الإلكتروني المستخدم في الموقع لعرض عضويتك.
        </p>
      </section>
    </div>
  );
}
