import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft, IdCard, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { appConfig } from '@/config/app.config';
import { markWelcomeSeen } from '@/utils/onboarding';

const slides = [
  {
    icon: BookOpen,
    title: 'دليل الشباب في جيبك',
    text: 'اكتشف فرص التكوين والمشاركة والتطوع في مجالات العلوم والتكنولوجيا والسياحة.',
  },
  {
    icon: Sparkles,
    title: 'أنشطة وفعاليات النادي',
    text: 'تابع الأنشطة والورشات والفعاليات القادمة، واطلع على آخر أخبار النادي أولًا بأول.',
  },
  {
    icon: IdCard,
    title: 'عضويتك الرقمية',
    text: 'احصل على بطاقة عضوية رقمية مع رمز QR، واطّلع على حالة عضويتك في أي وقت.',
  },
];

export function WelcomePage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.icon;

  function finish() {
    markWelcomeSeen();
    navigate('/', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-white bg-[radial-gradient(circle_at_top,rgba(233,185,73,0.12),transparent_55%)] px-6 pb-10 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
      <div className="flex items-center justify-between">
        <Logo size={44} />
        {!isLast && (
          <button type="button" onClick={finish} className="text-sm font-semibold text-stone-600 hover:text-stone-900">
            تخطي
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center" key={index}>
        <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-brand-200 bg-stone-100 text-brand-700 shadow-glow animate-fade-up">
          <Icon size={48} />
        </div>
        <div className="space-y-3 animate-fade-up">
          <h1 className="text-2xl font-bold leading-snug text-stone-900">{slide.title}</h1>
          <p className="mx-auto max-w-xs leading-loose text-stone-600">{slide.text}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2" role="tablist" aria-label="شرائح التعريف">
          {slides.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`الشريحة ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-brand-600' : 'w-2 bg-stone-100'}`}
            />
          ))}
        </div>

        {isLast ? (
          <Button block onClick={finish}>
            ابدأ الاستكشاف
          </Button>
        ) : (
          <Button block variant="secondary" icon={<ChevronLeft size={18} />} onClick={() => setIndex((i) => i + 1)}>
            التالي
          </Button>
        )}
        <p className="text-center text-xs text-stone-600">{appConfig.clubNameAr}</p>
      </div>
    </div>
  );
}
