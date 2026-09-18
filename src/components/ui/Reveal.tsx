'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to stagger this element behind its siblings. */
  delay?: number;
  /** Distance travelled on entry. */
  y?: number;
  as?: 'div' | 'li' | 'section';
};

/**
 * Fades and lifts content into view once, when it first enters the viewport.
 * Honours `prefers-reduced-motion` by rendering the content statically.
 */
export function Reveal({ children, className, delay = 0, y = 22, as = 'div' }: RevealProps) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as];

  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
