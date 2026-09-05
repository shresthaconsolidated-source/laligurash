import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

/**
 * React Bits "TiltedCard": the card rotates in 3D toward the pointer.
 * Driven by motion values, so no React re-render per mouse move.
 */
export default function TiltedCard({
  children,
  className = '',
  amplitude = 10,
  scale = 1.03,
}: {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [amplitude, -amplitude]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-amplitude, amplitude]), { stiffness: 220, damping: 22 });
  const s = useSpring(1, { stiffness: 220, damping: 22 });

  return (
    <div className="[perspective:1000px]">
      <motion.div
        ref={ref}
        className={`relative [transform-style:preserve-3d] ${className}`}
        style={reduce ? undefined : { rotateX, rotateY, scale: s }}
        onPointerMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerEnter={() => s.set(scale)}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
          s.set(1);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
