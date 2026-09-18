-- ===========================================================================
--  Promote Admin Account (jagathees.offic@gmail.com)
--
--  Run this in your Supabase Dashboard:
--  1. Open your Supabase project
--  2. Go to SQL Editor (left sidebar)
--  3. Click "New query"
--  4. Paste this and click "Run" (Ctrl+Enter)
-- ===========================================================================

-- 1. Promote the account to admin
update public.profiles
set role = 'admin'
where lower(email) = 'jagathees.offic@gmail.com';

-- 2. Verify role was successfully updated
select id, email, full_name, role, created_at
from public.profiles
where lower(email) = 'jagathees.offic@gmail.com';
