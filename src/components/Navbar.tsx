import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenConsultForm: () => void;
}

export default function Navbar({ activeSection, onNavigate, onOpenConsultForm }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'it-services', label: 'IT Services' },
    { id: 'branding-printing', label: 'Branding & Printing' },
    { id: 'digital-marketing', label: 'Marketing' },
    { id: 'about-us', label: 'Our Story' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Say Hello' }
  ];

  return (
    <nav
      id="cuva-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-cream/95 backdrop-blur-md py-3 border-b-2 border-charcoal shadow-sm' 
          : 'bg-cream py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo Brand with CUSTOM mask cutout "C" */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('hero')}
            className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-sand p-2 border-2 border-charcoal rounded-md sketch-shadow-sm transition-transform duration-200 group-hover:-translate-y-[1px] group-hover:-translate-x-[1px] group-hover:shadow-[3px_3px_0px_0px_rgba(30,27,24,1)] flex items-center justify-center w-9 h-9"
            >
              {/* Artisanal genuine custom circular Cut-out logo mark - completely vector transparent via Mask */}
              <svg className="w-5 h-5 text-charcoal" viewBox="0 0 100 100" fill="none">
                <defs>
                  <mask id="nav-logo-cutout">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="28" y="24" width="14" height="52" rx="7" fill="black" />
                    <rect x="35" y="38" width="65" height="24" fill="black" />
                  </mask>
                </defs>
                <circle cx="50" cy="50" r="48" fill="currentColor" mask="url(#nav-logo-cutout)" />
              </svg>
            </motion.div>
            <div className="flex flex-col items-start translate-y-[-1px]">
              <span className="font-serif text-2xl font-black leading-none tracking-tight text-charcoal -mb-1">
                CUVA TECH
              </span>
              <span className="font-hand font-bold text-xs tracking-wide text-clay/80 select-none">
                it & brand synthesis
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  id={`nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-2 py-1 text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-clay font-bold'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-clay rounded-full" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <motion.button
              id="nav-consult-cta"
              onClick={onOpenConsultForm}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-moss hover:bg-moss/90 text-cream px-4 py-2 text-sm font-bold border-2 border-charcoal sketch-shadow hover:shadow-[5px_5px_0px_0px_rgba(30,27,24,1)] active:translate-x-0 active:translate-y-0 cursor-pointer transition-all flex items-center space-x-2"
            >
              <span>Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <motion.button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              className="p-2 border-2 border-charcoal rounded bg-beige hover:bg-sand transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5 text-charcoal" /> : <Menu className="w-5 h-5 text-charcoal" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id="mobile-nav-drawer" 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t-2 border-charcoal bg-beige mt-2 py-4 px-4 overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  id={`mobile-nav-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-base font-bold border border-transparent rounded transition-all cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-sand text-clay border-charcoal/10 pl-5'
                      : 'text-charcoal hover:bg-sand/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <motion.button
                id="mobile-nav-cta"
                onClick={() => {
                  onOpenConsultForm();
                  setIsOpen(false);
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-moss text-cream w-full py-3 text-center text-sm font-bold border-2 border-charcoal rounded sketch-shadow mt-3 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Request Free Consultation</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
