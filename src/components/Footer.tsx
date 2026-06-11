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
    <footer id="cuva-footer" className="bg-beige/40 border-t-2 border-charcoal py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-16 pb-12 border-b border-charcoal/15">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-4 space-y-4">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center space-x-2 text-left focus:outline-none group cursor-pointer"
            >
              <div className="bg-sand p-2 border-2 border-charcoal rounded-md sketch-shadow-sm transition-transform duration-200 group-hover:-translate-y-[1px] group-hover:-translate-x-[1px] group-hover:shadow-[3px_3px_0px_0px_rgba(30,27,24,1)] flex items-center justify-center w-9 h-9">
                {/* Artisanal genuine custom circular Cut-out logo mark - completely vector transparent via Mask */}
                <svg className="w-5 h-5 text-charcoal" viewBox="0 0 100 100" fill="none">
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
                <span className="font-serif text-xl font-black text-charcoal leading-none tracking-tight">
                  CUVA TECH
                </span>
                <span className="font-mono text-[9px] text-clay font-bold tracking-widest mt-0.5 uppercase">
                  Dublin Studio
                </span>
              </div>
            </button>

            <p className="font-sans text-xs sm:text-sm text-charcoal/60 leading-relaxed max-w-sm">
              Artisanal systems and beautiful typography under one roof. We design and coordinate digital frameworks, 
              branded paper prints, and search growth campaigns for high-intent niches.
            </p>

            <span className="font-hand font-bold text-clay block text-sm">
              “Hand-bound in Temple Bar, Dublin 2.”
            </span>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xxs font-bold text-charcoal/40 uppercase tracking-widest block">Sections</span>
              <ul className="space-y-1.5 text-xs font-semibold text-charcoal/80">
                <li><button onClick={() => onNavigate('hero')} className="hover:text-clay transition-colors block">Our Homepage</button></li>
                <li><button onClick={() => onNavigate('it-services')} className="hover:text-clay transition-colors block">IT Cloud Systems</button></li>
                <li><button onClick={() => onNavigate('branding-printing')} className="hover:text-clay transition-colors block">Printing Configs</button></li>
                <li><button onClick={() => onNavigate('digital-marketing')} className="hover:text-clay transition-colors block">Digital Marketing</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xxs font-bold text-charcoal/40 uppercase tracking-widest block">Company</span>
              <ul className="space-y-1.5 text-xs font-semibold text-charcoal/80">
                <li><button onClick={() => onNavigate('about-us')} className="hover:text-clay transition-colors block">Our Creative Story</button></li>
                <li><button onClick={() => onNavigate('testimonials')} className="hover:text-clay transition-colors block">Client Reviews</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-clay transition-colors block">Contact Studio</button></li>
                <li><a href="https://trustpilot.com" target="_blank" rel="noreferrer" className="hover:text-clay transition-colors block">Trustpilot Portal</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter Form */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <span className="font-mono text-xxs font-bold text-charcoal/40 uppercase tracking-widest block mb-1">
                STUDIO DISPATCH //
              </span>
              <h5 className="font-serif text-lg font-bold text-charcoal">
                Subscribe to local brand logs
              </h5>
              <p className="font-sans text-xxs text-charcoal/50 mt-0.5">
                Thoughtful paragraphs about server configurations, print inks, and layout theories. No spam.
              </p>
            </div>

            {newsletterSubbed ? (
              <div id="newsletter-success" className="bg-[#eef5ed] border border-charcoal/10 p-3 rounded-lg flex items-center space-x-2 text-emerald-900 text-xs font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Subscription recorded! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="jane@scribe.co"
                  className="bg-cream border-2 border-charcoal px-3 py-2 text-xs rounded focus:outline-none focus:bg-white flex-1"
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="bg-charcoal text-cream px-3 py-2 text-xs font-bold border-2 border-charcoal rounded hover:bg-clay hover:text-white hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom footer credit & Scroll to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs font-semibold text-charcoal/40 font-sans">
          <div className="space-y-1 text-center sm:text-left">
            <span>© 2026 Cuva Tech. Hand-bound in Temple Bar, Dublin 2. All Rights Reserved.</span>
            <span className="block italic text-[10px]">Client specs compiled under active RFC-748 dockets. Powered by Antigravity frameworks.</span>
          </div>

          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="p-2 border-2 border-charcoal hover:bg-beige rounded-md sketch-shadow-sm active:translate-y-0.5 transition-all text-charcoal flex items-center space-x-1"
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </footer>
  );
}
