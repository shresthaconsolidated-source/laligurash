import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Instagram, Facebook, Mail, Phone, MapPin, MessageCircle, X } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { ShopModalProvider, useShopModal } from './context/ShopModalContext';
import { PRODUCTS, SCENTS } from './data/products';

import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Corporate from './pages/Corporate';

const NAV = [
  { to: '/collection', label: 'Collection' },
  { to: '/about', label: 'Our Story' },
  { to: '/corporate', label: 'Corporate' },
];

const fieldCls =
  'w-full rounded-xl border border-wax/20 bg-kiln-2 px-4 py-3 text-wax placeholder:text-wax/35 focus:outline-none focus:border-flame focus:ring-2 focus:ring-flame/25 transition';
const labelCls = 'block text-sm font-semibold mb-2 text-wax/85';

/** The quote form. Always dark: it is a small lit room of its own over any page. */
function QuoteModal({ onClose, preselected = '' }: { onClose: () => void; preselected?: string }) {
  const [state, handleSubmit] = useForm('mreyzkkk');

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-title"
    >
      <div className="absolute inset-0 bg-kiln/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full sm:max-w-lg bg-kiln text-wax border border-wax/10 rounded-t-2xl sm:rounded-2xl p-6 sm:p-10 max-h-[92dvh] overflow-y-auto shadow-[0_0_120px_-20px_rgba(233,188,134,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-wax/60 hover:bg-kiln-2 hover:text-wax transition"
        >
          <X size={18} />
        </button>

        {state.succeeded ? (
          <div className="py-8 text-center">
            <h3 className="text-3xl mb-3">Request sent</h3>
            <p className="text-wax/60">We reply within a day with prices, scents in stock and delivery options.</p>
          </div>
        ) : (
          <>
            <h2 id="quote-title" className="text-3xl mb-2">Request a quote</h2>
            <p className="text-wax/60 text-sm mb-8">Tell us what you want and roughly how many. We answer within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="q-name" className={labelCls}>Name</label>
                <input id="q-name" type="text" name="name" required className={fieldCls} autoComplete="name" />
                <ValidationError prefix="Name" field="name" errors={state.errors} className="text-flame text-xs mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="q-email" className={labelCls}>Email</label>
                  <input id="q-email" type="email" name="email" required className={fieldCls} autoComplete="email" />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-flame text-xs mt-1" />
                </div>
                <div>
                  <label htmlFor="q-phone" className={labelCls}>Phone or WhatsApp</label>
                  <input id="q-phone" type="tel" name="phone" className={fieldCls} autoComplete="tel" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="q-interest" className={labelCls}>Product</label>
                  <select id="q-interest" name="interest" defaultValue={preselected} className={fieldCls}>
                    <option value="">Choose one</option>
                    {PRODUCTS.map((p) => (
                      <option key={p.slug} value={p.name}>{p.name}</option>
                    ))}
                    <option value="Corporate Gifting">Corporate gifting</option>
                    <option value="Custom Order">Custom order</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="q-scent" className={labelCls}>Scent</label>
                  <select id="q-scent" name="scent" defaultValue="" className={fieldCls}>
                    <option value="">Any</option>
                    {SCENTS.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="q-message" className={labelCls}>Details</label>
                <textarea id="q-message" name="message" rows={3} placeholder="Quantity, occasion, delivery city" className={`${fieldCls} resize-none`} />
              </div>
              <button type="submit" disabled={state.submitting} className="btn-flame w-full disabled:opacity-60">
                {state.submitting ? 'Sending' : 'Send request'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Header colours are mixed from --lit, so it reads on kiln black and on wax cream alike. */
function Navbar() {
  const location = useLocation();
  const { openShop } = useShopModal();
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();

  React.useEffect(() => setOpen(false), [location]);
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 nav-bg backdrop-blur-md">
      <div className="wrap h-[72px] flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0 nav-fg">
          <img src="/images/logo-160.png" alt="" className="h-10 w-10 object-contain" />
          <span className="font-display text-2xl tracking-tight">Laligurash</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full nav-pill p-1" aria-label="Primary">
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} className="relative px-4 py-2 text-sm font-semibold rounded-full">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full nav-pill-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'nav-pill-active-fg' : 'nav-fg-soft hover:opacity-100'}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <button onClick={() => openShop()} className="btn nav-cta !py-2.5 !px-5 hover:opacity-90">
              Request a quote
            </button>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px]"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`block h-[2px] w-6 nav-line transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-[2px] w-6 nav-line transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-6 nav-line transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 top-[72px] bottom-0 bg-kiln text-wax flex flex-col justify-between px-6 py-10"
          >
            <ul className="space-y-2">
              {[{ to: '/', label: 'Home' }, ...NAV].map(({ to, label }, i) => (
                <motion.li
                  key={to}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={to} className="font-display text-5xl leading-[1.1] block py-2">
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-6">
              <button onClick={() => { setOpen(false); openShop(); }} className="btn-flame w-full">
                Request a quote
              </button>
              <p className="text-wax/60 text-sm">Imadol, Lalitpur. Hand-poured in small batches.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const { openShop } = useShopModal();
  return (
    <footer className="bg-kiln text-wax relative z-10">
      <div className="wrap pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-wax/10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo-160.png" alt="" className="h-12 w-12 object-contain" />
              <span className="font-display text-3xl">Laligurash</span>
            </div>
            <p className="text-wax/65 max-w-sm leading-relaxed">
              Soy wax candles in terracotta, glass and sculpted wax, hand-poured by home-based women artisans in Lalitpur, Nepal.
            </p>
            <button onClick={() => openShop()} className="btn-flame mt-8">Request a quote</button>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-xl mb-5">Explore</h4>
            <ul className="space-y-3 text-wax/70">
              <li><Link to="/collection" className="hover:text-flame transition-colors">Collection</Link></li>
              <li><Link to="/about" className="hover:text-flame transition-colors">Our Story</Link></li>
              <li><Link to="/corporate" className="hover:text-flame transition-colors">Corporate and events</Link></li>
            </ul>
            <div className="flex gap-3 mt-8">
              <a href="https://www.instagram.com/laligurashclothing/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-wax/20 flex items-center justify-center hover:bg-flame hover:border-flame hover:text-kiln transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/LaligurashClothing" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-wax/20 flex items-center justify-center hover:bg-flame hover:border-flame hover:text-kiln transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-display text-xl mb-5">Contact</h4>
            <ul className="space-y-4 text-wax/70">
              <li className="flex items-start gap-3"><MapPin size={16} className="mt-1 shrink-0" /> Imadol, Lalitpur, Nepal</li>
              <li><a href="tel:+9779851312671" className="flex items-center gap-3 hover:text-flame transition-colors"><Phone size={16} className="shrink-0" /> +977 985 131 2671</a></li>
              <li><a href="https://wa.me/9779851312671" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-flame transition-colors"><MessageCircle size={16} className="shrink-0" /> WhatsApp us</a></li>
              <li><a href="mailto:shresthaconsolidated@gmail.com" className="flex items-center gap-3 hover:text-flame transition-colors"><Mail size={16} className="shrink-0" /> shresthaconsolidated@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between gap-3 text-sm text-wax/45">
          <p>{new Date().getFullYear()} Laligurash Nepal. All rights reserved.</p>
          <p>Handcrafted in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  const [shopOpen, setShopOpen] = React.useState(false);
  const [preselected, setPreselected] = React.useState('');

  const openShop = (product = '') => {
    setPreselected(product);
    setShopOpen(true);
  };
  const close = React.useCallback(() => setShopOpen(false), []);

  return (
    <ShopModalProvider onOpen={openShop}>
      <Router>
        <div className="grain" aria-hidden />
        <ScrollToTop />
        <AnimatePresence>{shopOpen && <QuoteModal preselected={preselected} onClose={close} />}</AnimatePresence>
        <div className="min-h-[100dvh] flex flex-col">
          <Navbar />
          <main className="flex-grow relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/corporate" element={<Corporate />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ShopModalProvider>
  );
}
