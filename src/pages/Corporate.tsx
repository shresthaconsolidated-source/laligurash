import React from 'react';
import { motion } from 'motion/react';
import { Gift, Calendar, Briefcase, CheckCircle2 } from 'lucide-react'; // Retained Briefcase as it's used, and CheckCircle2. No explicit instruction to remove them or add Building2/Users.
import { useForm, ValidationError } from '@formspree/react';

export default function Corporate() {
  const [state, handleSubmit] = useForm("mreyzkkk");

  return (
    <div className="pt-24 bg-brand-ink selection:bg-brand-gold/20 selection:text-brand-gold">
      {/* B2B Hero */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.4em] font-medium text-brand-gold mb-6 block"
          >
            B2B & Events
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl mb-10 font-light text-white leading-[1.1]"
          >
            Artisanal Scale for <br /><span className="italic text-gradient">Exceptional Occasions.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/50 max-w-3xl mx-auto font-light mb-16 leading-relaxed"
          >
            Whether it's a grand wedding in Kathmandu or corporate gifting for Dashain, Laliguras provides handcrafted elegance at scale.
          </motion.p>
          <div className="aspect-[21/9] rounded-[2rem] overflow-hidden mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
            <img
              src="/images/cg.png"
              alt="Corporate Gifting Collection"
              className="w-full h-full object-cover grayscale-[10%]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-ink/30"></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-brand-surface relative border-t border-white/5 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-12 hover:-translate-y-2">
              <Gift className="text-brand-gold mb-8 w-10 h-10" />
              <h3 className="text-3xl mb-4 text-white font-serif">Corporate Gifting</h3>
              <p className="text-white/50 leading-relaxed mb-8 font-light">
                Elevate your corporate identity with customized gift hampers. Perfect for Dashain, Tihar, or employee appreciation milestones.
              </p>
              <ul className="space-y-4 text-sm text-white/70 font-light">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Custom Branding Options</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Premium Packaging</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Tiered Bulk Pricing</li>
              </ul>
            </div>

            <div className="glass-panel p-12 hover:-translate-y-2">
              <Calendar className="text-brand-gold mb-8 w-10 h-10" />
              <h3 className="text-3xl mb-4 text-white font-serif">Weddings & Events</h3>
              <p className="text-white/50 leading-relaxed mb-8 font-light">
                Create an unforgettable atmosphere with our Floating Flora or provide guests with a piece of heritage as a 'Koseli' (return gift).
              </p>
              <ul className="space-y-4 text-sm text-white/70 font-light">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Event Decor Consultation</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Personalized Tags</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Reliable Delivery Timelines</li>
              </ul>
            </div>

            <div className="glass-panel p-12 hover:-translate-y-2">
              <Briefcase className="text-brand-gold mb-8 w-10 h-10" />
              <h3 className="text-3xl mb-4 text-white font-serif">Hospitality & Spas</h3>
              <p className="text-white/50 leading-relaxed mb-8 font-light">
                Partner with us to provide your guests with a sensory experience that reflects the warmth and beauty of Nepal.
              </p>
              <ul className="space-y-4 text-sm text-white/70 font-light">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Signature Scent Development</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Monthly Subscription Supply</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-gold flex-shrink-0" /> Boutique Retail Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase (4-Image Bento Grid) */}
      <section className="section-padding bg-brand-surface pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.4em] font-medium text-brand-gold mb-4 block">The Experience</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Artisanal Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 aspect-square rounded-[2rem] overflow-hidden bg-brand-ink relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
              <img src="/images/1.png" alt="Detail 1" className="w-full h-full object-cover opacity-80 hover:scale-105 hover:opacity-100 transition-all duration-700" />
            </div>
            <div className="md:col-span-8 aspect-[2/1] rounded-[2rem] overflow-hidden bg-brand-ink relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
              <img src="/images/cg.png" alt="Detail 2" className="w-full h-full object-cover opacity-80 hover:scale-105 hover:opacity-100 transition-all duration-700" />
            </div>
            <div className="md:col-span-8 aspect-[2/1] rounded-[2rem] overflow-hidden bg-brand-ink relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
              <img src="/images/3.png" alt="Detail 3" className="w-full h-full object-cover opacity-80 hover:scale-105 hover:opacity-100 transition-all duration-700" />
            </div>
            <div className="md:col-span-4 aspect-square rounded-[2rem] overflow-hidden bg-brand-ink relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
              <img src="/images/fb.png" alt="Detail 4" className="w-full h-full object-cover opacity-80 hover:scale-105 hover:opacity-100 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form / CTA */}
      <section className="section-padding overflow-hidden relative border-t border-white/5">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto glass-panel overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10">
          <div className="p-12 md:p-20 flex-1 relative">
            <h2 className="text-4xl md:text-6xl mb-6 font-serif text-white">Let's collaborate.</h2>
            <p className="text-white/50 mb-12 text-lg font-light max-w-lg">
              Tell us about your event or gifting needs, and our team will get back to you with a tailored proposal within 24 hours.
            </p>
            {state.succeeded ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-10 text-center border-brand-gold/30"
              >
                <h3 className="text-3xl font-serif text-brand-gold mb-4">Inquiry Sent</h3>
                <p className="text-white/70 font-light">Thank you for reaching out. Our events team will review your requirements and contact you within 24 hours.</p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                    <input type="text" name="name" required placeholder="Name" className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light" />
                    <ValidationError prefix="Name" field="name" errors={state.errors} />
                  </div>
                  <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                    <input type="email" name="email" required placeholder="Email" className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light" />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </div>
                </div>
                <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                  <input type="text" name="company" placeholder="Company / Event Name" className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light" />
                </div>
                <div className="relative border-b border-white/20 focus-within:border-brand-gold transition-colors duration-300">
                  <textarea name="details" required placeholder="Tell us about your requirements" rows={3} className="w-full bg-transparent px-0 py-3 focus:outline-none text-white placeholder-white/30 font-light resize-none"></textarea>
                  <ValidationError prefix="Details" field="details" errors={state.errors} />
                </div>
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn-primary w-full py-5 text-sm uppercase tracking-widest mt-4 disabled:opacity-50"
                >
                  {state.submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
          <div className="hidden md:block w-[40%] bg-brand-surface relative border-l border-white/5">
            <img
              src="/images/1.png"
              alt="Artisanal Detail"
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 to-transparent"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
