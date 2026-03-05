import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Facebook, Mail, Phone, MapPin, MessageCircle, X } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { ShopModalProvider, useShopModal } from './context/ShopModalContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Corporate from './pages/Corporate';

function ShopNowModal({ onClose, preselected = '' }: { onClose: () => void; preselected?: string }) {
  const [state, handleSubmit] = useForm("mreyzkkk");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-brand-ink/80 backdrop-blur-xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-lg glass-panel p-8 md:p-12 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/30 hover:text-brand-gold transition-colors duration-300"
          >
            <X size={20} />
          </button>

          {state.succeeded ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <p className="text-4xl mb-4">🕯️</p>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-gold mb-4">Inquiry Sent</h3>
              <p className="text-white/60 font-light">Thank you for your interest. We will get back to you within 24 hours with our available collections.</p>
            </motion.div>
          ) : (
            <>
              <span className="text-xs uppercase tracking-[0.4em] text-brand-gold font-medium mb-4 block">Shop Inquiry</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Request a Collection</h2>
              <p className="text-white/40 text-sm font-light mb-10">Tell us what you're looking for and we'll curate the perfect selection for you.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                  <input type="text" name="name" required placeholder="Your Name" className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light text-sm" />
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs mt-1" />
                </div>
                <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                  <input type="email" name="email" required placeholder="Your Email" className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light text-sm" />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs mt-1" />
                </div>
                <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                  <input type="tel" name="phone" placeholder="Your Phone / WhatsApp Number" className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light text-sm" />
                </div>
                <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                  <select name="interest" defaultValue={preselected} className="w-full bg-transparent px-0 py-3 focus:outline-none text-white/60 font-light text-sm appearance-none cursor-pointer">
                    <option value="" className="bg-brand-ink">What are you looking for?</option>
                    <option value="Floating Flora" className="bg-brand-ink">Floating Flora</option>
                    <option value="Signature Petal Diyos" className="bg-brand-ink">Signature Petal Diyos</option>
                    <option value="Corporate Gifting" className="bg-brand-ink">Corporate Gifting</option>
                    <option value="Festive Bundles" className="bg-brand-ink">Festive Bundles</option>
                    <option value="Custom Order" className="bg-brand-ink">Custom Order</option>
                  </select>
                </div>
                <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                  <textarea name="message" placeholder="Any additional details (quantity, occasion, etc.)" rows={2} className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light text-sm resize-none" />
                </div>
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn-primary w-full py-4 text-xs uppercase tracking-widest mt-2 disabled:opacity-50"
                >
                  {state.submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Navbar() {
  const location = useLocation();
  const { openShop } = useShopModal();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'Our Story' },
    { to: '/corporate', label: 'Corporate' },
  ];

  return (
    <>
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 md:py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
            <img src="/images/logo_transparent.png" alt="Laliguras Logo" className="h-9 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
            <span className="text-2xl md:text-3xl font-serif tracking-widest text-brand-gold hidden sm:block pt-1">LALIGURAS</span>
          </Link>

          <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.2em] font-medium">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`relative overflow-hidden group pb-1 transition-colors ${location.pathname === to ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}>
                <span className="relative z-10">{label}</span>
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold transform origin-left transition-transform duration-300 ${location.pathname === to ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => openShop()}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 border border-brand-gold/30 text-brand-gold rounded-full font-medium transition-all duration-300 hover:bg-brand-gold hover:text-brand-ink active:scale-95 text-xs uppercase tracking-[0.1em]"
            >
              Shop Now
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col justify-center items-end w-8 h-8 gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-[6px]' : 'w-4'}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-white/5 bg-brand-ink/95 backdrop-blur-xl"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className={`text-sm uppercase tracking-[0.3em] font-medium transition-colors ${location.pathname === to ? 'text-brand-gold' : 'text-white/70'}`}>
                    {label}
                  </Link>
                ))}
                <button
                  onClick={() => { setMenuOpen(false); openShop(); }}
                  className="mt-2 w-full py-3 border border-brand-gold/40 text-brand-gold rounded-full text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-ink transition-all duration-300"
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-white/5 pt-16 md:pt-24 pb-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16 md:mb-24">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <img src="/images/logo_transparent.png" alt="Laliguras Logo" className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
              <h2 className="text-3xl font-serif text-brand-gold tracking-widest uppercase pt-1">Laliguras</h2>
            </div>
            <p className="text-white/50 leading-relaxed mb-8 font-light text-sm">
              Premium handcrafted candles and traditional Nepalese terracotta diyos. Supporting community empowerment through artisanal excellence.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/laligurashclothing/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/LaligurashClothing" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-8 font-medium">Explore</h4>
            <ul className="space-y-4 text-white/70 text-sm font-light">
              <li><Link to="/" className="hover:text-brand-gold transition-colors duration-300">Home</Link></li>
              <li><Link to="/about" className="hover:text-brand-gold transition-colors duration-300">Our Story</Link></li>
              <li><Link to="/corporate" className="hover:text-brand-gold transition-colors duration-300">Corporate & Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-8 font-medium">Support</h4>
            <div className="text-white/50 text-sm font-light leading-relaxed">
              <p className="mb-4">For inquiries regarding wholesale orders, shipping, or care instructions, please reach out to us directly.</p>
              <p>We are always happy to assist you.</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-8 font-medium">Contact</h4>
            <ul className="space-y-4 text-white/70 text-sm font-light">
              <li className="flex items-start gap-4 group cursor-pointer">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-white/30 group-hover:text-brand-gold transition-colors" />
                <span className="group-hover:text-white transition-colors">Imadol, Laliguras Clothings & Collection</span>
              </li>
              <li>
                <a href="tel:+9779851312671" className="flex items-center gap-4 group cursor-pointer">
                  <Phone size={16} className="flex-shrink-0 text-white/30 group-hover:text-brand-gold transition-colors" />
                  <span className="group-hover:text-white transition-colors">+977 9851312671</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/9779851312671" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                  <MessageCircle size={16} className="flex-shrink-0 text-white/30 group-hover:text-brand-gold transition-colors" />
                  <span className="group-hover:text-white transition-colors">WhatsApp: +977 9851312671</span>
                </a>
              </li>
              <li>
                <a href="mailto:shresthaconsolidated@gmail.com" className="flex items-center gap-4 group cursor-pointer">
                  <Mail size={16} className="flex-shrink-0 text-white/30 group-hover:text-brand-gold transition-colors" />
                  <span className="group-hover:text-white transition-colors">shresthaconsolidated@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-white/30 uppercase tracking-widest">
          <p>© 2024 Laliguras. All rights reserved.</p>
          <p>Handcrafted with heart in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
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

  return (
    <ShopModalProvider onOpen={openShop}>
      <Router>
        <ScrollToTop />
        {shopOpen && <ShopNowModal preselected={preselected} onClose={() => setShopOpen(false)} />}
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/corporate" element={<Corporate />} />
                {/* Fallback to home for now */}
                <Route path="*" element={<Home />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </ShopModalProvider>
  );
}
