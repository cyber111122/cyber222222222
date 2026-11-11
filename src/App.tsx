import { useCallback, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SplashScreen } from '@/components/SplashScreen';
import { RequireAdmin, RequireAuth } from '@/components/guards/RouteGuards';
import { AuthProvider } from '@/contexts/AuthProvider';
import { AboutPage } from '@/pages/AboutPage';
import { AccountPage } from '@/pages/AccountPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { ClubEventDetailPage } from '@/pages/ClubEventDetailPage';
import { GuideDetailPage } from '@/pages/GuideDetailPage';
import { GuidePage } from '@/pages/GuidePage';
import { HomePage } from '@/pages/HomePage';
import { JoinPage } from '@/pages/JoinPage';
import { LoginPage } from '@/pages/LoginPage';
import { MembershipCardPage } from '@/pages/MembershipCardPage';
import { NewsDetailPage, NewsPage } from '@/pages/NewsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TeamPage } from '@/pages/TeamPage';
import { WelcomePage } from '@/pages/WelcomePage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminMembersPage } from '@/pages/admin/AdminMembersPage';
import { AdminScanPage } from '@/pages/admin/AdminScanPage';
import { ScanResultPage } from '@/pages/admin/ScanResultPage';
import { hasSeenWelcome } from '@/utils/onboarding';

function RootRoute() {
  return hasSeenWelcome() ? <HomePage /> : <Navigate to="/welcome" replace />;
}

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const finishSplash = useCallback(() => setSplashVisible(false), []);

  return (
    <AuthProvider>
      {splashVisible && <SplashScreen onDone={finishSplash} />}
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route element={<AppLayout />}>
          <Route index element={<RootRoute />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="guide/:id" element={<GuideDetailPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="activities/:id" element={<ClubEventDetailPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="join" element={<JoinPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="card" element={<RequireAuth><MembershipCardPage /></RequireAuth>} />
          <Route path="account" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
          <Route path="settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
          <Route path="admin/scan" element={<RequireAdmin><AdminScanPage /></RequireAdmin>} />
          <Route path="admin/scan/:membershipNumber" element={<RequireAdmin><ScanResultPage /></RequireAdmin>} />
          <Route path="admin/members" element={<RequireAdmin><AdminMembersPage /></RequireAdmin>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
