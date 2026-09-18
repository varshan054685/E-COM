'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { z } from 'zod';

import { ImageUploader } from '@/components/admin/image-uploader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { saveProduct } from '@/lib/admin/actions';
import type { AdminProduct } from '@/lib/admin/constants';

const numberString = (label: string) =>
  z
    .string()
    .min(1, `Enter a ${label}.`)
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: `Enter a valid ${label}.`,
    });

const schema = z.object({
  title: z.string().min(3, 'Give the piece a title of at least 3 characters.'),
  subtitle: z.string().optional(),
  category_slug: z.string().min(1, 'Choose a category.'),
  price: numberString('price'),
  compare_at_price: z.string().optional(),
  stock_count: z
    .string()
    .min(1, 'Enter a stock count.')
    .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, {
      message: 'Stock must be a whole number of zero or more.',
    }),
  fabric: z.string().optional(),
  embroidery: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const BLANK: FormValues = {
  title: '',
  subtitle: '',
  category_slug: '',
  price: '',
  compare_at_price: '',
  stock_count: '0',
  fabric: '',
  embroidery: '',
  description: '',
};

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null` creates a new product. */
  product: AdminProduct | null;
  categories: { slug: string; name: string }[];
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
}: ProductFormDialogProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [madeToOrder, setMadeToOrder] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [active, setActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: BLANK,
  });

  // Reset the form each time the dialog opens so it reflects the target row.
  useEffect(() => {
    if (!open) return;

    setFormError(null);
    setImages(product?.image_urls ?? []);
    setMadeToOrder(product?.is_made_to_order ?? false);
    setIsBestseller(product?.is_bestseller ?? false);
    setActive(product?.is_active ?? true);

    form.reset(
      product
        ? {
            title: product.title,
            subtitle: product.subtitle ?? '',
            category_slug: product.category_slug,
            price: String(product.price),
            compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
            stock_count: String(product.stock_count),
            fabric: product.fabric ?? '',
            embroidery: product.embroidery ?? '',
            description: product.description ?? '',
          }
        : { ...BLANK, category_slug: categories[0]?.slug ?? '' },
    );
  }, [open, product, categories, form]);

  async function onSubmit(values: FormValues) {
    setFormError(null);

    const result = await saveProduct({
      id: product?.id,
      title: values.title,
      subtitle: values.subtitle || null,
      category_slug: values.category_slug,
      price: Number(values.price),
      compare_at_price: values.compare_at_price ? Number(values.compare_at_price) : null,
      stock_count: Number(values.stock_count),
      is_made_to_order: madeToOrder,
      fabric: values.fabric || null,
      embroidery: values.embroidery || null,
      description: values.description || null,
      image_urls: images,
      is_bestseller: isBestseller,
      is_active: active,
    });

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  const isEditing = Boolean(product);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit product' : 'Add product'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Changes go live on the storefront as soon as you save.'
              : 'New pieces appear in the shop straight away.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Royal Peacock Aari Blouse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Zardosi & kundan on raw silk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category_slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.slug} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock count</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compare_at_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare-at price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={100} placeholder="Optional" {...field} />
                    </FormControl>
                    <FormDescription>Shows as a strike-through when higher.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-ink-100 bg-ivory-200/50 p-4">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium">Made to order</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Customers can request stitching to their measurements.
                  </span>
                </span>
                <Switch checked={madeToOrder} onCheckedChange={setMadeToOrder} />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-border p-3.5">
                <span>
                  <span className="block text-sm font-medium">Active</span>
                  <span className="block text-xs text-muted-foreground">
                    Visible to shoppers across the store.
                  </span>
                </span>
                <Switch checked={active} onCheckedChange={setActive} />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-border p-3.5 sm:col-span-2">
                <span>
                  <span className="block text-sm font-medium">Bestseller Spotlight</span>
                  <span className="block text-xs text-muted-foreground">
                    Feature this product in the homepage Bestsellers rail.
                  </span>
                </span>
                <Switch checked={isBestseller} onCheckedChange={setIsBestseller} />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fabric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fabric</FormLabel>
                    <FormControl>
                      <Input placeholder="Pure raw silk, 60g" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="embroidery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Embroidery</FormLabel>
                    <FormControl>
                      <Input placeholder="Hand Aari — zardosi, kundan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Craft notes, studio hours, styling advice…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              {/* Plain Label: this control sits outside the RHF field context. */}
              <Label htmlFor="product-images">Images</Label>
              <ImageUploader value={images} onChange={setImages} />
            </div>

            {formError ? (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : null}
                {isEditing ? 'Save changes' : 'Create product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
