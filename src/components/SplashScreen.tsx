import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { appConfig } from '@/config/app.config';

const SPLASH_DURATION_MS = 1600;
const FADE_DURATION_MS = 500;

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setLeaving(true), SPLASH_DURATION_MS);
    const done = window.setTimeout(onDone, SPLASH_DURATION_MS + FADE_DURATION_MS);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white bg-[radial-gradient(circle_at_center,rgba(233,185,73,0.14),transparent_55%)] ${
        leaving ? 'animate-splash-out' : ''
      }`}
      role="status"
      aria-label="جارٍ تحميل التطبيق"
    >
      <div className="animate-fade-up">
        <Logo size={150} />
      </div>
      <div className="text-center animate-fade-up [animation-delay:150ms]">
        <p className="text-xl font-bold text-brand-700">{appConfig.appNameAr}</p>
        <p className="mt-1 text-xs text-stone-600">{appConfig.clubNameAr}</p>
      </div>
    </div>
  );
}
