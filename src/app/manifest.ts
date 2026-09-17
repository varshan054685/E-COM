import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JGTHS Designer Boutique & Aari Couture',
    short_name: 'JGTHS',
    description:
      'Designer couture, intricate Aari artistry, and custom creations from Coimbatore.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F1E7',
    theme_color: '#1F1B17',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}