import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table';

/**
 * Shared TanStack Table v9 feature registration.
 *
 * v9 requires every feature to be registered explicitly, and each row-model
 * slot must come *after* the feature it depends on. This is the single place
 * the admin tables get their sorting, filtering and pagination from, so all
 * three screens behave identically.
 *
 * v9 note: `useTable` replaces `useReactTable`, and row models are feature
 * slots (`sortedRowModel: createSortedRowModel()`) rather than options
 * (`getSortedRowModel: getSortedRowModel()`).
 */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
});
