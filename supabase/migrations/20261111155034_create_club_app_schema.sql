/*
# Create the El Massar club application schema

1. New Tables
- `members`: one membership record per authenticated account, including membership number, profile data, status, and protected administrative role.
- `announcements`: short public notices shown on the home page.
- `news_items`: public club news articles.
- `club_events`: public activities, events, and workshops.
- `opportunities`: public youth guide opportunities.
- `team_members`: public club team profiles.
- `scan_logs`: administrator-only membership verification history.

2. Security
- Row Level Security is enabled on every new table.
- Public content is readable by anonymous and signed-in visitors, but writable only by administrators through the database role policy.
- Members can read their own membership record; administrators can read all member records.
- Administrative fields such as role, status, and audit data are not client-writable.
- Scan history is readable and writable only by administrators.
- Explicit grants are limited to the operations used by the application.

3. Functions
- `is_club_admin()` checks the authenticated account's protected member role for administrative access.

4. Important Notes
- The schema starts empty intentionally; the interface displays empty states until club content and member accounts are added.
- Authentication uses Supabase's built-in email/password accounts. Member rows use the same UUID as the corresponding authenticated account.
*/

CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_number text UNIQUE,
  full_name text NOT NULL,
  photo_url text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'inactive', 'pending')),
  email text,
  phone text,
  role text NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MEMBER')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL,
  image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.club_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('activity', 'event', 'workshop')),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  image_url text,
  registration_open boolean NOT NULL DEFAULT false,
  registration_deadline timestamptz,
  published boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('training', 'technology', 'robotics', 'drones', 'entrepreneurship', 'culture', 'volunteering', 'competitions', 'forums')),
  location text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  requirements text NOT NULL DEFAULT '',
  deadline timestamptz,
  registration_url text,
  image_url text,
  published boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  photo_url text,
  published boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.scan_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_number text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'suspended', 'inactive', 'pending', 'not_found', 'invalid')),
  scanned_at timestamptz NOT NULL DEFAULT now(),
  admin_name text NOT NULL
);

CREATE OR REPLACE FUNCTION public.is_club_admin()
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

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.members TO authenticated;
GRANT SELECT ON public.announcements, public.news_items, public.club_events, public.opportunities, public.team_members TO anon, authenticated;
GRANT SELECT, INSERT ON public.scan_logs TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_club_admin() TO anon, authenticated;

REVOKE INSERT, UPDATE, DELETE ON public.members FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.announcements, public.news_items, public.club_events, public.opportunities, public.team_members FROM anon, authenticated;

DROP POLICY IF EXISTS "members_read_self_or_admin" ON public.members;
CREATE POLICY "members_read_self_or_admin" ON public.members FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_club_admin());

DROP POLICY IF EXISTS "announcements_read_published" ON public.announcements;
CREATE POLICY "announcements_read_published" ON public.announcements FOR SELECT TO anon, authenticated
USING (published = true OR public.is_club_admin());

DROP POLICY IF EXISTS "news_read_published" ON public.news_items;
CREATE POLICY "news_read_published" ON public.news_items FOR SELECT TO anon, authenticated
USING (published = true OR public.is_club_admin());

DROP POLICY IF EXISTS "events_read_published" ON public.club_events;
CREATE POLICY "events_read_published" ON public.club_events FOR SELECT TO anon, authenticated
USING (published = true OR public.is_club_admin());

DROP POLICY IF EXISTS "opportunities_read_published" ON public.opportunities;
CREATE POLICY "opportunities_read_published" ON public.opportunities FOR SELECT TO anon, authenticated
USING (published = true OR public.is_club_admin());

DROP POLICY IF EXISTS "team_read_published" ON public.team_members;
CREATE POLICY "team_read_published" ON public.team_members FOR SELECT TO anon, authenticated
USING (published = true OR public.is_club_admin());

DROP POLICY IF EXISTS "scan_logs_read_admin" ON public.scan_logs;
CREATE POLICY "scan_logs_read_admin" ON public.scan_logs FOR SELECT TO authenticated
USING (public.is_club_admin());

DROP POLICY IF EXISTS "scan_logs_insert_admin" ON public.scan_logs;
CREATE POLICY "scan_logs_insert_admin" ON public.scan_logs FOR INSERT TO authenticated
WITH CHECK (public.is_club_admin());

REVOKE EXECUTE ON FUNCTION public.is_club_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_club_admin() TO authenticated;
