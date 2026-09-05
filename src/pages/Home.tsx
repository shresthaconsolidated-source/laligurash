import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SplitText from '../components/bits/SplitText';
import BlurText from '../components/bits/BlurText';
import ScrollVelocity from '../components/bits/ScrollVelocity';
import AnimatedContent from '../components/bits/AnimatedContent';
import CountUp from '../components/bits/CountUp';
import Magnet from '../components/bits/Magnet';
import Masonry from '../components/bits/Masonry';
import SpotlightCard from '../components/bits/SpotlightCard';
import ProductCard from '../components/ProductCard';
import { featured, FAMILIES, SCENTS, Family } from '../data/products';
import { useShopModal } from '../context/ShopModalContext';

const FAMILY_IMAGES: Record<Family, string> = {
  souvenir: '/catalog/shot-glass-stupa.jpg',
  terracotta: '/catalog/matka-pair.jpg',
  floral: '/catalog/peony-blue.jpg',
  glass: '/catalog/glass-jar-lids.jpg',
};

// Only photos that do not already appear higher on the page.
const GALLERY = [
  { src: '/catalog/shot-glass-trio.jpg', alt: 'Three souvenir shot glass candles with Nepali prints' },
  { src: '/catalog/glass-jar-lit.jpg', alt: 'Lit clear glass jar candle with Laligurash label' },
  { src: '/catalog/floral-pots.jpg', alt: 'Floral terracotta pot candles' },
  { src: '/catalog/peony-trio.jpg', alt: 'Peony candles in three colours' },
  { src: '/catalog/lotus-saucer.jpg', alt: 'Lotus candle on a terracotta saucer' },
  { src: '/catalog/daisy-cards.jpg', alt: 'Daisy candles on printed cards' },
];

