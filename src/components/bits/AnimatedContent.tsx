import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Dir = 'up' | 'down' | 'left' | 'right';
const offsets: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
  left: { x: -48, y: 0 },
  right: { x: 48, y: 0 },
};

/** React Bits "AnimatedContent" / "FadeContent": enters once when scrolled into view. */
export default function AnimatedContent({
  children,
  from = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
  amount = 0.25,
}: {
  key?: React.Key;
  children: React.ReactNode;
  from?: Dir;
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, ...offsets[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
