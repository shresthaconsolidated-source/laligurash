import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import LightRig from '../components/LightRig';
import Emerge from '../components/Emerge';
import SplitText from '../components/bits/SplitText';
import AnimatedContent from '../components/bits/AnimatedContent';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, SCENTS, npr } from '../data/products';
import { useShopModal } from '../context/ShopModalContext';

/** The five photographs that read as objects in a dark room. */
const IN_THE_DARK = [
  { slug: 'succulent-pot', src: '/catalog/succulent-pots-dark.jpg', alt: 'Succulent candles in terracotta pots, one lit, one boxed' },
  { slug: 'blooming-lotus', src: '/catalog/lotus-saucer-dark.jpg', alt: 'Lotus candle lit on a terracotta saucer' },
  { slug: 'terracotta-matka', src: '/catalog/matka-pair-dark.jpg', alt: 'Two terracotta matka candles, one lit' },
  { slug: 'clear-glass-jar', src: '/catalog/glass-jar-lit-dark.jpg', alt: 'Lit glass jar candle with the Laligurash label' },
];

/** Daylight photographs belong in the lit room. */
const LIT_PICKS = ['souvenir-shot-glass', 'floral-terracotta-pot', 'peony-bloom', 'daisy-candle', 'glass-jar-wooden-lid', 'floral-diyo'];

