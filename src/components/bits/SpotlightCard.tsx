import React, { useRef } from 'react';

/**
 * React Bits "SpotlightCard": a soft radial highlight follows the pointer.
 * Position is written to CSS variables directly, no state.
 */
export default function SpotlightCard({
  children,
  className = '',
  color = 'rgba(194, 56, 47, 0.16)',
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const vars = { '--mx': '50%', '--my': '50%', '--so': '0' } as React.CSSProperties;
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
        el.style.setProperty('--so', '1');
      }}
      onPointerLeave={() => ref.current?.style.setProperty('--so', '0')}
      className={`relative overflow-hidden card ${className}`}
      style={vars}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-[var(--so)]"
        style={{ background: `radial-gradient(420px circle at var(--mx) var(--my), ${color}, transparent 60%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
