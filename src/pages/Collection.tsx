import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';
import SplitText from '../components/bits/SplitText';
import { PRODUCTS, FAMILIES, SCENTS, Family } from '../data/products';

type Filter = 'all' | Family;
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  ...(Object.keys(FAMILIES) as Family[]).map((k) => ({ key: k, label: FAMILIES[k].label })),
];

export default function Collection() {
  const { hash } = useLocation();
  const initial = (hash.replace('#', '') as Filter) || 'all';
  const [filter, setFilter] = React.useState<Filter>(FILTERS.some((f) => f.key === initial) ? initial : 'all');

  React.useEffect(() => {
    const h = hash.replace('#', '') as Filter;
    if (FILTERS.some((f) => f.key === h)) setFilter(h);
  }, [hash]);

  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.family === filter);

  return (
    <div>
      <section className="wrap pt-14 md:pt-20 pb-10">
        <SplitText text="The collection." as="h1" className="text-5xl md:text-6xl lg:text-7xl tracking-tight" delay={0.08} />
        <p className="mt-6 text-lg text-mute max-w-xl leading-relaxed">
          Eleven pieces across four families. Prices are per piece and start points; sets and bulk orders are quoted separately.
        </p>

        {/* Filter pills (React Bits PillNav) */}
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter by family">
          {FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.key)}
                className="relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 ${active ? 'text-wax' : 'text-ink/70 hover:text-ink'}`}>{f.label}</span>
              </button>
            );
          })}
        </div>
        {filter !== 'all' && <p className="mt-5 text-mute max-w-xl">{FAMILIES[filter].blurb}</p>}
      </section>

      <section className="wrap pb-20 md:pb-28">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                id={p.family}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="wrap pb-24 md:pb-32">
        <div className="card bg-wax-2 p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6">
            <h2 className="text-3xl md:text-4xl tracking-tight">Every piece, any of four scents.</h2>
            <p className="mt-4 text-mute leading-relaxed">
              Choose the scent when you order. Lavender and lemongrass cost a little more because the oils do; the difference is under NPR 10 a piece.
            </p>
          </div>
          <ul className="md:col-span-6 grid grid-cols-2 gap-3">
            {SCENTS.map((s) => (
              <li key={s.name} className="flex items-center gap-3 rounded-full bg-wax px-4 py-3">
                <span className="w-5 h-5 rounded-full shrink-0" style={{ background: s.color }} aria-hidden />
                <span className="font-semibold text-sm">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
