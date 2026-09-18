'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createColumnHelper, useTable } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Eye,
  Search,
} from 'lucide-react';

import { OrderDetailDialog } from '@/components/admin/order-detail-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { updateOrderStatus } from '@/lib/admin/actions';
import {
  ORDER_PIPELINE,
  PAYMENT_STATUSES,
  type AdminOrder,
  type OrderStatus,
  type PaymentStatus,
} from '@/lib/admin/constants';
import { formatPrice } from '@/lib/format';
import { dataTableFeatures } from '@/lib/table-features';

const helper = createColumnHelper<typeof dataTableFeatures, AdminOrder>();

const STAGE_LABEL = new Map(ORDER_PIPELINE.map((entry) => [entry.value, entry.label]));
const PAYMENT_LABEL = new Map(PAYMENT_STATUSES.map((entry) => [entry.value, entry.label]));

const STAGE_BADGE: Record<OrderStatus, 'muted' | 'gold' | 'magenta' | 'default'> = {
  received: 'muted',
  in_embroidery: 'gold',
  stitched: 'magenta',
  dispatched: 'default',
};

const PAYMENT_BADGE: Record<PaymentStatus, 'default' | 'gold' | 'muted' | 'magenta'> = {
  paid: 'default',
  pending: 'gold',
  refunded: 'muted',
  failed: 'magenta',
};

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const openDetail = useCallback((order: AdminOrder) => setSelected(order), []);

  const columns = useMemo(
    () =>
      helper.columns([
        helper.accessor('order_number', {
          header: 'Order',
          sortFn: 'text',
          cell: (info) => {
            const order = info.row.original;
            return (
              <button
                type="button"
                onClick={() => openDetail(order)}
                className="flex flex-col text-left"
              >
                <span className="font-medium transition-colors hover:text-gold-700">
                  {order.order_number}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.placed_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </button>
            );
          },
        }),

        helper.accessor('customer_name', {
          header: 'Customer',
          sortFn: 'text',
          cell: (info) => {
            const order = info.row.original;
            return (
              <span className="flex flex-col">
                <span className="text-sm font-medium">{order.customer_name}</span>
                <span className="text-xs text-muted-foreground">
                  {order.customer_phone ?? order.customer_email ?? '—'}
                </span>
              </span>
            );
          },
        }),

        helper.display({
          id: 'items',
          header: 'Items',
          cell: (info) => {
            const items = info.row.original.items ?? [];
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <span className="flex flex-col">
                <span className="text-sm tabular-nums">{formatPrice(info.row.original.total)}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {count} {count === 1 ? 'piece' : 'pieces'}
                  {items[0] ? ` · ${items[0].title}` : ''}
                </span>
              </span>
            );
          },
        }),

        helper.accessor('payment_status', {
          header: 'Payment',
          filterFn: 'equalsString',
          cell: (info) => {
            const status = info.getValue();
            return <Badge variant={PAYMENT_BADGE[status]}>{PAYMENT_LABEL.get(status)}</Badge>;
          },
        }),

        helper.accessor('status', {
          header: 'Stage',
          filterFn: 'equalsString',
          cell: (info) => {
            const order = info.row.original;
            const status = info.getValue();
            return (
              <span className="flex items-center gap-2">
                <Badge variant={STAGE_BADGE[status]}>{STAGE_LABEL.get(status)}</Badge>
                <Select
                  value={status}
                  onValueChange={(next) => {
                    void updateOrderStatus(order.id, next as OrderStatus).then(() =>
                      router.refresh(),
                    );
                  }}
                >
                  <SelectTrigger
                    className="h-8 w-9 border-ink-200 px-0"
                    aria-label={`Change stage for ${order.order_number}`}
                  >
                    <ChevronRight className="mx-auto size-3.5 text-ink-400" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_PIPELINE.map((entry) => (
                      <SelectItem key={entry.value} value={entry.value}>
                        {entry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>
            );
          },
        }),

        helper.accessor('is_made_to_measure', {
          header: 'Tailored',
          cell: (info) =>
            info.getValue() ? (
              <span className="text-sm text-primary">Made to measure</span>
            ) : (
              <span className="text-sm text-ink-300">Standard</span>
            ),
        }),

        helper.display({
          id: 'actions',
          header: '',
          cell: (info) => (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`View ${info.row.original.order_number}`}
                onClick={() => openDetail(info.row.original)}
              >
                <Eye className="size-3.5" />
              </Button>
            </div>
          ),
        }),
      ]),
    [openDetail, router],
  );

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: orders,
    getRowId: (row) => row.id,
  });

  const stageColumn = table.getColumn('status');
  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
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
            placeholder="Search order or customer…"
            aria-label="Search orders"
            className="pl-9"
          />
        </div>

        <Select
          value={stage}
          onValueChange={(value) => {
            setStage(value);
            stageColumn?.setFilterValue(value === 'all' ? undefined : value);
          }}
        >
          <SelectTrigger className="sm:w-52" aria-label="Filter by stage">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {ORDER_PIPELINE.map((entry) => (
              <SelectItem key={entry.value} value={entry.value}>
                {entry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                    {orders.length === 0 ? 'No orders yet' : 'No orders match those filters'}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {orders.length === 0
                      ? 'Orders placed on the storefront will appear here.'
                      : 'Try a different search term or stage.'}
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
        Showing {rows.length} of {filteredCount} {filteredCount === 1 ? 'order' : 'orders'}
        {table.getPageCount() > 1
          ? ` · page ${table.state.pagination.pageIndex + 1} of ${table.getPageCount()}`
          : ''}
      </p>

      <OrderDetailDialog
        order={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
