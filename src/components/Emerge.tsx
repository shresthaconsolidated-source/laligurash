import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Wraps a photo so it resolves out of shadow as it travels up the viewport.
 * A kiln-black overlay thins from near-opaque to clear; the image eases up
 * and settles. Only opacity and transform animate.
 */
export default function Emerge({
  children,
  className = '',
  from = 0.92,
}: {
  children: React.ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 100%', 'center 55%'] });
  const shade = useTransform(scrollYProgress, [0, 1], [from, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1]);

  return (
    <motion.div ref={ref} className={`relative overflow-hidden card ${className}`} style={reduce ? undefined : { y, scale }}>
      {children}
      {!reduce && <motion.div aria-hidden className="absolute inset-0 bg-kiln" style={{ opacity: shade }} />}
    </motion.div>
  );
}
