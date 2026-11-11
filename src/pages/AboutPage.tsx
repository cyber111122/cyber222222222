import { Compass, Globe, Rocket, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { SectionHeading, PageHeader } from '@/components/ui/PageHeader';
import { appConfig } from '@/config/app.config';
import { openExternalLink } from '@/utils/openExternalLink';

const goals = [
  'تنمية المهارات العلمية والتقنية لدى الشباب.',
  'نشر ثقافة الابتكار وريادة الأعمال.',
  'تعزيز السياحة الثقافية والمحلية ومعرفة التراث.',
  'تشجيع العمل التطوعي وخدمة المجتمع.',
];

const fields = ['الإعلام الآلي', 'الذكاء الاصطناعي', 'الروبوتيك', 'الطائرات بدون طيار', 'ريادة الأعمال', 'السياحة'];

export function AboutPage() {
  return (
    <div className="space-y-10">
      <PageHeader title="من نحن" />

      <section className="flex flex-col items-center gap-4 text-center animate-fade-up">
        <Logo size={130} />
        <h2 className="text-xl font-bold leading-snug text-brand-700">{appConfig.clubNameAr}</h2>
        <p className="text-xs text-stone-600" dir="ltr">
          {appConfig.clubNameEn}
        </p>
      </section>

      <section className="rounded-xl2 border border-stone-200 bg-stone-100 p-5 leading-loose text-stone-600">
        <p>
          نادي المسار فضاء شبابي يجمع بين العلوم والتكنولوجيا والسياحة، يهدف إلى إعداد جيل واعٍ ومبدع قادر على
          المساهمة في تنمية مجتمعه.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-xl2 border border-stone-200 bg-stone-100 p-5">
          <Compass className="mb-3 text-brand-700" size={22} />
          <h3 className="font-bold text-stone-900">الرؤية</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">شباب مسلح بالعلم والتقنية، فاعل في محيطه.</p>
        </div>
        <div className="rounded-xl2 border border-stone-200 bg-stone-100 p-5">
          <Rocket className="mb-3 text-brand-700" size={22} />
          <h3 className="font-bold text-stone-900">الرسالة</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">برامج تكوينية ومبادرات عملية تفتح آفاق الشباب.</p>
        </div>
      </section>

      <section>
        <SectionHeading title="أهدافنا" />
        <ul className="space-y-3">
          {goals.map((goal) => (
            <li key={goal} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-100 p-4">
              <Target size={18} className="mt-0.5 shrink-0 text-brand-700" />
              <span className="text-sm leading-relaxed text-stone-600">{goal}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading title="مجالات العمل" />
        <div className="flex flex-wrap gap-2">
          {fields.map((field) => (
            <span key={field} className="rounded-full border border-brand-200 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-700">
              {field}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl2 border border-brand-200 bg-brand-50 p-5">
        <div className="flex items-center gap-3">
          <Users className="text-brand-700" size={22} />
          <div>
            <h3 className="font-bold text-stone-900">فريق النادي</h3>
            <p className="text-sm text-stone-600">تعرّف على الأشخاص الذين يقفون خلف المبادرات.</p>
          </div>
        </div>
        <Link to="/team" className="inline-block text-sm font-semibold text-brand-700 hover:text-brand-700">
          عرض الفريق
        </Link>
      </section>

      <section className="space-y-3">
        <Button block variant="secondary" icon={<Globe size={18} />} onClick={() => openExternalLink(appConfig.websiteUrl)}>
          زيارة الموقع الرسمي
        </Button>
      </section>
    </div>
  );
}
