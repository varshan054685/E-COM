'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/commerce/AuthProvider';
import { useCart } from '@/components/commerce/CartProvider';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { RatingStars } from '@/components/ui/Rating';
import { Star, User } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export function ReviewList({
  productId,
  reviews,
  ratingAmount,
  reviewCount,
}: {
  productId: string;
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    content: string;
    image: string | null;
    createdAt: string;
    user: { name: string };
  }[];
  ratingAmount: number | null;
  reviewCount: number;
}) {
  const { user } = useAuth();
  const { items } = useCart();
  const hasPurchased = items.some((i) => i.productId === productId);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 10) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, content }),
      });
      if (res.ok) {
        setTitle('');
        setContent('');
        setRating(5);
        window.location.reload();
      }
    } finally {
      setSubmitting(false);
    }
  }

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: reviewCount ? (count / reviewCount) * 100 : 0 };
  });

  return (
    <section aria-label="Reviews" className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h2 className="font-serif text-2xl text-charcoal-900">Client Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No reviews yet — be the first to share your thoughts on this piece.</p>
        ) : (
          <ul className="mt-6 divide-y divide-ink/10">
            {reviews.map((review) => (
              <li key={review.id} className="py-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900/5 text-charcoal-700">
                    <User className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">{review.user.name}</p>
                    <p className="text-xs text-ink-faint">{formatDate(review.createdAt)}</p>
                  </div>
                  <RatingStars value={review.rating} size={14} className="ml-auto" />
                </div>
                {review.title && <p className="mt-3 text-sm font-semibold text-charcoal-900">{review.title}</p>}
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{review.content}</p>
                {review.image && (
                  <div className="relative mt-4 h-28 w-24 overflow-hidden">
                    <Image src={review.image} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-ink/10 bg-ivory-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Summary</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-4xl text-charcoal-900">{ratingAmount ? ratingAmount.toFixed(1) : '—'}</span>
            <RatingStars value={ratingAmount || 0} size={15} />
          </div>
          <p className="mt-1 text-xs text-ink-faint">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</p>
          <div className="mt-4 space-y-1.5">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-2 text-xs text-ink-muted">
                <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                <div className="h-1 flex-1 bg-charcoal-100 overflow-hidden">
                  <div className="h-full bg-gold-500" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-6 text-right">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {user ? (
          <form onSubmit={submit} className="mt-6 border border-ink/10 bg-ivory-50 p-6 space-y-4">
            <p className="font-serif text-lg text-charcoal-900">Write a review</p>
            {!hasPurchased && (
              <p className="text-xs text-amber-800">For verified reviews, please check out first — or leave your thoughts now.</p>
            )}
            <div>
              <span className="mb-1.5 block text-[13px] font-medium text-charcoal-700">Your rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)} aria-label={`${s} star${s > 1 ? 's' : ''}`} className={cn('text-2xl', s <= rating ? 'text-gold-500' : 'text-charcoal-200')}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A short headline" />
            <Textarea label="Your review" required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell us about the fit, the craft, the experience…" hint={content.trim().length < 10 ? 'Please write at least 10 characters.' : undefined} />
            <Button type="submit" disabled={content.trim().length < 10} isLoading={submitting} fullWidth>Submit review</Button>
          </form>
        ) : (
          <p className="mt-6 border border-ink/10 bg-ivory-50 p-6 text-sm text-ink-muted">
            <a href="/login" className="text-gold-700 underline underline-offset-4">Sign in</a> to share your review.
          </p>
        )}
      </aside>
    </section>
  );
}