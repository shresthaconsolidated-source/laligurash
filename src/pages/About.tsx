import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SplitText from '../components/bits/SplitText';
import AnimatedContent from '../components/bits/AnimatedContent';
import BlurText from '../components/bits/BlurText';
import { useShopModal } from '../context/ShopModalContext';

const STEPS = [
  {
    title: 'Clay from valley kilns',
    body: 'Matkas, pots and saucers are bought directly from potter families around the Kathmandu valley, at their price.',
  },
  {
    title: 'Wax poured at home',
    body: 'Soy wax is melted, coloured and scented in small batches at artisans’ own homes, around their own days.',
  },
  {
    title: 'Petals shaped by hand',
    body: 'Daisies, lotus and peonies are molded petal by petal and set on the wax while it is still soft. No two match.',
  },
  {
    title: 'Labelled and packed',
    body: 'Each piece gets the rhododendron label, a wick trim and a box or card backing before it leaves Imadol.',
  },
];

export default function About() {
  const { openShop } = useShopModal();
  return (
    <div>
      <section className="wrap pt-14 md:pt-20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <SplitText text="A flower, a flame, a livelihood." as="h1" className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] pb-2" delay={0.06} />
          <p className="mt-6 text-lg text-mute max-w-xl leading-relaxed">
            Laligurash is the Nepali word for rhododendron. We took the name because the flower grows where little else does, and so does this work.
          </p>
        </div>
        <AnimatedContent from="right" className="lg:col-span-5 card overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
          <img src="/catalog/shot-glass-trio.jpg" alt="Three souvenir shot glass candles with Nepali prints" className="w-full h-full object-cover" />
        </AnimatedContent>
      </section>

      <section className="wrap pb-20 md:pb-28">
        <div className="max-w-3xl space-y-6 text-lg text-mute leading-relaxed">
          <p className="text-ink text-2xl md:text-3xl font-display leading-snug">
            Laligurash began as a collective, not a company. A group of women in Imadol, Lalitpur wanted work that fit around their homes and paid fairly for skill.
          </p>
          <p>
            The first products were diyos for Tihar. Then came the terracotta matkas, the printed souvenir glasses for visitors, and the sculpted flowers that now
            fill the catalog. Everything is still made at home, in small batches, by the same group.
          </p>
          <p>
            Your order pays the artisans directly and keeps the potter families who supply the clay in work. That is the whole model.
          </p>
        </div>
      </section>

      {/* How it is made: numbered vertical list with real content as labels */}
      <section className="bg-wax-2 section">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <BlurText text="How a candle gets made." as="h2" className="text-4xl md:text-5xl tracking-tight" />
            <AnimatedContent className="mt-10 card overflow-hidden">
              <img src="/catalog/matka-pair.jpg" alt="Two terracotta matka candles" loading="lazy" className="w-full aspect-[4/3] object-cover" />
            </AnimatedContent>
          </div>
          <ol className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {STEPS.map((s, i) => (
              <AnimatedContent key={s.title} delay={i * 0.08}>
                <li>
                  <span className="font-display text-5xl text-terracotta-deep block mb-3">{i + 1}</span>
                  <h3 className="text-2xl mb-2">{s.title}</h3>
                  <p className="text-mute leading-relaxed">{s.body}</p>
                </li>
              </AnimatedContent>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <AnimatedContent from="left" className="md:col-span-5 card overflow-hidden">
            <img src="/catalog/daisy-cards.jpg" alt="Daisy candles packed on printed cards" loading="lazy" className="w-full aspect-[4/3] object-cover" />
          </AnimatedContent>
          <div className="md:col-span-7 md:pl-10">
            <h2 className="text-4xl md:text-5xl tracking-tight">Come and see the work.</h2>
            <p className="mt-5 text-mute text-lg max-w-lg leading-relaxed">
              We are in Imadol, Lalitpur. Visitors, shops and event planners are welcome to see samples before ordering.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => openShop()} className="btn-terra">Request a quote</button>
              <Link to="/collection" className="inline-flex items-center gap-2 font-semibold px-2 hover:text-terracotta-deep transition-colors">
                Browse the collection <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
