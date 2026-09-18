'use client';

import { useMemo, useState } from 'react';
import { createColumnHelper, useTable } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AdminUser } from '@/lib/admin/constants';
import { formatPrice } from '@/lib/format';
import { dataTableFeatures } from '@/lib/table-features';

const helper = createColumnHelper<typeof dataTableFeatures, AdminUser>();

/** "3 days ago" style relative time, falling back to a date after a month. */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffDays = Math.floor((Date.now() - then) / 86_400_000);

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;

  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState('');

  const columns = useMemo(
    () =>
      helper.columns([
        helper.accessor('full_name', {
          header: 'Customer',
          sortFn: 'text',
          cell: (info) => {
            const user = info.row.original;
            const label = user.full_name?.trim() || user.email || 'Unnamed';
            return (
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-xs font-semibold text-primary">
                  {label.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {user.email ?? '—'}
                  </span>
                </span>
              </div>
            );
          },
        }),

        helper.accessor('phone', {
          header: 'Contact',
          cell: (info) => (
            <span className="text-sm text-ink-500">
              {info.getValue() ?? <span className="text-ink-300">—</span>}
            </span>
          ),
        }),

        helper.accessor('role', {
          header: 'Role',
          filterFn: 'equalsString',
          cell: (info) =>
            info.getValue() === 'admin' ? (
              <Badge variant="gold">Admin</Badge>
            ) : (
              <Badge variant="muted">Customer</Badge>
            ),
        }),

        helper.accessor('order_count', {
          header: 'Orders',
          sortFn: 'alphanumeric',
          cell: (info) => (
            <span className="text-sm tabular-nums text-ink-500">{info.getValue()}</span>
          ),
        }),

        helper.accessor('total_spent', {
          header: 'Lifetime value',
          sortFn: 'alphanumeric',
          cell: (info) => (
            <span className="text-sm tabular-nums">{formatPrice(info.getValue())}</span>
          ),
        }),

        helper.accessor('last_active_at', {
          header: 'Last active',
          sortFn: 'alphanumeric',
          cell: (info) => (
            <span className="text-sm text-ink-500">{relativeTime(info.getValue())}</span>
          ),
        }),
      ]),
    [],
  );

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: users,
    getRowId: (row) => row.id,
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="relative sm:max-w-xs">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-300"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            table.setGlobalFilter(event.target.value);
          }}
          placeholder="Search name or email…"
          aria-label="Search customers"
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-ink-100 bg-card shadow-soft">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 tracking-[0.12em] uppercase transition-colors hover:text-foreground"
                        >
                          <table.FlexRender header={header} />
                          {sorted === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUpDown className="size-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-14 text-center">
                  <p className="font-serif text-lg">
                    {users.length === 0 ? 'No customers yet' : 'No customers match that search'}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {users.length === 0
                      ? 'Profiles are created automatically when someone signs up on the storefront.'
                      : 'Try a different name or email.'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {filteredCount} {filteredCount === 1 ? 'customer' : 'customers'}
        {table.getPageCount() > 1
          ? ` · page ${table.state.pagination.pageIndex + 1} of ${table.getPageCount()}`
          : ''}
      </p>
    </div>
  );
}
