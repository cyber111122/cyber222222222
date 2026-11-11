import { NavLink, Outlet } from 'react-router-dom';
import { CalendarDays, Home, IdCard, BookOpen, UserRound, type LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { to: '/', label: 'الرئيسية', icon: Home },
  { to: '/guide', label: 'دليل الشباب', icon: BookOpen },
  { to: '/activities', label: 'الأنشطة', icon: CalendarDays },
  { to: '/card', label: 'بطاقتي', icon: IdCard },
  { to: '/account', label: 'حسابي', icon: UserRound },
];

export function BottomNav() {
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-stone-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <ul className="grid grid-cols-5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-[11px] font-semibold ${
                  isActive ? 'text-brand-700' : 'text-stone-600 hover:text-stone-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 1.9} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AppLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white bg-[radial-gradient(ellipse_at_top,rgba(30,130,230,0.18),transparent_60%)]">
      <main className="px-5 pb-32 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
