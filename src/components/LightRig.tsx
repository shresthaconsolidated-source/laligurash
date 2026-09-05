import React, { useEffect } from 'react';
import { motion, MotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';

/**
 * The lighting rig for the Home page.
 *
 * Three scroll ranges drive it:
 *  - heroRef: the opening. The glow grows as the visitor leaves the hero.
 *  - dawnRef: an empty band where the room lights up. --lit goes 0 -> 1 across it.
 *  - duskRef: an empty band before the gifting block where the light goes back down.
 *
 * Everything here animates only opacity and transform on fixed layers, plus one
 * CSS variable (--lit) that the body ground and nav read. Nothing else on the
 * page depends on --lit, so the per-frame style cost stays small.
 */
export default function LightRig({
  heroRef,
  dawnRef,
  duskRef,
  ignite,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
  dawnRef: React.RefObject<HTMLElement | null>;
  duskRef: React.RefObject<HTMLElement | null>;
  ignite: MotionValue<number>;
}) {
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: dawnP } = useScroll({ target: dawnRef, offset: ['start end', 'end start'] });
  const { scrollYProgress: duskP } = useScroll({ target: duskRef, offset: ['start end', 'end start'] });

  // Light level: up through dawn, down through dusk. Smoothed so it never steps.
  const litRaw = useTransform([dawnP, duskP], ([d, k]: number[]) => Math.max(0, Math.min(1, d - k)));
  const lit = useSpring(litRaw, { stiffness: 120, damping: 28, mass: 0.6 });

  useEffect(() => {
    document.documentElement.style.setProperty('--lit', '0');
    return () => document.documentElement.style.removeProperty('--lit');
  }, []);
  useMotionValueEvent(lit, 'change', (v) => {
    document.documentElement.style.setProperty('--lit', v.toFixed(3));
  });

  // Ambient warmth: rises as the visitor scrolls out of the hero, gone once lit.
  // After dusk both settle lower than they were: the gifting block is the quiet part.
  const ambient = useTransform([heroP, lit, ignite, duskP], ([h, l, i, k]: number[]) => (0.15 + 0.5 * h) * (1 - l) * i * (1 - 0.7 * k));
  // The glow: born at the flame, then swells and drifts to the centre of the room.
  const glowOpacity = useTransform([heroP, lit, ignite, duskP], ([h, l, i, k]: number[]) => (0.55 + 0.45 * h) * (1 - l) * i * (1 - 0.55 * k));
  const glowScale = useTransform([heroP, ignite], ([h, i]: number[]) => (0.7 + 1.1 * h) * (0.6 + 0.4 * i));
  const glowX = useTransform(heroP, [0, 1], ['18vw', '0vw']);
  const glowY = useTransform(heroP, [0, 1], ['-10vh', '0vh']);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div className="absolute inset-0 bg-umber" style={{ opacity: ambient }} />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          opacity: glowOpacity,
          scale: glowScale,
          x: glowX,
          y: glowY,
          background:
            'radial-gradient(circle, rgba(255,243,196,0.55) 0%, rgba(233,188,134,0.32) 14%, rgba(168,102,63,0.16) 32%, rgba(21,13,9,0) 58%)',
        }}
      />
    </div>
  );
}