export default function Home() {
  const { openShop } = useShopModal();
  const reduce = useReducedMotion();
  const picks = featured();

  return (
    <div className="overflow-x-clip">
      {/* Hero: asymmetric split, copy left, photography right */}
      <section className="wrap min-h-[calc(100dvh-72px)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-10 pb-16 lg:py-12">
        <div className="lg:col-span-6 xl:col-span-5">
          <SplitText
            text="Handcrafted light from Nepal."
            as="h1"
            className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] pb-2 tracking-tight"
            delay={0.06}
          />
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg text-mute max-w-md leading-relaxed"
          >
            Soy wax candles in terracotta, printed glass and sculpted wax. Poured by hand in Lalitpur, priced from NPR 45.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnet>
              <Link to="/collection" className="btn-red">
                Browse the collection <ArrowRight size={16} />
              </Link>
            </Magnet>
            <Link to="/corporate" className="btn-line">Corporate gifting</Link>
          </motion.div>
        </div>

        <div className="lg:col-span-6 xl:col-span-7 relative">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="card overflow-hidden aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/4] lg:ml-8"
          >
            <img
              src="/catalog/cover-floral-bowls.jpg"
              alt="Terracotta bowl candles topped with wax daisies and sunflowers"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -30, rotate: -4 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute -bottom-8 -left-2 lg:left-0 w-40 lg:w-52 card overflow-hidden shadow-[0_24px_60px_-20px_rgba(63,69,41,0.45)] border-4 border-paper"
          >
            <img src="/catalog/succulent-pots.jpg" alt="Succulent candle boxed as a gift" className="w-full h-full object-cover aspect-[4/5]" />
          </motion.div>
        </div>
      </section>

      {/* Velocity marquee: the only marquee on the page */}
      <ScrollVelocity
        items={['Hand-poured soy wax', 'Rose', 'Lemongrass', 'Sandalwood', 'Lavender', 'Terracotta from valley kilns', 'Made in Lalitpur']}
        className="border-y border-ink/10 py-4 font-display text-2xl md:text-3xl"
      />

      {/* Featured products: horizontal snap row on mobile, 4-up on desktop */}
      <section className="section">
        <div className="wrap">
          <BlurText text="What people take home." as="h2" className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-2xl" />
          <div className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory no-bar -mx-5 px-5 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {picks.map((p, i) => (
              <AnimatedContent key={p.slug} delay={i * 0.08} className="snap-start shrink-0 w-[78vw] sm:w-[46vw] lg:w-auto">
                <ProductCard product={p} />
              </AnimatedContent>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/collection" className="inline-flex items-center gap-2 font-semibold text-ink hover:text-red transition-colors">
              See all eleven pieces <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Four families: bento with 4 cells for 4 families */}
      <section className="wrap pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {(Object.keys(FAMILIES) as Family[]).map((key, i) => {
            const wide = i === 0 || i === 3;
            return (
              <AnimatedContent
                key={key}
                from={i % 2 ? 'right' : 'left'}
                className={`${wide ? 'md:col-span-7' : 'md:col-span-5'}`}
              >
                <Link
                  to={`/collection#${key}`}
                  className="group relative block card overflow-hidden aspect-[4/3] md:aspect-auto md:h-[420px]"
                >
                  <img
                    src={FAMILY_IMAGES[key]}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-ink/85 via-olive-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-paper">
                    <h3 className="text-3xl md:text-4xl mb-2">{FAMILIES[key].label}</h3>
                    <p className="text-paper/80 max-w-md text-sm md:text-base">{FAMILIES[key].blurb}</p>
                  </div>
                </Link>
              </AnimatedContent>
            );
          })}
        </div>
      </section>

      {/* Scents and facts: the one olive colour block on the page */}
      <section className="bg-olive-deep text-paper section">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-4xl md:text-5xl tracking-tight mb-6">Four scents. One wax.</h2>
            <p className="text-paper/75 leading-relaxed max-w-md">
              Every piece is poured with the same soy wax and one of four fragrance oils. Pick the scent when you order, or mix a set.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <CountUp to={4} className="font-display text-5xl md:text-6xl block" />
                <span className="text-sm text-paper/60">scents</span>
              </div>
              <div>
                <CountUp to={50} suffix="g" className="font-display text-5xl md:text-6xl block" />
                <span className="text-sm text-paper/60">soy wax per glass</span>
              </div>
              <div>
                <CountUp to={4} suffix="h+" className="font-display text-5xl md:text-6xl block" />
                <span className="text-sm text-paper/60">burn time</span>
              </div>
            </div>
          </div>
          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCENTS.map((s, i) => (
              <AnimatedContent key={s.name} delay={i * 0.08}>
                <li className="card bg-olive-ink/40 border border-paper/10 p-6 flex items-center gap-5 h-full">
                  <span className="w-14 h-14 rounded-full shrink-0 shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]" style={{ background: s.color }} aria-hidden />
                  <div>
                    <h3 className="text-2xl">{s.name}</h3>
                    <p className="text-paper/65 text-sm">{s.note}</p>
                  </div>
                </li>
              </AnimatedContent>
            ))}
          </ul>
        </div>
      </section>

      {/* Story: vertical stack, image full-bleed below */}
      <section className="section">
        <div className="wrap">
          <div className="max-w-3xl">
            <BlurText
              text="Made at kitchen tables by women who set their own hours."
              as="h2"
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08]"
              delay={0.04}
            />
            <p className="mt-8 text-lg text-mute leading-relaxed max-w-2xl">
              Laligurash is the Nepali name for the rhododendron, the national flower. The candles are made by home-based women artisans in
              Lalitpur. Terracotta comes from valley potters, wax flowers are molded one petal at a time, and every glass is labelled by hand.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 font-semibold hover:text-red transition-colors">
              Read our story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        {/* Gallery doubles as the story's imagery */}
        <div className="wrap mt-14">
          <Masonry items={GALLERY} />
        </div>
      </section>

      {/* Gifting CTA */}
      <section className="wrap pb-24 md:pb-32">
        <SpotlightCard className="bg-paper-2 p-8 md:p-14 lg:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08]">
                Tihar sets, wedding koseli, office hampers.
              </h2>
              <p className="mt-6 text-mute text-lg max-w-xl leading-relaxed">
                Bulk pricing from 50 pieces, your logo on the label, and delivery across the valley. Tell us the date and the count.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
              <button onClick={() => openShop('Corporate Gifting')} className="btn-red">Request a quote</button>
              <Link to="/corporate" className="btn-line">Corporate gifting</Link>
            </div>
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}
