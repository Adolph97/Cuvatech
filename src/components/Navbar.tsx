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
          ? 'bg-bg/80 backdrop-blur-md py-3 shadow-sm' 
          : 'bg-transparent py-5'
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
              className="bg-black p-2 border border-charcoal/5 rounded-xl shadow-sm transition-transform duration-200 flex items-center justify-center w-10 h-10"
            >
              {/* Artisanal genuine custom circular Cut-out logo mark */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="none">
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
            <div className="flex flex-col items-start">
              <span className="font-display text-2xl font-extrabold leading-none tracking-tight text-charcoal">
                cuva tech.
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  id={`nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-1 py-1 text-sm font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-primary'
                      : 'text-charcoal/50 hover:text-charcoal'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full" 
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-charcoal text-white px-6 py-2.5 text-sm font-bold rounded-full cursor-pointer transition-all flex items-center space-x-2"
            >
              <span>Get started</span>
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
