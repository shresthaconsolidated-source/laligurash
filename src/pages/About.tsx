import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="bg-brand-ink selection:bg-brand-gold/20 selection:text-brand-gold relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-brand-gold/3 rounded-full blur-[100px]"></div>
      </div>
      {/* Story Hero */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-brand-gold font-medium mb-6 block">Our Roots</span>
            <h1 className="text-4xl sm:text-7xl mb-8 md:mb-12 leading-[1.1] text-white font-light">
              A Community <br /><span className="italic text-gradient">in Bloom.</span>
            </h1>
            <div className="space-y-8 text-lg text-white/50 font-light leading-relaxed">
              <p className="text-white/80 text-xl font-serif italic">
                Laliguras began not as a business, but as a collective dream. Founded on the belief that premium craftsmanship and community empowerment could go hand-in-hand.
              </p>
              <p>
                Our name, inspired by the vibrant national flower of Nepal, represents resilience, beauty, and the warmth of our heritage. We specialize in the art of the 'Diyo'—the traditional oil lamp—reimagined through the lens of modern artisanal candle making.
              </p>
              <p>
                Every Laliguras candle is more than just a source of light; it is a testament to the skilled hands of our women community who pour their heart and heritage into every petal and pot.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
              <video
                src="/videos/candle_story.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover grayscale-[20%] contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-brand-surface border border-white/10 text-brand-cream p-6 md:p-10 rounded-[2rem] w-[85%] md:max-w-sm backdrop-blur-xl shadow-2xl z-20">
              <p className="text-xl md:text-2xl font-serif italic mb-4 text-brand-gold leading-tight">"We don't just make candles; we preserve stories."</p>
              <p className="text-xs uppercase tracking-[0.2em] opacity-50">— Our Artisans</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-brand-surface border-t border-white/5 mt-20 relative overflow-hidden rounded-t-[3rem]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-medium mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl text-white font-light">The Pillars of Laliguras</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 md:p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Empowering Women Community</h3>
              <p className="text-white/50 leading-relaxed font-light">
                We provide sustainable livelihoods and skill-building opportunities for our women community, fostering financial independence and creative pride.
              </p>
            </div>
            <div className="glass-panel p-8 md:p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Preserving Tradition</h3>
              <p className="text-white/50 leading-relaxed font-light">
                By utilizing traditional terracotta pottery from local kilns, we support the ancient craft of Nepalese potters while giving it a modern purpose.
              </p>
            </div>
            <div className="glass-panel p-8 md:p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Artisanal Quality</h3>
              <p className="text-white/50 leading-relaxed font-light">
                We refuse to compromise on quality. From premium scented waxes to the intricate detailing of our wax petals, every product is a masterpiece of slow-craft.
              </p>
            </div>
            <div className="glass-panel p-8 md:p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Community Growth</h3>
              <p className="text-white/50 leading-relaxed font-light">
                As a micro-enterprise, every purchase fuels the sustainable scaling of our group, allowing us to reach more homes and support more families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="section-padding bg-brand-ink">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-medium mb-4 block">The Craft</span>
              <h2 className="text-4xl md:text-6xl text-white mb-8 font-light leading-tight">Handcrafted with <span className="italic text-gradient">Intent.</span></h2>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center flex-shrink-0 text-brand-gold font-serif italic text-xl">1</div>
                  <div>
                    <h4 className="text-xl text-white mb-2">Ethical Sourcing</h4>
                    <p className="text-white/40 leading-relaxed font-light text-sm">We source our terracotta directly from local artisan kilns in the valley, ensuring fair trade at every step.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center flex-shrink-0 text-brand-gold font-serif italic text-xl">2</div>
                  <div>
                    <h4 className="text-xl text-white mb-2">The Molding Process</h4>
                    <p className="text-white/40 leading-relaxed font-light text-sm">Every wax petal is individually hand-molded by our women community, making no two pieces exactly alike.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center flex-shrink-0 text-brand-gold font-serif italic text-xl">3</div>
                  <div>
                    <h4 className="text-xl text-white mb-2">Mindful Panning</h4>
                    <p className="text-white/40 leading-relaxed font-light text-sm">The assembly of our Floating Flora is a meditative process, ensuring balance and beauty in every bowl.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 mt-12">
                <img src="/images/1.png" alt="Craft Process 1" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
              </div>
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/5">
                <img src="/images/3.png" alt="Craft Process 2" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
