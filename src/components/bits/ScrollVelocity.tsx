import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from 'motion/react';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * React Bits "ScrollVelocity": a marquee whose speed and direction react to
 * how fast the page is scrolling. Used once on the page.
 */
export default function ScrollVelocity({
  items,
  baseVelocity = 40,
  className = '',
}: {
  items: string[];
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * Math.abs(move) * Math.abs(f);
    baseX.set(baseX.get() + (move / window.innerWidth) * 100 * 0.25);
  });

  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex items-center shrink-0 gap-6 pr-6">
          {t}
          <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-red/70" />
        </span>
      ))}
    </>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={{ x }} className="flex w-max">
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
