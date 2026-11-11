/*
# Tighten club access grants and hide administrator checks

1. Security Changes
- Remove default PUBLIC and anonymous privileges from member and scan-log tables.
- Keep members readable only by authenticated owners or administrators.
- Keep scan logs readable and insertable only by administrators.
- Move the administrator-check function into the private schema and remove API execution grants.

2. Data Safety
- No tables or rows are deleted.
- Existing content and member records remain unchanged.
*/

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_club_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.members
    WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  );
$$;

REVOKE ALL ON FUNCTION private.is_club_admin() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON public.members FROM PUBLIC, anon;
GRANT SELECT ON public.members TO authenticated;

REVOKE ALL ON public.scan_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.scan_logs TO authenticated;

DROP POLICY IF EXISTS "members_read_self_or_admin" ON public.members;
CREATE POLICY "members_read_self_or_admin" ON public.members FOR SELECT TO authenticated
USING (id = auth.uid() OR private.is_club_admin());

DROP POLICY IF EXISTS "scan_logs_read_admin" ON public.scan_logs;
CREATE POLICY "scan_logs_read_admin" ON public.scan_logs FOR SELECT TO authenticated
USING (private.is_club_admin());

DROP POLICY IF EXISTS "scan_logs_insert_admin" ON public.scan_logs;
CREATE POLICY "scan_logs_insert_admin" ON public.scan_logs FOR INSERT TO authenticated
WITH CHECK (private.is_club_admin());

DROP POLICY IF EXISTS "announcements_read_admin_drafts" ON public.announcements;
CREATE POLICY "announcements_read_admin_drafts" ON public.announcements FOR SELECT TO authenticated
USING (private.is_club_admin());
DROP POLICY IF EXISTS "news_read_admin_drafts" ON public.news_items;
CREATE POLICY "news_read_admin_drafts" ON public.news_items FOR SELECT TO authenticated
USING (private.is_club_admin());
DROP POLICY IF EXISTS "events_read_admin_drafts" ON public.club_events;
CREATE POLICY "events_read_admin_drafts" ON public.club_events FOR SELECT TO authenticated
USING (private.is_club_admin());
DROP POLICY IF EXISTS "opportunities_read_admin_drafts" ON public.opportunities;
CREATE POLICY "opportunities_read_admin_drafts" ON public.opportunities FOR SELECT TO authenticated
USING (private.is_club_admin());
DROP POLICY IF EXISTS "team_read_admin_drafts" ON public.team_members;
CREATE POLICY "team_read_admin_drafts" ON public.team_members FOR SELECT TO authenticated
USING (private.is_club_admin());
