'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/components/commerce/CartProvider';
import { useWishlist } from '@/components/commerce/WishlistProvider';
import { useCartDrawer } from '@/components/commerce/CartDrawer';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/format';
import { whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';

export function AddToBagPanel({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    image: string | null;
    stock: number;
    sizes: string[];
    colors: string[];
    isMadeToOrder: boolean;
    categorySlug: string | null;
    productionTime: string | null;
  };
}) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { setOpen: setCartOpen } = useCartDrawer();
  const router = useRouter();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const outOfStock = product.stock <= 0 && !product.isMadeToOrder;
  const wishlisted = isWishlisted(product.id);

  async function handleAdd() {
    if (outOfStock) return;
    if (product.sizes.length > 0 && !size) return;
    setLoading(true);
    const ok = await addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      image: product.image,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      size,
      color,
      quantity: qty,
      stock: Math.max(product.stock, qty),
      categorySlug: product.categorySlug,
    });
    setLoading(false);
    if (ok) setCartOpen(true);
  }

  const whatsappMessage = `Hi, I'm interested in the ${product.name} (₹${product.price.toLocaleString('en-IN')}). Could you share more details?`;

  return (
    <div className="space-y-6">
      {product.sizes.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Select size</span>
            {size === 'Custom' && <span className="text-[11px] text-gold-700">We&apos;ll take your measurements at checkout</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  'flex h-11 min-w-12 items-center justify-center border px-3 text-sm transition',
                  size === s ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100' : 'border-ink/15 hover:border-ink/50',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Colour</span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  'border px-4 py-2 text-[13px] transition',
                  color === c ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100' : 'border-ink/15 hover:border-ink/50',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-ink/15">
          <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className="flex h-11 w-11 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm" aria-live="polite">{qty}</span>
          <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity" className="flex h-11 w-11 items-center justify-center text-ink-muted hover:text-ink">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {outOfStock ? (
          <span className="text-sm text-red-700">This piece is currently sold out — custom requests welcome.</span>
        ) : product.stock <= 3 ? (
          <span className="text-[13px] text-amber-800">Only {product.stock} left · {product.isMadeToOrder ? 'made to order' : 'in stock'}</span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        {product.isMadeToOrder ? (
          <Button size="lg" fullWidth onClick={() => router.push(`/custom-couture?piece=${product.slug}`)}>
            Begin Made-to-Order
          </Button>
        ) : (
          <Button size="lg" fullWidth disabled={outOfStock || (product.sizes.length > 0 && !size)} isLoading={loading} onClick={handleAdd}>
            Add to Bag
          </Button>
        )}
        <Button size="lg" variant="outline" aria-label="Save to wishlist" onClick={() => toggle(product.id)} className={cn(wishlisted && 'border-gold-500 text-gold-700')}>
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
        </Button>
      </div>

      <div className="grid gap-2.5">
        <a
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 border border-[#25D366]/40 text-[#128C7E] text-sm font-medium hover:bg-[#25D366]/5 transition"
        >
          <MessageCircle className="h-4 w-4" /> Chat about this design
        </a>
      </div>

      <ul className="space-y-2.5 border-t border-ink/10 pt-5 text-[13px] text-ink-muted">
        <li className="flex items-center gap-2.5"><Truck className="h-4 w-4 text-gold-600" /> {product.productionTime || 'Ready to ship in 2–3 days'}</li>
        <li className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-gold-600" /> Handcrafted in our Coimbatore atelier · quality-checked before dispatch</li>
      </ul>
    </div>
  );
}