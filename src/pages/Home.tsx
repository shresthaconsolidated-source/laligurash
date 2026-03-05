import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="overflow-hidden bg-brand-ink selection:bg-brand-gold/20 selection:text-brand-gold">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            src="/videos/hero_bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30 scale-105 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-brand-ink/40 to-brand-ink" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-ink to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="inline-block mb-6 text-xs uppercase tracking-[0.4em] font-medium text-brand-gold">
              Handcrafted in Nepal
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light mb-8 leading-[0.9] text-white">
              <span className="block text-brand-cream text-gradient">Illuminating</span>
              <span className="italic font-light">Heritage</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Premium terracotta diyos and floating flora, born from the heart of community craftsmanship and ancient Nepalese traditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/collections" className="btn-primary" aria-label="Explore the Collection">
                Explore the Collection
              </Link>
              <Link to="/about" className="group flex items-center gap-3 text-xs uppercase tracking-widest text-white/70 hover:text-brand-gold transition-colors duration-300">
                <span>Our Story</span>
                <span className="w-8 h-[1px] bg-white/30 group-hover:bg-brand-gold transition-colors duration-300"></span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-padding bg-brand-ink relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-10 md:p-14 text-center group">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 bg-brand-ink group-hover:border-brand-gold/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500">
                <Sparkles className="text-brand-gold w-6 h-6" />
              </div>
              <h3 className="text-2xl mb-4 text-brand-cream font-medium tracking-wide">Artisan-Led</h3>
              <p className="text-white/50 leading-relaxed font-light text-sm">
                Every piece is hand-poured by our women community, ensuring unique character in every flame.
              </p>
            </div>
            <div className="glass-panel p-10 md:p-14 text-center group translate-y-0 md:-translate-y-8">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 bg-brand-ink group-hover:border-brand-gold/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500">
                <Globe className="text-brand-gold w-6 h-6" />
              </div>
              <h3 className="text-2xl mb-4 text-brand-cream font-medium tracking-wide">Culturally Rooted</h3>
              <p className="text-white/50 leading-relaxed font-light text-sm">
                We blend traditional Nepalese terracotta with modern wax artistry to create a timeless aesthetic for the contemporary home.
              </p>
            </div>
            <div className="glass-panel p-10 md:p-14 text-center group">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 bg-brand-ink group-hover:border-brand-gold/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500">
                <Heart className="text-brand-gold w-6 h-6" />
              </div>
              <h3 className="text-2xl mb-4 text-brand-cream font-medium tracking-wide">Sustainable Impact</h3>
              <p className="text-white/50 leading-relaxed font-light text-sm">
                Your purchase directly supports our women community and local micro-enterprise growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-padding bg-brand-surface relative rounded-t-[3rem] border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-medium block mb-4">The Collections</span>
              <h2 className="text-5xl md:text-6xl text-brand-cream leading-tight">Curated for Ambience</h2>
            </div>
            <Link to="/collections" className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-brand-gold transition-colors duration-300">
              <span className="w-12 h-[1px] bg-white/20 group-hover:bg-brand-gold transition-colors duration-300"></span>
              <span>View All</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Item 1 - Top Left Large */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-brand-ink">
                <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img src="/images/4.png" alt="Signature Petal Diyos" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent z-10 opacity-90" />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-3xl text-brand-cream mb-2">Signature Petal Diyos</h3>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold font-medium">Explore <ChevronRight size={14} /></span>
                </div>
              </div>
            </motion.div>

            {/* Item 2 - Top Right Small */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 group cursor-pointer"
            >
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-[2rem] bg-brand-ink">
                <div className="absolute inset-0 bg-brand-ink/30 group-hover:bg-brand-ink/10 transition-colors duration-500 z-10" />
                <img src="/images/cg.png" alt="Corporate Gifting" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent z-10 opacity-90" />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-2xl text-brand-cream mb-2">Corporate Gifting</h3>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold font-medium">Explore <ChevronRight size={14} /></span>
                </div>
              </div>
            </motion.div>

            {/* Item 3 - Bottom Left Small */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 group cursor-pointer"
            >
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-[2rem] bg-brand-ink">
                <div className="absolute inset-0 bg-brand-ink/30 group-hover:bg-brand-ink/10 transition-colors duration-500 z-10" />
                <img src="/images/2.png" alt="Floating Flora" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent z-10 opacity-90" />
                <div className="absolute bottom-8 left-8 z-20 pr-6">
                  <h3 className="text-2xl text-brand-cream mb-2">Floating Flora</h3>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold font-medium">Explore <ChevronRight size={14} /></span>
                </div>
              </div>
            </motion.div>

            {/* Item 4 - Bottom Right Large */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-brand-ink">
                <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img src="/images/fb.png" alt="Festive Bundles" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent z-10 opacity-90" />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-3xl text-brand-cream mb-2">Festive Bundles</h3>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold font-medium">Explore <ChevronRight size={14} /></span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="relative py-32 px-6 overflow-hidden bg-brand-ink border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-brand-ink to-brand-ink opacity-60"></div>
        <div className="absolute inset-0 bg-[url('/images/5.png')] opacity-[0.03] mix-blend-screen bg-cover bg-center"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Sparkles className="w-8 h-8 text-brand-gold mx-auto mb-8 opacity-50" />
          <h2 className="text-5xl md:text-7xl mb-8 font-serif leading-tight text-white">
            Bring the warmth of <br className="hidden md:block" /> Laliguras home.
          </h2>
          <p className="text-white/50 text-lg mb-14 font-light max-w-xl mx-auto leading-relaxed">
            Join our inner circle for exclusive access to seasonal collections, artisan stories, and festive gifting inspiration.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              window.location.href = `mailto:shresthaconsolidated@gmail.com?subject=Newsletter Subscription&body=Please add ${email} to your mailing list.`;
            }}
            className="flex flex-col sm:flex-row gap-0 sm:gap-4 max-w-md mx-auto items-end"
          >
            <div className="flex-1 w-full border-b border-white/20 pb-2 transition-all duration-300 focus-within:border-brand-gold relative group">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full bg-transparent text-white px-2 py-3 focus:outline-none placeholder-white/30 text-center sm:text-left font-light tracking-wide text-sm"
              />
            </div>
            <button type="submit" className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold hover:text-white transition-colors duration-300 mt-6 sm:mt-0 py-3 px-4 flex-shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}} />
    </div>
  );
}
