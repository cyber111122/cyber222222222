/*
# Remove the obsolete exposed administrator check

1. Security Changes
- Delete the old `public.is_club_admin()` API function.
- The active row policies already use the private-schema equivalent.

2. Data Safety
- No tables, member records, content, or scan records are deleted.
*/

DROP FUNCTION IF EXISTS public.is_club_admin();
