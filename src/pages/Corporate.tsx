import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import { Check } from 'lucide-react';
import SplitText from '../components/bits/SplitText';
import AnimatedContent from '../components/bits/AnimatedContent';
import SpotlightCard from '../components/bits/SpotlightCard';
import { PRODUCTS, npr } from '../data/products';

const fieldCls =
  'w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition';
const labelCls = 'block text-sm font-semibold mb-2';

const OFFERS = [
  {
    title: 'Festival gifting',
    body: 'Dashain and Tihar hampers for staff and clients. Diyos by the dozen, matkas by the box, your logo on the label.',
    points: ['From 50 pieces', 'Custom label and box', 'Delivery across the valley'],
    image: '/catalog/floral-pots.jpg',
  },
  {
    title: 'Weddings and events',
    body: 'Return gifts (koseli) and table candles. Succulent pots and daisy cards are the usual picks.',
    points: ['Personalised tags', 'Colour matched to the decor', 'Fixed delivery date'],
    image: '/catalog/succulent-pots.jpg',
  },
  {
    title: 'Hotels, shops and spas',
    body: 'Souvenir glasses for the lobby shop, lotus candles for treatment rooms, monthly restock.',
    points: ['Wholesale price list', 'Monthly supply', 'Display samples on request'],
    image: '/catalog/shot-glass-stupa.jpg',
  },
];

const BULK_PICKS = ['floral-diyo', 'daisy-candle', 'succulent-pot', 'souvenir-shot-glass'];

export default function Corporate() {
  const [state, handleSubmit] = useForm('mreyzkkk');
  const picks = PRODUCTS.filter((p) => BULK_PICKS.includes(p.slug));

  return (
    <div>
      <section className="wrap pt-14 md:pt-20 pb-16">
        <div className="max-w-4xl">
          <SplitText text="Gifts that were made here." as="h1" className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] pb-2" delay={0.06} />
          <p className="mt-6 text-lg text-mute max-w-xl leading-relaxed">
            Bulk candles for Dashain, Tihar, weddings and hotel shops. Hand-poured in Lalitpur, labelled for you, delivered on a date.
          </p>
          <a href="#quote" className="btn-red mt-9">Request a quote</a>
        </div>
        <AnimatedContent className="mt-14 card overflow-hidden">
          <img src="/images/fb.png" alt="Tihar table with lit diyos and marigolds" className="w-full aspect-[16/9] md:aspect-[21/9] object-cover" />
        </AnimatedContent>
      </section>

      {/* Three offers as a 1 + 2 asymmetric layout */}
      <section className="wrap pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {OFFERS.map((o, i) => (
          <AnimatedContent key={o.title} delay={i * 0.08} className={i === 0 ? 'lg:col-span-12' : 'lg:col-span-6'}>
            <div className={`card overflow-hidden bg-paper-2 h-full grid ${i === 0 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              <img
                src={o.image}
                alt=""
                loading="lazy"
                className={`w-full object-cover ${i === 0 ? 'aspect-[4/3] md:aspect-auto md:h-full' : 'aspect-[16/9]'}`}
              />
              <div className="p-7 md:p-10 flex flex-col">
                <h2 className="text-3xl md:text-4xl mb-3">{o.title}</h2>
                <p className="text-mute leading-relaxed">{o.body}</p>
                <ul className="mt-6 space-y-2 text-sm font-semibold">
                  {o.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2">
                      <Check size={15} className="text-red" strokeWidth={2.5} /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedContent>
        ))}
      </section>

      {/* Bulk favourites */}
      <section className="bg-olive-deep text-paper section">
        <div className="wrap">
          <h2 className="text-4xl md:text-5xl tracking-tight max-w-2xl">Where most bulk orders land.</h2>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {picks.map((p, i) => (
              <AnimatedContent key={p.slug} delay={i * 0.06}>
                <Link to="/collection" className="group block">
                  <div className="card overflow-hidden aspect-[4/5] mb-4">
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  </div>
                  <h3 className="text-xl md:text-2xl leading-tight">{p.name}</h3>
                  <p className="text-paper/60 text-sm mt-1">{p.price ? `from ${npr(p.price)} a piece` : 'Price on request'}</p>
                </Link>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="wrap section scroll-mt-20">
        <SpotlightCard className="bg-paper-2">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 md:p-14">
              <h2 className="text-4xl md:text-5xl tracking-tight">Tell us the date and the count.</h2>
              <p className="mt-4 text-mute leading-relaxed max-w-lg">We send a priced proposal within 24 hours, with samples available for pickup in Imadol.</p>

              {state.succeeded ? (
                <div className="mt-10 card bg-paper p-8">
                  <h3 className="text-2xl mb-2">Request sent</h3>
                  <p className="text-mute">Thank you. Expect a proposal within a day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-name" className={labelCls}>Name</label>
                      <input id="c-name" type="text" name="name" required className={fieldCls} autoComplete="name" />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red text-xs mt-1" />
                    </div>
                    <div>
                      <label htmlFor="c-email" className={labelCls}>Email</label>
                      <input id="c-email" type="email" name="email" required className={fieldCls} autoComplete="email" />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red text-xs mt-1" />
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
                    <ValidationError prefix="Details" field="details" errors={state.errors} className="text-red text-xs mt-1" />
                  </div>
                  <button type="submit" disabled={state.submitting} className="btn-red disabled:opacity-60">
                    {state.submitting ? 'Sending' : 'Send request'}
                  </button>
                </form>
              )}
            </div>
            <div className="hidden lg:block lg:col-span-5 relative min-h-full">
              <img src="/catalog/daisy-cards.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}
