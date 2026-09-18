import { AtelierStory } from '@/components/home/atelier-story';
import { Bestsellers } from '@/components/home/bestsellers';
import { CustomOrderCta } from '@/components/home/custom-order-cta';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { Hero } from '@/components/home/hero';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <Bestsellers />
      <AtelierStory />
      <CustomOrderCta />
    </>
  );
}
