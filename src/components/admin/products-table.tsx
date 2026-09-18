'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createColumnHelper, useTable } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash,
} from 'lucide-react';

import { ProductFormDialog } from '@/components/admin/product-form-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { deleteProduct } from '@/lib/admin/actions';
import { LOW_STOCK_THRESHOLD, type AdminProduct } from '@/lib/admin/constants';
import { formatPrice } from '@/lib/format';
import { dataTableFeatures } from '@/lib/table-features';

const helper = createColumnHelper<typeof dataTableFeatures, AdminProduct>();

type ProductsTableProps = {
  products: AdminProduct[];
  categories: { slug: string; name: string }[];
};

export function ProductsTable({ products, categories }: ProductsTableProps) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const categoryName = useCallback(
    (slug: string) => categories.find((entry) => entry.slug === slug)?.name ?? slug,
    [categories],
  );

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((product: AdminProduct) => {
    setEditing(product);
    setFormOpen(true);
  }, []);

  const requestDelete = useCallback((product: AdminProduct) => {
    setDeleteError(null);
    setPendingDelete(product);
  }, []);

  const columns = useMemo(
    () =>
      helper.columns([
        helper.accessor('title', {
          header: 'Product',
          sortFn: 'text',
          cell: (info) => {
            const product = info.row.original;
            const thumbnail = product.image_urls[0];
            return (
              <div className="flex items-center gap-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ivory-200">
                  {thumbnail ? (
                    <Image src={thumbnail} alt="" fill sizes="44px" className="object-cover" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{product.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {product.subtitle ?? '—'}
                  </span>
                </span>
              </div>
            );
          },
        }),

        helper.accessor('category_slug', {
          header: 'Category',
          filterFn: 'equalsString',
          cell: (info) => (
            <span className="text-sm text-ink-500">{categoryName(info.getValue())}</span>
          ),
        }),

        helper.accessor('price', {
          header: 'Price',
          sortFn: 'alphanumeric',
          cell: (info) => {
            const product = info.row.original;
            return (
              <span className="flex flex-col">
                <span className="tabular-nums">{formatPrice(product.price)}</span>
                {product.compare_at_price ? (
                  <span className="text-xs text-ink-300 line-through tabular-nums">
                    {formatPrice(product.compare_at_price)}
                  </span>
                ) : null}
              </span>
            );
          },
        }),

        helper.accessor('stock_count', {
          header: 'Stock',
          sortFn: 'alphanumeric',
          cell: (info) => {
            const count = info.getValue();
            if (count === 0) return <Badge variant="magenta">Out of stock</Badge>;
            if (count <= LOW_STOCK_THRESHOLD) return <Badge variant="gold">{count} left</Badge>;
            return <span className="tabular-nums text-ink-500">{count}</span>;
          },
        }),

        helper.accessor('is_made_to_order', {
          header: 'Made to order',
          cell: (info) =>
            info.getValue() ? (
              <span className="text-sm text-primary">Yes</span>
            ) : (
              <span className="text-sm text-ink-300">No</span>
            ),
        }),

        helper.accessor('is_active', {
          header: 'Status',
          cell: (info) =>
            info.getValue() ? (
              <span className="text-sm text-ink-500">Active</span>
            ) : (
              <span className="text-sm text-ink-300">Hidden</span>
            ),
        }),

        helper.display({
          id: 'actions',
          header: '',
          cell: (info) => {
            const product = info.row.original;
            return (
              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${product.title}`}
                  onClick={() => openEdit(product)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${product.title}`}
                  onClick={() => requestDelete(product)}
                  className="hover:text-destructive"
                >
                  <Trash className="size-3.5" />
                </Button>
              </div>
            );
          },
        }),
      ]),
    [categoryName, openEdit, requestDelete],
  );

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: products,
    getRowId: (row) => row.id,
  });

  const categoryColumn = table.getColumn('category_slug');
  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);

    const result = await deleteProduct(pendingDelete.id);

    setDeleting(false);

    if (!result.ok) {
      setDeleteError(result.error);
      return;
    }

    setPendingDelete(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
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
              placeholder="Search products…"
              aria-label="Search products"
              className="pl-9"
            />
          </div>

          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              categoryColumn?.setFilterValue(value === 'all' ? undefined : value);
            }}
          >
            <SelectTrigger className="sm:w-52" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((entry) => (
                <SelectItem key={entry.slug} value={entry.slug}>
                  {entry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="button" onClick={openCreate} className="shrink-0">
          <Plus className="size-4" />
          Add product
        </Button>
      </div>

      {/* Table */}
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
                    {products.length === 0 ? 'No products yet' : 'No products match those filters'}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {products.length === 0
                      ? 'Add your first piece to get started.'
                      : 'Try a different search term or category.'}
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

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Showing {rows.length} of {filteredCount}{' '}
          {filteredCount === 1 ? 'product' : 'products'}
          {table.getPageCount() > 1 ? ` · page ${table.state.pagination.pageIndex + 1} of ${table.getPageCount()}` : ''}
        </p>

        {table.getPageCount() > 1 ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronRight className="size-4 rotate-180" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be removed from the catalogue and the
              storefront. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {deleteError}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep product</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              disabled={deleting}
            >
              {deleting ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
