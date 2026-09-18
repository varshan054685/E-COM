import type { Metadata } from 'next';
import { Users } from 'lucide-react';

import { SetupNotice } from '@/components/admin/setup-notice';
import { UsersTable } from '@/components/admin/users-table';
import { listUsers } from '@/lib/admin/queries';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = { title: 'Customers' };

export default async function AdminUsersPage() {
  const users = await listUsers();

  const admins = users.filter((user) => user.role === 'admin').length;
  const withOrders = users.filter((user) => user.order_count > 0).length;

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-600">People</p>
          <h1 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">Customers</h1>
          <p className="mt-2.5 text-sm text-muted-foreground">
            {isSupabaseConfigured
              ? `${users.length} registered ${users.length === 1 ? 'account' : 'accounts'} · ${withOrders} have ordered · ${admins} admin${admins === 1 ? '' : 's'}.`
              : 'Customer management needs a database connection.'}
          </p>
        </div>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-3.5" aria-hidden="true" />
          Profiles are created on sign-up by a database trigger
        </p>
      </header>

      {!isSupabaseConfigured ? <SetupNotice /> : null}

      <UsersTable users={users} />
    </div>
  );
}
