import { Database, FileCode2, KeyRound, Terminal, ServerCrash } from 'lucide-react';

import { isDev } from '@/lib/supabase/env';

const DEV_STEPS = [
  {
    Icon: KeyRound,
    title: '1. Create a Supabase project',
    body: 'Then open Project Settings → API and copy the Project URL and the anon public key.',
  },
  {
    Icon: Terminal,
    title: '2. Add them to .env.local',
    body: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the dev server.',
  },
  {
    Icon: Database,
    title: '3. Run the schema',
    body: 'Open the Supabase SQL Editor and run supabase/schema.sql to set up your tables.',
  },
  {
    Icon: FileCode2,
    title: '4. Promote yourself to admin',
    body: "After signing up once, run: update public.profiles set role = 'admin' where email = 'you@example.com';",
  },
];

export function SetupNotice({ title = 'Connect Supabase to switch this on' }: { title?: string }) {
  // In production, show a minimal notice without internal setup details.
  if (!isDev) {
    return (
      <div className="rounded-xl border border-gold-200 bg-gold-100/40 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-gold-700">
            <ServerCrash className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-2xl leading-snug">Service temporarily unavailable</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-500">
              This section is currently unavailable. Please try again later or contact support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gold-200 bg-gold-100/40 p-6 sm:p-8">
      <h2 className="font-serif text-2xl leading-snug">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
        The admin dashboard reads and writes through Supabase. Until it is configured,
        these screens render empty rather than failing — the storefront is unaffected.
      </p>

      <ol className="mt-7 grid gap-5 sm:grid-cols-2">
        {DEV_STEPS.map(({ Icon, title: stepTitle, body }) => (
          <li key={stepTitle} className="flex gap-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-gold-700">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-medium">{stepTitle}</span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-500">{body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
