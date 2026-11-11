import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { isAdminSession } from '@/utils/roles';

interface LocationState {
  from?: string;
}

const inputClass =
  'w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-600 focus:border-brand-200 focus:outline-none';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const session = await signIn(email, password);
      const fallback = isAdminSession(session) ? '/admin' : '/account';
      navigate(from && from !== '/login' ? from : fallback, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تسجيل الدخول. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center gap-8">
      <div className="flex flex-col items-center gap-4 text-center animate-fade-up">
        <Logo size={88} />
        <div>
          <h1 className="text-2xl font-bold text-stone-900">تسجيل الدخول</h1>
          <p className="mt-1 text-sm text-stone-600">ادخل إلى حسابك لعرض عضويتك وأنشطتك.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up [animation-delay:100ms]" noValidate>
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-semibold text-stone-600">
            البريد الإلكتروني
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm font-semibold text-stone-600">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pe-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-600 hover:text-stone-900"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-danger-300 bg-danger-50 p-3 text-sm text-danger-700">
            {error}
          </p>
        )}

        <Button type="submit" block disabled={submitting} icon={submitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}>
          {submitting ? 'جارٍ الدخول...' : 'دخول'}
        </Button>
      </form>

      <p className="text-center text-sm text-stone-600">
        ليس لديك عضوية؟{' '}
        <Link to="/join" className="font-semibold text-brand-700 hover:text-brand-700">
          انضم إلى النادي
        </Link>
      </p>
    </div>
  );
}
