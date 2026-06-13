import { ArrowUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

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
    <footer id="cuva-footer" className="bg-primary/5 border-t border-charcoal/5 py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16 pb-16 border-b border-charcoal/5">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-5 space-y-6">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="bg-white p-2 border border-charcoal/5 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md flex items-center justify-center w-11 h-11">
                <svg className="w-6 h-6 text-charcoal group-hover:text-primary transition-colors" viewBox="0 0 100 100" fill="none">
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
                <span className="font-display text-xl font-bold text-charcoal leading-none tracking-tight">
                  CUVA TECH
                </span>
                <span className="font-mono text-[10px] text-primary font-bold tracking-widest mt-1.5 uppercase">
                  Dublin Studio
                </span>
              </div>
            </button>

            <p className="font-sans text-sm text-charcoal/50 leading-relaxed max-w-sm">
              Artisanal systems and beautiful typography under one roof. We design and coordinate digital frameworks, 
              branded paper prints, and search growth campaigns for high-intent niches.
            </p>

            <span className="font-hand font-bold text-primary block text-base opacity-80">
              “Hand-bound in Temple Bar, Dublin 2.”
            </span>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <span className="font-mono text-[10px] font-bold text-charcoal/30 uppercase tracking-widest block">Sections</span>
              <ul className="space-y-3 text-sm font-bold text-charcoal/70">
                <li><button onClick={() => onNavigate('hero')} className="hover:text-primary transition-colors block cursor-pointer">Our Homepage</button></li>
                <li><button onClick={() => onNavigate('it-services')} className="hover:text-primary transition-colors block cursor-pointer">IT Cloud Systems</button></li>
                <li><button onClick={() => onNavigate('branding-printing')} className="hover:text-primary transition-colors block cursor-pointer">Printing Configs</button></li>
                <li><button onClick={() => onNavigate('digital-marketing')} className="hover:text-primary transition-colors block cursor-pointer">Digital Marketing</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-[10px] font-bold text-charcoal/30 uppercase tracking-widest block">Company</span>
              <ul className="space-y-3 text-sm font-bold text-charcoal/70">
                <li><button onClick={() => onNavigate('about-us')} className="hover:text-primary transition-colors block cursor-pointer">Our Creative Story</button></li>
                <li><button onClick={() => onNavigate('testimonials')} className="hover:text-primary transition-colors block cursor-pointer">Client Reviews</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-primary transition-colors block cursor-pointer">Contact Studio</button></li>
                <li><a href="https://trustpilot.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors block">Trustpilot Portal</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter Form */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <span className="font-mono text-[10px] font-bold text-charcoal/30 uppercase tracking-widest block mb-1.5">
                STUDIO DISPATCH //
              </span>
              <h5 className="font-display text-lg font-bold text-charcoal">
                Subscribe to local brand logs
              </h5>
              <p className="font-sans text-xs text-charcoal/50 mt-1 leading-relaxed">
                Thoughtful paragraphs about server configurations, print inks, and layout theories.
              </p>
            </div>

            {newsletterSubbed ? (
              <div id="newsletter-success" className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-bold animate-scale-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Subscription recorded! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 p-1.5 bg-white rounded-full shadow-sm border border-charcoal/5">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="jane@scribe.co"
                  className="bg-transparent px-4 py-2 text-xs focus:outline-none flex-1 font-medium"
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="bg-charcoal text-white p-2.5 rounded-full hover:bg-primary transition-all flex items-center justify-center shrink-0 shadow-md"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom footer credit & Scroll to top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-bold text-charcoal/30 font-sans uppercase tracking-widest">
          <div className="space-y-2 text-center md:text-left">
            <span>© 2026 Cuva Tech. Hand-bound in Temple Bar, Dublin 2.</span>
            <span className="block italic text-primary/40 font-medium">Powered by Antigravity frameworks. Compiled under RFC-748 dockets.</span>
          </div>

          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="px-5 py-3 bg-white border border-charcoal/5 hover:bg-bg rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all text-charcoal flex items-center space-x-2 font-bold cursor-pointer"
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 text-primary" />
          </button>
        </div>

      </div>
    </footer>
  );
}
