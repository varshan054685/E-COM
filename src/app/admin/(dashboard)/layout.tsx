import type { Metadata } from 'next';

import { AdminShell } from '@/components/admin/admin-shell';

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin',
  },
  robots: { index: false, follow: false },
};

/**
 * Chrome for the admin dashboard. `/admin/login` deliberately sits outside
 * this route group so the sign-in screen never renders the sidebar.
 */
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
