import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center animate-fade-up">
      <Compass size={48} className="text-brand-700" />
      <h1 className="text-2xl font-bold text-stone-900">هذه الصفحة غير موجودة</h1>
      <p className="text-sm text-stone-600">يبدو أنك خرجت عن المسار. عد إلى الصفحة الرئيسية.</p>
      <Link to="/">
        <Button>الرئيسية</Button>
      </Link>
    </div>
  );
}
