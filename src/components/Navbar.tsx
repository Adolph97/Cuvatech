import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ChevronDown, Server, Shirt, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../ContentStore';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenConsultForm: () => void;
}

// Shared logo component for consistency
export function CuvaLogo({ className = '' }: { className?: string }) {
  return (
    <div className="flex items-center space-x-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`bg-black p-2 border border-charcoal/5 rounded-xl shadow-sm transition-transform duration-200 flex items-center justify-center w-10 h-10 ${className}`}
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
        <span className="font-display text-xl sm:text-2xl font-extrabold leading-none tracking-tight text-charcoal">
          cuva tech.
        </span>
      </div>
    </div>
  );
}

const serviceLinks = [
  { id: 'it-services', label: 'IT Services', path: '/it-services', icon: Server, desc: 'Cloud, networks & support' },
  { id: 'branding-and-printing', label: 'Branding & Printing', path: '/branding-and-printing', icon: Shirt, desc: 'Logos, print & design' },
  { id: 'digital-marketing', label: 'Digital Marketing', path: '/digital-marketing', icon: Megaphone, desc: 'SEO, Ads & growth' },
];

const flatNavItems = [
  { id: 'hero', label: 'Home', path: '/' },
  { id: 'about-us', label: 'About Us', path: '/about' },
  { id: 'blog', label: 'Journal', path: '/blog' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export default function Navbar({ activeSection, onNavigate, onOpenConsultForm }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { content } = useContent();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({ path }, '', path);
    setIsOpen(false);
    setServicesOpen(false);
  };

  const isServiceActive = serviceLinks.some(
    s => typeof window !== 'undefined' && window.location.pathname === s.path
  );

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

          {/* Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('hero')}
            className="flex items-center space-x-3 group focus:outline-none cursor-pointer"
          >
            <div className="bg-black p-2 border border-charcoal/5 rounded-xl shadow-sm transition-transform duration-200 flex items-center justify-center w-10 h-10">
              <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="none">
                <defs>
                  <mask id="nav-logo-cutout-main">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="28" y="24" width="14" height="52" rx="7" fill="black" />
                    <rect x="35" y="38" width="65" height="24" fill="black" />
                  </mask>
                </defs>
                <circle cx="50" cy="50" r="48" fill="currentColor" mask="url(#nav-logo-cutout-main)" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-display text-xl sm:text-2xl font-extrabold leading-none tracking-tight text-charcoal">
                cuva tech.
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">

            {/* Home */}
            {flatNavItems.slice(0, 1).map((item) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => navigate(item.path)}
                  className={`relative px-1 py-1 text-sm font-bold transition-all duration-150 cursor-pointer ${
                    isActive ? 'text-primary' : 'text-charcoal/50 hover:text-charcoal'
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

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-services-toggle"
                onClick={() => setServicesOpen(o => !o)}
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                className={`relative flex items-center gap-1.5 px-1 py-1 text-sm font-bold transition-all duration-150 cursor-pointer ${
                  isServiceActive || servicesOpen ? 'text-primary' : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Services
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                />
                {isServiceActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full"
                  />
                )}
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    id="services-menu"
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-charcoal/8 rounded-2xl shadow-xl shadow-charcoal/10 overflow-hidden"
                  >
                    {serviceLinks.map((s, i) => {
                      const Icon = s.icon;
                      const isActive = typeof window !== 'undefined' && window.location.pathname === s.path;
                      return (
                        <button
                          key={s.id}
                          id={`nav-service-${s.id}`}
                          onClick={() => navigate(s.path)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer group ${
                            isActive ? 'bg-primary/5' : 'hover:bg-bg'
                          } ${i < serviceLinks.length - 1 ? 'border-b border-charcoal/5' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-primary/15' : 'bg-charcoal/5 group-hover:bg-primary/10'
                          } transition-colors`}>
                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-charcoal/50 group-hover:text-primary'} transition-colors`} />
                          </div>
                          <div>
                            <div className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-charcoal'}`}>{s.label}</div>
                            <div className="text-[11px] text-charcoal/40 font-medium">{s.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remaining flat nav items */}
            {flatNavItems.slice(1).map((item) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => navigate(item.path)}
                  className={`relative px-1 py-1 text-sm font-bold transition-all duration-150 cursor-pointer ${
                    isActive ? 'text-primary' : 'text-charcoal/50 hover:text-charcoal'
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

      {/* Mobile Drawer */}
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
            <div className="flex flex-col space-y-1">

              {/* Home */}
              <button
                id="mobile-nav-home"
                onClick={() => navigate('/')}
                className={`text-left px-3 py-2.5 text-base font-bold border border-transparent rounded-xl transition-all cursor-pointer ${
                  window.location.pathname === '/' ? 'bg-sand text-clay border-charcoal/10' : 'text-charcoal hover:bg-sand/50'
                }`}
              >
                Home
              </button>

              {/* Services accordion */}
              <div>
                <button
                  id="mobile-services-toggle"
                  onClick={() => setMobileServicesOpen(o => !o)}
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-menu"
                  className={`w-full text-left px-3 py-2.5 text-base font-bold border border-transparent rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    isServiceActive ? 'bg-sand text-clay border-charcoal/10' : 'text-charcoal hover:bg-sand/50'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      id="mobile-services-menu"
                      className="overflow-hidden"
                    >
                      <div className="ml-3 mt-1 space-y-1 border-l-2 border-charcoal/10 pl-3">
                        {serviceLinks.map(s => {
                          const Icon = s.icon;
                          const isActive = window.location.pathname === s.path;
                          return (
                            <button
                              key={s.id}
                              id={`mobile-nav-${s.id}`}
                              onClick={() => navigate(s.path)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                                isActive ? 'bg-sand text-clay' : 'text-charcoal/70 hover:bg-sand/50'
                              }`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rest of flat nav */}
              {flatNavItems.slice(1).map((item) => (
                <button
                  id={`mobile-nav-${item.id}`}
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`text-left px-3 py-2.5 text-base font-bold border border-transparent rounded-xl transition-all cursor-pointer ${
                    window.location.pathname === item.path ? 'bg-sand text-clay border-charcoal/10' : 'text-charcoal hover:bg-sand/50'
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
                className="bg-charcoal text-white w-full py-3 text-center text-sm font-bold rounded-2xl sketch-shadow mt-3 flex items-center justify-center space-x-2 cursor-pointer border border-charcoal/5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Request Free Consultation</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
