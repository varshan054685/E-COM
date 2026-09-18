'use client';

import { useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Flame,
  LoaderCircle,
  Pencil,
  Search,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';

import { ProductFormDialog } from '@/components/admin/product-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toggleBestseller } from '@/lib/admin/actions';
import type { AdminProduct } from '@/lib/admin/constants';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

type BestsellersManagerProps = {
  initialProducts: AdminProduct[];
  categories: { slug: string; name: string }[];
};

export function BestsellersManager({ initialProducts, categories }: BestsellersManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'bestsellers' | 'standard'>('all');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string } | null>(null);

  // Synchronize with props if they update
  const bestsellersList = useMemo(
    () => products.filter((p) => Boolean(p.is_bestseller)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.subtitle && product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || product.category_slug === selectedCategory;

      const matchesFilter =
        filterMode === 'all'
          ? true
          : filterMode === 'bestsellers'
            ? Boolean(product.is_bestseller)
            : !product.is_bestseller;

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [products, searchQuery, selectedCategory, filterMode]);

  async function handleToggle(product: AdminProduct) {
    const nextState = !product.is_bestseller;
    setTogglingId(product.id);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_bestseller: nextState } : p)),
    );

    try {
      const result = await toggleBestseller(product.id, nextState);
      if (!result.ok) {
        // Rollback on failure
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_bestseller: !nextState } : p)),
        );
      } else {
        setFeedback({
          id: product.id,
          message: nextState ? 'Added to Bestsellers' : 'Removed from Bestsellers',
        });
        setTimeout(() => setFeedback(null), 3000);
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      // Rollback
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_bestseller: !nextState } : p)),
      );
    } finally {
      setTogglingId(null);
    }
  }

  function handleEdit(product: AdminProduct) {
    setEditingProduct(product);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Bestsellers Manager</h1>
            <Badge variant="gold" className="gap-1">
              <Sparkles className="size-3" />
              {bestsellersList.length} Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Curate and spotlight the premier couture pieces shown in the storefront Bestsellers rail.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/#bestsellers" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            Preview on Storefront
          </Link>
        </Button>
      </div>

      {/* Live Storefront Preview Strip */}
      <Card className="border-gold-300/40 bg-gradient-to-br from-ivory-100 to-ivory-200/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-secondary" />
              <CardTitle className="font-serif text-lg">Live Rail Preview</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              {bestsellersList.length === 0
                ? 'No items selected (Storefront will show default catalog bestsellers)'
                : `${bestsellersList.length} items featured on homepage`}
            </span>
          </div>
          <CardDescription className="text-xs">
            These cards appear in the horizontal carousel on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 pt-1">
            {bestsellersList.length === 0 ? (
              <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground">
                Toggle products below to pin them to the homepage Bestsellers rail.
              </div>
            ) : (
              bestsellersList.map((product) => {
                const imgUrl = product.image_urls[0] || '/placeholder.jpg';
                return (
                  <div
                    key={product.id}
                    className="group relative flex w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-ink-200/60 bg-card p-2.5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={imgUrl}
                        alt={product.title}
                        fill
                        sizes="224px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-2 left-2 bg-primary/90 text-[10px] text-primary-foreground backdrop-blur-sm">
                        Bestseller
                      </Badge>
                    </div>

                    <div className="mt-2.5 flex flex-1 flex-col">
                      <p className="eyebrow text-[9px] text-gold-600">
                        {categories.find((c) => c.slug === product.category_slug)?.name ||
                          product.category_slug}
                      </p>
                      <h4 className="mt-1 line-clamp-1 font-serif text-sm font-medium">
                        {product.title}
                      </h4>
                      <p className="mt-1 font-sans text-xs font-semibold text-primary">
                        {formatPrice(product.price)}
                      </p>

                      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="h-7 px-2 text-xs"
                        >
                          <Pencil className="size-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(product)}
                          className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products by title, subtitle, fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Tag className="size-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                filterMode === 'all'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              All ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('bestsellers')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                filterMode === 'bestsellers'
                  ? 'bg-card text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Bestsellers ({bestsellersList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('standard')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                filterMode === 'standard'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Standard ({products.length - bestsellersList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const isBestseller = Boolean(product.is_bestseller);
          const isToggling = togglingId === product.id;
          const imgUrl = product.image_urls[0] || '/placeholder.jpg';
          const catName =
            categories.find((c) => c.slug === product.category_slug)?.name || product.category_slug;

          return (
            <Card
              key={product.id}
              className={cn(
                'group relative flex flex-col transition-all duration-200 hover:shadow-md',
                isBestseller
                  ? 'border-gold-400/50 bg-gold-100/10 ring-1 ring-gold-400/20'
                  : 'border-border bg-card',
              )}
            >
              <CardContent className="p-4 flex gap-4">
                {/* Thumbnail */}
                <div className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                  <Image
                    src={imgUrl}
                    alt={product.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {isBestseller ? (
                    <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xs">
                      <Star className="size-3 fill-current" />
                    </span>
                  ) : null}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="eyebrow truncate text-[9px] text-gold-600">{catName}</span>
                      <Badge
                        variant={product.is_active ? 'outline' : 'muted'}
                        className="text-[9px] px-1.5 py-0"
                      >
                        {product.is_active ? 'Active' : 'Draft'}
                      </Badge>
                    </div>

                    <h3 className="mt-1 font-serif text-base font-medium leading-snug line-clamp-1">
                      {product.title}
                    </h3>
                    {product.subtitle ? (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {product.subtitle}
                      </p>
                    ) : null}

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_at_price ? (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.compare_at_price)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      {isToggling ? (
                        <LoaderCircle className="size-4 animate-spin text-primary" />
                      ) : (
                        <Switch
                          checked={isBestseller}
                          onCheckedChange={() => handleToggle(product)}
                          disabled={isToggling}
                          aria-label={`Toggle bestseller status for ${product.title}`}
                        />
                      )}
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isBestseller ? 'text-amber-700' : 'text-muted-foreground',
                        )}
                      >
                        {isBestseller ? 'Bestseller' : 'Standard'}
                      </span>
                    </label>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => handleEdit(product)}
                      title="Edit Product"
                    >
                      <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Sparkles className="size-8 text-muted-foreground/60 mb-2" />
          <h3 className="font-serif text-lg font-medium">No products found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Try adjusting your search terms or category filter to find products.
          </p>
        </div>
      ) : null}

      {/* Edit product modal */}
      {dialogOpen ? (
        <ProductFormDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              startTransition(() => {
                router.refresh();
              });
            }
          }}
          product={editingProduct}
          categories={categories}
        />
      ) : null}
    </div>
  );
}