export default function Home() {
  const { openShop } = useShopModal();
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const duskRef = useRef<HTMLDivElement>(null);

  // Ignite: the flame comes up over the first two seconds. Static at 1 under reduced motion.
  const ignite = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      ignite.set(1);
      document.documentElement.style.setProperty('--lit', '0');
      return () => document.documentElement.style.removeProperty('--lit');
    }
    const c = animate(ignite, 1, { duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 });
    return () => c.stop();
  }, [reduce, ignite]);

  const candleShade = useTransform(ignite, [0, 1], [0.85, 0.08]);
  const headOpacity = useTransform(ignite, [0.25, 1], [0, 1]);
  const headY = useTransform(ignite, [0.25, 1], [18, 0]);

  const dark = PRODUCTS.filter((p) => IN_THE_DARK.some((d) => d.slug === p.slug));
  const lit = LIT_PICKS.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean);

  // Under reduced motion the fixed rig is not mounted; sections carry their own ground.
  const darkBg = reduce ? 'bg-kiln' : '';
  const litBg = reduce ? 'bg-wax' : '';

  return (
    <div className="relative">
      {!reduce && <LightRig heroRef={heroRef} dawnRef={dawnRef} duskRef={duskRef} ignite={ignite} />}

      <div className="relative z-10">
        {/* HERO: a single candle in the dark */}
        <section ref={heroRef} className={`relative min-h-[calc(100dvh-72px)] ${darkBg} text-wax`}>
          <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center min-h-[calc(100dvh-72px)] py-6 lg:py-6">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div style={reduce ? undefined : { opacity: headOpacity, y: headY }}>
                <SplitText
                  text="Light, made by hand."
                  as="h1"
                  className="text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight pb-2"
                  delay={0.07}
                  duration={1.1}
                />
                <p className="mt-6 text-lg text-wax/70 max-w-md leading-relaxed">
                  Soy candles in terracotta, printed glass and sculpted wax. Poured in Lalitpur by women who work from home.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link to="/collection" className="btn-flame">
                    Browse the collection <ArrowRight size={16} />
                  </Link>
                  <Link to="/corporate" className="btn-ghost-wax">Corporate gifting</Link>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end">
              <motion.figure
                className="relative w-[58vw] sm:w-[60vw] max-w-[420px] lg:max-w-[520px] aspect-[768/1115] flame-mask -mb-6 lg:mb-0"
                initial={reduce ? false : { scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src="/catalog/shot-glass-stupa-dark.jpg"
                  alt="A lit souvenir glass candle printed with Boudhanath stupa, beside a brass Buddha"
                  className="absolute inset-0 w-full h-full object-cover"
                  fetchPriority="high"
                />
                {!reduce && <motion.div aria-hidden className="absolute inset-0 bg-kiln" style={{ opacity: candleShade }} />}
              </motion.figure>
            </div>
          </div>
        </section>

        {/* IN THE DARK: pieces resolve out of shadow as the light comes up */}
        <section className={`${darkBg} text-wax py-24 md:py-32`}>
          <div className="wrap">
            <AnimatedContent>
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-2xl leading-[1.05]">
                Meant to be seen lit.
              </h2>
              <p className="mt-6 text-wax/65 text-lg max-w-lg leading-relaxed">
                Four scents, one soy wax, four hours or more of flame. These are the pieces people light first.
              </p>
            </AnimatedContent>

            <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-16 md:gap-y-24">
              {IN_THE_DARK.map((item, i) => {
                const p = dark.find((d) => d.slug === item.slug)!;
                const left = i % 2 === 0;
                return (
                  <div
                    key={item.slug}
                    className={`md:col-span-6 ${left ? 'md:pr-10' : 'md:pl-10 md:translate-y-24'} flex flex-col`}
                  >
                    <Emerge className={i === 1 || i === 2 ? 'aspect-[4/5]' : 'aspect-[4/5] md:aspect-[5/6]'}>
                      <img src={item.src} alt={item.alt} loading={i === 0 ? 'eager' : 'lazy'} className="absolute inset-0 w-full h-full object-cover" />
                    </Emerge>
                    <div className="mt-6 flex items-end justify-between gap-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl leading-tight">{p.name}</h3>
                        <p className="text-wax/55 mt-1">{p.tagline}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-[11px] uppercase tracking-wider text-wax/45">from</span>
                        <span className="font-display text-2xl text-flame">{p.price ? npr(p.price) : 'On request'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openShop(p.name)}
                      className="mt-3 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-flame hover:text-flame-core transition-colors"
                    >
                      Request a quote <ArrowRight size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DAWN: an empty band. The room lights up while this scrolls past. */}
        <div ref={dawnRef} aria-hidden className="h-[70vh] md:h-[80vh]" />

        {/* THE LIT ROOM: the collection in daylight */}
        <section className={`${litBg} text-ink pb-24 md:pb-32`}>
          <div className="wrap">
            <AnimatedContent>
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl leading-[1.05]">
                And in daylight, the colour.
              </h2>
              <p className="mt-6 text-mute text-lg max-w-lg leading-relaxed">
                Eleven pieces across souvenir glass, terracotta, floral and glass jar. Prices are per piece.
              </p>
            </AnimatedContent>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {lit.map((p, i) => (
                <AnimatedContent key={p.slug} delay={(i % 3) * 0.08}>
                  <ProductCard product={p} />
                </AnimatedContent>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
              <Link to="/collection" className="btn-terra">
                Browse the collection <ArrowRight size={16} />
              </Link>
              <ul className="flex flex-wrap gap-2">
                {SCENTS.map((s) => (
                  <li key={s.name} className="inline-flex items-center gap-2 rounded-full bg-wax-2 px-4 py-2 text-sm font-semibold">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ background: s.color }} aria-hidden />
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* STORY: short, lit */}
        <section className={`${litBg} text-ink pb-28 md:pb-40`}>
          <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <AnimatedContent from="left" className="lg:col-span-5 card overflow-hidden">
              <img src="/catalog/cover-floral-bowls.jpg" alt="Terracotta bowl candles topped with wax daisies" loading="lazy" className="w-full aspect-[4/5] object-cover" />
            </AnimatedContent>
            <div className="lg:col-span-6 lg:col-start-7">
              <h2 className="text-4xl md:text-5xl tracking-tight leading-[1.05]">Named for the rhododendron.</h2>
              <p className="mt-6 text-mute text-lg leading-relaxed max-w-lg">
                Laligurash is Nepal's national flower. The candles are made at kitchen tables in Imadol by women who set their own hours,
                in clay from valley potters, with petals shaped one at a time.
              </p>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 font-semibold text-terracotta-deep hover:text-terracotta transition-colors">
                Read our story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* DUSK: the light goes back down before the quiet part of the business */}
        <div ref={duskRef} aria-hidden className="h-[50vh] md:h-[60vh]" />

        {/* GIFTING: back in the dark */}
        <section className={`${darkBg} text-wax pb-28 md:pb-36`}>
          <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
                Tihar sets, wedding koseli, office hampers.
              </h2>
              <p className="mt-6 text-wax/65 text-lg max-w-xl leading-relaxed">
                Bulk pricing from 50 pieces, your logo on the label, delivery across the valley. Tell us the date and the count.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <button onClick={() => openShop('Corporate Gifting')} className="btn-flame">Request a quote</button>
                <Link to="/corporate" className="btn-ghost-wax">Corporate gifting</Link>
              </div>
            </div>
            <Emerge className="lg:col-span-4 lg:col-start-9 aspect-[4/3]" from={0.8}>
              <img src="/catalog/glass-jar-lit-dark.jpg" alt="Lit glass jar candle" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </Emerge>
          </div>
        </section>
      </div>
    </div>
  );
}
