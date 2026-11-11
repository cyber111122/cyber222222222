import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, LogOut, Settings, ShieldCheck, IdCard, UserRound } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/format';
import { isAdminSession } from '@/utils/roles';

interface MenuLinkProps {
  to: string;
  label: string;
  icon: typeof Bell;
}

function MenuLink({ to, label, icon: Icon }: MenuLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-100 p-4 text-sm font-semibold text-stone-900 hover:border-brand-200"
    >
      <span className="flex items-center gap-3">
        <Icon size={18} className="text-brand-700" />
        {label}
      </span>
      <ChevronLeft size={18} className="text-stone-600" />
    </Link>
  );
}

export function AccountPage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const member = session?.member ?? null;
  const admin = isAdminSession(session);

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="حسابي" />

      <section className="flex items-center gap-4 rounded-xl2 border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-100 p-5 animate-fade-up">
        {member?.photoUrl ? (
          <img src={member.photoUrl} alt={member.fullName} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-brand-400" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100 text-stone-600" aria-hidden="true">
            <UserRound size={30} />
          </div>
        )}
        <div className="min-w-0 space-y-2">
          <p className="truncate text-lg font-bold text-stone-900">{member?.fullName ?? session?.email}</p>
          {member ? (
            <p className="font-mono text-sm tracking-wider text-brand-700" dir="ltr">
              {member.membershipNumber}
            </p>
          ) : (
            <p className="text-sm text-brand-700">{admin ? 'حساب إداري' : 'حساب بدون عضوية مرتبطة'}</p>
          )}
          {member && <StatusBadge status={member.status} />}
        </div>
      </section>

      {member && (
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-stone-200 bg-stone-100 p-4">
            <p className="text-xs text-stone-600">تاريخ الانخراط</p>
            <p className="mt-1 text-sm font-semibold text-stone-900">{formatDate(member.joinedAt)}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-100 p-4">
            <p className="text-xs text-stone-600">البريد الإلكتروني</p>
            <p className="mt-1 truncate text-sm font-semibold text-stone-900" dir="ltr">
              {member.email}
            </p>
          </div>
        </section>
      )}

      <nav className="space-y-3" aria-label="قائمة الحساب">
        <MenuLink to="/card" label="بطاقة العضوية الرقمية" icon={IdCard} />
        <MenuLink to="/notifications" label="الإشعارات" icon={Bell} />
        <MenuLink to="/settings" label="إعدادات الحساب" icon={Settings} />
        {admin && <MenuLink to="/admin" label="لوحة الإدارة" icon={ShieldCheck} />}
      </nav>

      <Button block variant="secondary" icon={<LogOut size={18} />} onClick={handleSignOut}>
        تسجيل الخروج
      </Button>
    </div>
  );
}
