import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** React Bits "BlurText": words sharpen and rise into place. */
export default function BlurText({
  text,
  className = '',
  delay = 0.05,
  as: Tag = 'p',
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: 'p' | 'h2' | 'h3' | 'span';
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-[filter,transform]"
          initial={reduce ? false : { filter: 'blur(10px)', opacity: 0, y: 12 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: i * delay, ease: 'easeOut' }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}
