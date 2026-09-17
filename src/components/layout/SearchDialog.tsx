'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Search, X } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { formatINR } from '@/lib/format';
import type { ProductCardData } from '@/types';

type SearchDialogContextValue = { open: boolean; setOpen: (v: boolean) => void };
const SearchDialogContext = createContext<SearchDialogContextValue | null>(null);

export function useSearchDialog() {
  const ctx = useContext(SearchDialogContext);
  if (!ctx) throw new Error('useSearchDialog must be used within provider');
  return ctx;
}

export function SearchDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <SearchDialogContext.Provider value={value}>{children}</SearchDialogContext.Provider>;
}

const RECENT_KEY = 'jgths_recent_searches';

export function SearchDialog() {
  const { open, setOpen } = useSearchDialog();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
    setQuery('');
    setResults([]);
  }, [open]);

  useEffect(() => {
    const stored = window.localStorage.getItem(RECENT_KEY);
    if (stored) setRecent(JSON.parse(stored));
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products);
        }
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const remember = useCallback((term: string) => {
    const next = Array.from(new Set([term, ...recent])).slice(0, 6);
    setRecent(next);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }, [recent]);

  const submit = (term: string) => {
    remember(term);
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} labelledBy="search-label" className="max-w-2xl">
      <div className="border-b border-ink/10">
        <h2 id="search-label" className="sr-only">Search the collection</h2>
        <div className="flex items-center gap-3 px-5">
          <Search className="h-4 w-4 text-ink-faint shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(query)}
            placeholder="Search pieces, crafts, occasions…"
            className="h-14 w-full bg-transparent text-[15px] placeholder:text-ink-faint focus:outline-none"
            aria-label="Search the collection"
          />
          <button onClick={() => { if (query) setQuery(''); else setOpen(false); }} aria-label="Clear search" className="text-ink-faint hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-5">
        {query.trim().length < 2 ? (
          <div>
            <p className="editorial-eyebrow mb-3">Recent searches</p>
            {recent.length === 0 ? (
              <p className="text-sm text-ink-faint">Search the collection by name, craft, or occasion.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button key={term} onClick={() => submit(term)} className="flex items-center gap-1.5 border border-ink/10 px-3 py-1.5 text-[13px] text-charcoal-700 hover:border-ink/30 transition">
                    <Clock className="h-3 w-3 text-ink-faint" /> {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => submit(query)} className="mb-4 text-[13px] text-gold-700 hover:underline">
              View all results for “{query}”
            </button>
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-16 w-14 bg-charcoal-100" />
                    <div className="flex-1 space-y-2"><div className="h-3 w-2/3 bg-charcoal-100" /><div className="h-3 w-1/3 bg-charcoal-100" /></div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="text-sm text-ink-muted">No pieces match “{query}” — try a different word.</p>
            ) : (
              <ul className="divide-y divide-ink/8">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link href={`/product/${product.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-4 py-3 hover:bg-ivory-100 -mx-3 px-3 transition">
                      <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-ivory-200">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-charcoal-900 line-clamp-1">{product.name}</span>
                        <span className="mt-0.5 block text-xs text-ink-muted uppercase tracking-wide">{product.categoryName}</span>
                      </span>
                      <span className="text-sm font-medium">{formatINR(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}