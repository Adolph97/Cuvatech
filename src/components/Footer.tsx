import { ArrowUp, ArrowRight, CheckCircle2, Instagram, Linkedin } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSiteInfo } from '../SiteInfoStore';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);
  const { siteInfo } = useSiteInfo();

  const xUrl = siteInfo.socials.x || 'https://x.com/cuva.tech';
  const tiktokUrl = siteInfo.socials.tiktok || 'https://www.tiktok.com/@cuva.tech';
  const instagramUrl = siteInfo.socials.instagram || 'https://www.instagram.com/cuva.tech?igsh=MTJnbmM5Mm03Y2Fx';
  const linkedinUrl = siteInfo.socials.linkedin || 'https://www.linkedin.com/company/cuva-tech/';

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubbed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      id="cuva-footer" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="bg-primary/5 border-t border-charcoal/5 py-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-20 pb-20 border-b border-charcoal/5">
          
          {/* Column 1: Brand details */}
          <motion.div variants={fadeInUp} className="md:col-span-5 space-y-8">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center space-x-4 text-left focus:outline-none group cursor-pointer"
            >
              <div className="bg-white p-2.5 border border-charcoal/5 rounded-[1.25rem] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl flex items-center justify-center w-14 h-14">
                <svg className="w-8 h-8 text-black transition-colors" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <mask id="footer-logo-cutout">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <rect x="28" y="24" width="14" height="52" rx="7" fill="black" />
                      <rect x="35" y="38" width="65" height="24" fill="black" />
                    </mask>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="currentColor" mask="url(#footer-logo-cutout)" />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-display text-2xl font-extrabold text-charcoal leading-none tracking-tight">
                  cuva tech.
                </span>
              </div>
            </button>

            <p className="font-sans text-base text-charcoal/50 leading-relaxed max-w-sm">
            We use technology to improve performance and productivity making sure there is alignment in the business goals and technology requirements for every business
            </p>

            {/* Social links wired to site info with fallbacks */}
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest font-sans">Connect:</span>
              <motion.a whileHover={{ y: -5 }} href={xUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="X">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href={tiktokUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href={instagramUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="Instagram">
                <Instagram className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors" />
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href={linkedinUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="LinkedIn">
                <Linkedin className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors" />
              </motion.a>
            </div>

            {/*<span className="font-hand text-2xl text-primary font-bold opacity-80 rotate-[-2deg] inline-block">
              “Hand-bound in Dublin 2.”
            </span>*/}
          </motion.div>

          {/* Column 2: Navigation Links */}
          <motion.div variants={fadeInUp} className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <span className="font-sans text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.3em] block">Sections</span>
              <ul className="space-y-4 text-sm font-bold text-charcoal/60">
                <li><button onClick={() => onNavigate('hero')} className="hover:text-primary transition-colors block cursor-pointer">Homepage</button></li>
                <li><button onClick={() => onNavigate('it-services')} className="hover:text-primary transition-colors block cursor-pointer">IT Cloud Systems</button></li>
                <li><button onClick={() => onNavigate('branding-printing')} className="hover:text-primary transition-colors block cursor-pointer">Printing Configs</button></li>
                <li><button onClick={() => onNavigate('digital-marketing')} className="hover:text-primary transition-colors block cursor-pointer">Digital Marketing</button></li>
              </ul>
            </div>

            <div className="space-y-6">
              <span className="font-sans text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.3em] block">Company</span>
              <ul className="space-y-4 text-sm font-bold text-charcoal/60">
                <li><button onClick={() => onNavigate('about-us')} className="hover:text-primary transition-colors block cursor-pointer">Our Story</button></li>
                <li><button onClick={() => onNavigate('testimonials')} className="hover:text-primary transition-colors block cursor-pointer">Client Reviews</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-primary transition-colors block cursor-pointer">Contact Studio</button></li>
                <li><button onClick={() => window.location.href = '/admin'} className="hover:text-primary transition-colors block cursor-pointer">Admin Portal</button></li>
              </ul>
            </div>
          </motion.div>

          {/* Column 3: Newsletter Form */}
          <motion.div variants={fadeInUp} className="md:col-span-3 space-y-8">
            <div>
              <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-[0.3em] block mb-3">
                STUDIO DISPATCH
              </span>
              <h5 className="font-display text-xl font-extrabold text-charcoal leading-tight">
                Subscribe to local brand logs
              </h5>
              <p className="font-sans text-sm text-charcoal/50 mt-2 leading-relaxed">
                Thoughtful paragraphs about server configurations, print inks, and layout theories.
              </p>
            </div>

            {newsletterSubbed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-5 rounded-[1.5rem] flex items-center space-x-3 text-emerald-800 text-xs font-bold shadow-sm"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Subscription recorded!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 p-2 bg-white rounded-full shadow-xl shadow-charcoal/5 border border-charcoal/5">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="jane@scribe.co"
                  className="bg-transparent px-5 py-2.5 text-xs focus:outline-none flex-1 font-bold text-charcoal placeholder:text-charcoal/20"
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="bg-primary text-white p-3 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

        </div>

        {/* Bottom footer credit & Scroll to top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-[10px] font-bold text-charcoal/20 font-sans uppercase tracking-[0.2em]">
          <div className="space-y-3 text-center md:text-left">
            <span className="block">© 2026 Cuva Tech.</span>
          </div>

          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="px-8 py-4 bg-white border border-charcoal/5 hover:bg-bg rounded-full shadow-xl shadow-charcoal/5 hover:shadow-2xl hover:shadow-charcoal/10 active:scale-95 transition-all text-charcoal flex items-center space-x-3 font-bold cursor-pointer group"
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 text-primary group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </motion.footer>
  );
}
