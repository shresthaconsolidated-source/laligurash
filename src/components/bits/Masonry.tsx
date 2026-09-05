import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** React Bits "Masonry": staggered image grid, CSS columns with per-tile reveal. */
export default function Masonry({
  items,
  className = '',
}: {
  items: { src: string; alt: string; caption?: string }[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`masonry ${className}`}>
      {items.map((it, i) => (
        <motion.figure
          key={it.src}
          className="card overflow-hidden bg-paper-2 group"
          initial={reduce ? false : { opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={it.src}
            alt={it.alt}
            loading="lazy"
            className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {it.caption && <figcaption className="px-4 py-3 text-sm text-mute">{it.caption}</figcaption>}
        </motion.figure>
      ))}
    </div>
  );
}
