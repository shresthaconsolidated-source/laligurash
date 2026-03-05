import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Facebook, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Corporate from './pages/Corporate';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-300">
          <img src="/images/logo_transparent.png" alt="Laliguras Logo" className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
          <span className="text-3xl font-serif tracking-widest text-brand-gold hidden sm:block pt-1">LALIGURAS</span>
        </Link>

        <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.2em] font-medium">
          <Link to="/" className={`relative overflow-hidden group pb-1 transition-colors ${location.pathname === '/' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}>
            <span className="relative z-10">Home</span>
            <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold transform origin-left transition-transform duration-300 ${location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
          </Link>
          <Link to="/about" className={`relative overflow-hidden group pb-1 transition-colors ${location.pathname === '/about' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}>
            <span className="relative z-10">Our Story</span>
            <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold transform origin-left transition-transform duration-300 ${location.pathname === '/about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
          </Link>
          <Link to="/corporate" className={`relative overflow-hidden group pb-1 transition-colors ${location.pathname === '/corporate' ? 'text-brand-gold' : 'text-white/60 hover:text-white'}`}>
            <span className="relative z-10">Corporate</span>
            <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold transform origin-left transition-transform duration-300 ${location.pathname === '/corporate' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/collections" className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 border border-brand-gold/30 text-brand-gold rounded-full font-medium transition-all duration-300 hover:bg-brand-gold hover:text-brand-ink active:scale-95 text-xs uppercase tracking-[0.1em]">
            Shop Now
          </Link>
          <button className="md:hidden group">
            <div className="w-6 h-[1px] bg-white mb-2 transition-all group-hover:bg-brand-gold"></div>
            <div className="w-6 h-[1px] bg-white transition-all group-hover:bg-brand-gold w-4 ml-auto"></div>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-white/5 pt-24 pb-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
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
  return (
    <Router>
      <ScrollToTop />
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
  );
}
