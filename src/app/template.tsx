'use client';

import { motion } from 'framer-motion';

/**
 * `template.tsx` re-mounts on every navigation, which makes it the right place
 * for a subtle enter transition. Kept short and purely opacity/translate so it
 * never blocks scrolling or delays content.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
