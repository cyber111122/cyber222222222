/*
# Separate public and administrator content policies

1. Changes
- Replace mixed-role content policies with separate anonymous/public and authenticated/administrator policies.
- Public visitors can read only published announcements, news, events, opportunities, and team members.
- Club administrators can also read unpublished content.

2. Security
- Anonymous requests no longer evaluate the administrator authorization function.
- The administrator function remains callable only by authenticated users.
- No data is deleted or changed; only row visibility policies are adjusted.
*/

DROP POLICY IF EXISTS "announcements_read_published" ON public.announcements;
CREATE POLICY "announcements_read_published_anon" ON public.announcements FOR SELECT TO anon
USING (published = true);
CREATE POLICY "announcements_read_published_auth" ON public.announcements FOR SELECT TO authenticated
USING (published = true);
CREATE POLICY "announcements_read_admin_drafts" ON public.announcements FOR SELECT TO authenticated
USING (public.is_club_admin());

DROP POLICY IF EXISTS "news_read_published" ON public.news_items;
CREATE POLICY "news_read_published_anon" ON public.news_items FOR SELECT TO anon
USING (published = true);
CREATE POLICY "news_read_published_auth" ON public.news_items FOR SELECT TO authenticated
USING (published = true);
CREATE POLICY "news_read_admin_drafts" ON public.news_items FOR SELECT TO authenticated
USING (public.is_club_admin());

DROP POLICY IF EXISTS "events_read_published" ON public.club_events;
CREATE POLICY "events_read_published_anon" ON public.club_events FOR SELECT TO anon
USING (published = true);
CREATE POLICY "events_read_published_auth" ON public.club_events FOR SELECT TO authenticated
USING (published = true);
CREATE POLICY "events_read_admin_drafts" ON public.club_events FOR SELECT TO authenticated
USING (public.is_club_admin());

DROP POLICY IF EXISTS "opportunities_read_published" ON public.opportunities;
CREATE POLICY "opportunities_read_published_anon" ON public.opportunities FOR SELECT TO anon
USING (published = true);
CREATE POLICY "opportunities_read_published_auth" ON public.opportunities FOR SELECT TO authenticated
USING (published = true);
CREATE POLICY "opportunities_read_admin_drafts" ON public.opportunities FOR SELECT TO authenticated
USING (public.is_club_admin());

DROP POLICY IF EXISTS "team_read_published" ON public.team_members;
CREATE POLICY "team_read_published_anon" ON public.team_members FOR SELECT TO anon
USING (published = true);
CREATE POLICY "team_read_published_auth" ON public.team_members FOR SELECT TO authenticated
USING (published = true);
CREATE POLICY "team_read_admin_drafts" ON public.team_members FOR SELECT TO authenticated
USING (public.is_club_admin());
