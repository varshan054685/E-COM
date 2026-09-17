export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
);

export const defaultKeywords = [
  'JGTHS',
  'aari couture',
  'aari embroidery',
  'designer blouses',
  'bridal couture',
  'Coimbatore boutique',
  'custom couture',
  'Indian designer wear',
];

export function buildSeo({
  title,
  description,
  path,
  type = 'website',
  images = [],
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'product' | 'article';
  images?: string[];
}) {
  return {
    title: `${title} | JGTHS`,
    description,
    alternates: { canonical: path },
    keywords: defaultKeywords,
    openGraph: {
      title: `${title} | JGTHS`,
      description,
      url: path,
      siteName: 'JGTHS Designer Boutique & Aari Couture',
      type,
      images: images.length ? images : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | JGTHS`,
      description,
    },
  };
}