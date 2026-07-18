import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';

/** Thin gold bar fixed to the top of the viewport, tracking overall page scroll progress. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-gold to-brand-terracotta origin-left z-[110]"
    />
  );
}

/** Fades/slides children in the first time they enter the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Image that drifts vertically at a different rate than the page scroll, for parallax depth. */
export function ParallaxImage({
  src,
  alt,
  className = '',
  strength = 60,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className={`absolute left-0 w-full h-[calc(100%+120px)] -top-[60px] object-cover ${className}`}
      />
    </div>
  );
}

/** Custom cursor pill that appears with a label while hovering inside its wrapped area. */
export function CursorArea({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
    >
      {children}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
        transition={{ opacity: { duration: 0.25 }, scale: { duration: 0.25 } }}
        className="hidden md:flex pointer-events-none absolute top-0 left-0 z-30 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-20 h-20 rounded-full bg-brand-gold text-brand-ink text-[11px] font-medium uppercase tracking-[0.15em]"
      >
        {label}
      </motion.div>
    </div>
  );
}
