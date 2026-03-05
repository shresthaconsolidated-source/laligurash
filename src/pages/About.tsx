import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="pt-24 bg-brand-ink selection:bg-brand-gold/20 selection:text-brand-gold">
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
            <h1 className="text-5xl md:text-7xl mb-12 leading-[1.1] text-white font-light">
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
            <div className="absolute -bottom-10 -left-10 bg-brand-surface border border-white/10 text-brand-cream p-10 rounded-[2rem] hidden md:block max-w-sm backdrop-blur-xl shadow-2xl">
              <p className="text-2xl font-serif italic mb-4 text-brand-gold">"We don't just make candles; we preserve stories."</p>
              <p className="text-xs uppercase tracking-[0.2em] opacity-50">— Our Artisans</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-brand-surface border-t border-white/5 mt-20 relative overflow-hidden rounded-t-[3rem]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-medium mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl text-white font-light">The Pillars of Laliguras</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Empowering Women Community</h3>
              <p className="text-white/50 leading-relaxed font-light">
                We provide sustainable livelihoods and skill-building opportunities for our women community, fostering financial independence and creative pride.
              </p>
            </div>
            <div className="glass-panel p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Preserving Tradition</h3>
              <p className="text-white/50 leading-relaxed font-light">
                By utilizing traditional terracotta pottery from local kilns, we support the ancient craft of Nepalese potters while giving it a modern purpose.
              </p>
            </div>
            <div className="glass-panel p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Artisanal Quality</h3>
              <p className="text-white/50 leading-relaxed font-light">
                We refuse to compromise on quality. From premium scented waxes to the intricate detailing of our wax petals, every product is a masterpiece of slow-craft.
              </p>
            </div>
            <div className="glass-panel p-12">
              <h3 className="text-2xl font-serif mb-4 text-brand-gold tracking-wide">Community Growth</h3>
              <p className="text-white/50 leading-relaxed font-light">
                As a micro-enterprise, every purchase fuels the sustainable scaling of our group, allowing us to reach more homes and support more families.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
