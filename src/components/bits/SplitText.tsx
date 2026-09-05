import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/**
 * React Bits "SplitText", rebuilt on Motion. Splits into words (and optionally
 * characters) and staggers them in when the heading scrolls into view.
 * The heading itself is observed (not the clipped pieces), so the observer fires.
 */
export default function SplitText({
  text,
  as: Tag = 'h1',
  className = '',
  splitType = 'words',
  delay = 0.03,
  duration = 0.8,
  once = true,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  splitType?: 'words' | 'chars';
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount: 0.2 });
  const reduce = useReducedMotion();
  const words = text.split(' ');
  let index = 0;
  const show = reduce || inView;

  return (
    <Tag ref={ref as React.Ref<never>} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {(splitType === 'chars' ? word.split('') : [word]).map((piece, pi) => {
            const i = index++;
            return (
              <span key={pi} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
                <motion.span
                  aria-hidden
                  className="inline-block will-change-transform"
                  initial={false}
                  animate={show ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
                  transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : i * delay, ease: [0.16, 1, 0.3, 1] }}
                >
                  {piece}
                </motion.span>
              </span>
            );
          })}
          {wi < words.length - 1 && <span aria-hidden>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
