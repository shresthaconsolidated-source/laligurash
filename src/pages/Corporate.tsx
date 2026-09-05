import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import { Check } from 'lucide-react';
import SplitText from '../components/bits/SplitText';
import AnimatedContent from '../components/bits/AnimatedContent';
import Emerge from '../components/Emerge';
import { PRODUCTS, npr } from '../data/products';

const fieldCls =
  'w-full rounded-xl border border-wax/20 bg-kiln-2 px-4 py-3 text-wax placeholder:text-wax/35 focus:outline-none focus:border-flame focus:ring-2 focus:ring-flame/25 transition';
const labelCls = 'block text-sm font-semibold mb-2 text-wax/85';

const OFFERS = [
  {
    title: 'Festival gifting',
    body: 'Dashain and Tihar hampers for staff and clients. Diyos by the dozen, matkas by the box, your logo on the label.',
    points: ['From 50 pieces', 'Custom label and box', 'Delivery across the valley'],
  },
  {
    title: 'Weddings and events',
    body: 'Return gifts (koseli) and table candles. Succulent pots and daisy cards are the usual picks.',
    points: ['Personalised tags', 'Colour matched to the decor', 'Fixed delivery date'],
  },
  {
    title: 'Hotels, shops and spas',
    body: 'Souvenir glasses for the lobby shop, lotus candles for treatment rooms, monthly restock.',
    points: ['Wholesale price list', 'Monthly supply', 'Display samples on request'],
  },
];

const BULK_PICKS = ['floral-diyo', 'daisy-candle', 'succulent-pot', 'souvenir-shot-glass'];

export default function Corporate() {
  const [state, handleSubmit] = useForm('mreyzkkk');
  const picks = PRODUCTS.filter((p) => BULK_PICKS.includes(p.slug));

  // The quiet, considered part of the business stays in the dark.
  useEffect(() => {
    document.documentElement.style.setProperty('--lit', '0');
    return () => document.documentElement.style.removeProperty('--lit');
  }, []);

  return (
    <div className="text-wax">
      <section className="wrap pt-14 md:pt-20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <SplitText text="Gifts that were made here." as="h1" className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] pb-2" delay={0.06} />
          <p className="mt-6 text-lg text-wax/65 max-w-xl leading-relaxed">
            Bulk candles for Dashain, Tihar, weddings and hotel shops. Hand-poured in Lalitpur, labelled for you, delivered on a date.
          </p>
          <a href="#quote" className="btn-flame mt-9">Request a quote</a>
        </div>
        <Emerge className="lg:col-span-5 lg:col-start-8 aspect-[4/5]" from={0.6}>
          <img src="/catalog/succulent-pots-dark.jpg" alt="Succulent candles in terracotta pots, one boxed as a gift" className="absolute inset-0 w-full h-full object-cover" />
        </Emerge>
      </section>

      {/* Three offers: a plain list on dark ground, no cards */}
      <section className="wrap pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12 border-t border-wax/15 pt-12">
          {OFFERS.map((o, i) => (
            <AnimatedContent key={o.title} delay={i * 0.08}>
              <h2 className="text-3xl md:text-4xl mb-3">{o.title}</h2>
              <p className="text-wax/60 leading-relaxed">{o.body}</p>
              <ul className="mt-6 space-y-2 text-sm font-semibold text-wax/85">
                {o.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2">
                    <Check size={15} className="text-flame" strokeWidth={2.5} /> {pt}
                  </li>
                ))}
              </ul>
            </AnimatedContent>
          ))}
        </div>
      </section>

      {/* Bulk favourites */}
      <section className="wrap pb-24 md:pb-32">
        <h2 className="text-4xl md:text-5xl tracking-tight max-w-2xl">Where most bulk orders land.</h2>
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {picks.map((p, i) => (
            <AnimatedContent key={p.slug} delay={i * 0.06}>
              <Link to="/collection" className="group block">
                <div className="card overflow-hidden aspect-[4/5] mb-4 bg-kiln-2">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100" />
                </div>
                <h3 className="text-xl md:text-2xl leading-tight">{p.name}</h3>
                <p className="text-wax/55 text-sm mt-1">{p.price ? `from ${npr(p.price)} a piece` : 'Price on request'}</p>
              </Link>
            </AnimatedContent>
          ))}
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="wrap pb-28 md:pb-36 scroll-mt-20">
        <div className="card bg-kiln-2/60 border border-wax/10 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <div className="lg:col-span-7 p-8 md:p-14">
            <h2 className="text-4xl md:text-5xl tracking-tight">Tell us the date and the count.</h2>
            <p className="mt-4 text-wax/60 leading-relaxed max-w-lg">We send a priced proposal within 24 hours, with samples available for pickup in Imadol.</p>

            {state.succeeded ? (
              <div className="mt-10 card bg-kiln p-8">
                <h3 className="text-2xl mb-2">Request sent</h3>
                <p className="text-wax/60">Thank you. Expect a proposal within a day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="c-name" className={labelCls}>Name</label>
                    <input id="c-name" type="text" name="name" required className={fieldCls} autoComplete="name" />
                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-flame text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="c-email" className={labelCls}>Email</label>
                    <input id="c-email" type="email" name="email" required className={fieldCls} autoComplete="email" />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-flame text-xs mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="c-phone" className={labelCls}>Phone or WhatsApp</label>
                    <input id="c-phone" type="tel" name="phone" className={fieldCls} autoComplete="tel" />
                  </div>
                  <div>
                    <label htmlFor="c-company" className={labelCls}>Company or event</label>
                    <input id="c-company" type="text" name="company" className={fieldCls} autoComplete="organization" />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-details" className={labelCls}>Requirements</label>
                  <textarea id="c-details" name="details" required rows={4} placeholder="Pieces, products, date needed, delivery city" className={`${fieldCls} resize-none`} />
                  <ValidationError prefix="Details" field="details" errors={state.errors} className="text-flame text-xs mt-1" />
                </div>
                <button type="submit" disabled={state.submitting} className="btn-flame disabled:opacity-60">
                  {state.submitting ? 'Sending' : 'Send request'}
                </button>
              </form>
            )}
          </div>
          <div className="hidden lg:block lg:col-span-5 relative">
            <img src="/catalog/lotus-saucer-dark.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
