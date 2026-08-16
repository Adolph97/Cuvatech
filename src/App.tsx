import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import PrintingJobsGallery from './components/PrintingJobsGallery';
import ITServices from './components/ITServices';
import CanvaIntegration from './components/CanvaIntegration';
import PrintingConfigurator from './components/PrintingConfigurator';
import DigitalMarketing from './components/DigitalMarketing';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ServiceCheckoutModal from './components/ServiceCheckoutModal';
import { IT_SERVICES, DEFAULT_IT_PRICES } from './data';
import { ITIllustration, PrintIllustration, MarketingIllustration, MasterHeroIllustration, ScribbleUnderline, HanddrawnArrow, ScribbleStar, ScribbleCircle } from './components/NotionIllustrations';

import { ArrowRight, Sparkles, CheckSquare, Layers, Newspaper, Shield, FileText, Send, CheckCircle, Smartphone, X, Server, Shirt, Search, Cpu, Cloud, PenTool, Type, TrendingUp, BarChart, Megaphone, ChevronDown, Globe, Code, HardDrive, Wifi, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';

// Admin System Imports
import { OrderProvider, useOrders } from './OrderStore';
import { SiteInfoProvider } from './SiteInfoStore';
import { ContentProvider, useContent } from './ContentStore';
import AdminDashboard from './components/AdminDashboard';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import BlogPreview from './components/BlogPreview';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function LandingPage() {
  const { addOrder } = useOrders();
  const { content } = useContent();
  const hp = content.homepage || {};
  const [activeSection, setActiveSection] = useState('hero');
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [globalName, setGlobalName] = useState('');
  const [globalEmail, setGlobalEmail] = useState('');
  const [globalSent, setGlobalSent] = useState(false);

  // Custom interactive tab for branding
  const [brandingSubTab, setBrandingSubTab] = useState<'logo' | 'print' | null>(null);

  // Hero interactive visual switcher states
  const [activeSketch, setActiveSketch] = useState<'it' | 'print' | 'marketing'>('it');

  // All Services catalog state
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'it' | 'branding' | 'marketing'>('all');
  const [catalogPrices, setCatalogPrices] = useState<Record<string, number>>({});
  const [catalogStripeKey, setCatalogStripeKey] = useState('');
  const [catalogModalService, setCatalogModalService] = useState<{ id: string; name: string; description: string; price: number; features: string[]; category: string } | null>(null);
  const [catalogExpanded, setCatalogExpanded] = useState(false);

  // Multi-section tracking active ID on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'it-services', 'branding-printing', 'printing-jobs', 'digital-marketing', 'about-us', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 120; // offset navbar height

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch service pricing + Stripe key for catalog checkout
  useEffect(() => {
    fetch('/api/settings/public')
      .then(r => r.json())
      .then(d => {
        if (d.servicePricing) setCatalogPrices(d.servicePricing);
        if (d.stripePublishableKey) setCatalogStripeKey(d.stripePublishableKey);
      })
      .catch(() => {});
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      // Small delay ensures mobile drawer has started closing and layout is stable
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId);
      }, 50);
    }
  };

  // Unified catalog of all services
  const catalogItems = useMemo(() => {
    const itIcons: Record<string, any> = {
      'hardware-software-setup': Wrench,
      'it-infrastructure': Wifi,
      'web-development': Globe,
      'cloud-solutions': Cloud,
      'software-development': Code,
    };
    // Map IT_SERVICES kebab-case IDs to servicePricing camelCase keys
    const itPriceKeys: Record<string, string> = {
      'hardware-software-setup': 'hardwareSoftwareSetup',
      'it-infrastructure': 'itInfrastructure',
      'web-development': 'webDevelopment',
      'cloud-solutions': 'cloudSolutions',
      'software-development': 'softwareDevelopment',
    };
    const itServices = IT_SERVICES.map(s => ({
      id: s.id,
      name: s.title,
      description: s.description,
      price: catalogPrices[itPriceKeys[s.id]] ?? DEFAULT_IT_PRICES[s.id] ?? 0,
      features: s.bullets,
      category: 'it' as const,
      icon: itIcons[s.id] || Server,
    }));

    const brandingServices = [
      {
        id: 'logo-design',
        name: 'Logo Design Service',
        description: 'Professional logo design using Canva with expert creative direction and brand identity.',
        price: catalogPrices.logoDesign ?? 199,
        features: ['Custom logo concepts', 'Unlimited revisions', 'Full brand kit', 'Source files included'],
        category: 'branding' as const,
        icon: PenTool,
      },
    ];

    const marketingServices = [
      {
        id: 'seo-audit',
        name: 'SEO Audit & Strategy',
        description: 'Deep technical SEO audit with keyword mapping and actionable roadmap.',
        price: catalogPrices.seoAudit ?? 299,
        features: ['Full technical SEO crawl', 'Keyword strategy (50 terms)', 'Schema markup recommendations', 'Competitor gap analysis', '30-day roadmap'],
        category: 'marketing' as const,
        icon: Search,
      },
      {
        id: 'ad-campaign',
        name: 'Ad Campaign Setup',
        description: 'Google Search & Meta Social campaign architecture with audience targeting.',
        price: catalogPrices.adCampaign ?? 499,
        features: ['Google & Meta campaign setup', 'Audience targeting & segmentation', 'Ad copy & creative direction', 'Conversion tracking', '30-day performance report'],
        category: 'marketing' as const,
        icon: Megaphone,
      },
      {
        id: 'social-strategy',
        name: 'Social Media Strategy',
        description: 'Custom content calendar and posting strategy across LinkedIn, Instagram & X.',
        price: catalogPrices.socialStrategy ?? 399,
        features: ['30-day content calendar', 'Platform-specific strategy', 'Brand voice guidelines', 'Engagement playbook', 'Monthly performance review'],
        category: 'marketing' as const,
        icon: TrendingUp,
      },
      {
        id: 'analytics-email',
        name: 'Analytics & Email Setup',
        description: 'GA4 implementation, dashboard setup, and email automation architecture.',
        price: catalogPrices.analyticsEmail ?? 349,
        features: ['GA4 & GTM implementation', 'Custom performance dashboard', 'Email drip-campaign architecture', 'A/B testing protocols', 'Monthly reporting template'],
        category: 'marketing' as const,
        icon: BarChart,
      },
    ];

    return [...itServices, ...brandingServices, ...marketingServices];
  }, [catalogPrices]);

  const filteredCatalog = catalogFilter === 'all' ? catalogItems : catalogItems.filter(s => s.category === catalogFilter);

  const handleGlobalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalName.trim() || !globalEmail.trim()) return;

    // Log to Admin Store
    addOrder({
      type: 'Consultation',
      customerName: globalName,
      customerEmail: globalEmail,
      details: { interest: 'General Agency Inquiry' }
    });

    setGlobalSent(true);
    setTimeout(() => {
      setGlobalSent(false);
      setIsConsultOpen(false);
      setGlobalName('');
      setGlobalEmail('');
    }, 2200);
  };

  return (
    <div className="bg-bg text-charcoal min-h-screen font-sans antialiased selection:bg-primary/20 selection:text-primary overflow-x-hidden">

      {/* Dynamic Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultForm={() => setIsConsultOpen(true)}
      />

      {/* HERO SECTION */}
      <header
        id="hero"
        className="pt-28 sm:pt-36 pb-16 sm:pb-24 bg-bg relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 sm:space-y-10"
          >
            {/* Main Header Title & Subtitle */}
            <motion.div variants={fadeInUp} className="space-y-6 max-w-4xl mx-auto">
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-charcoal leading-[1.1] tracking-tight">
                {hp.heroTitle || 'Optimizing Businesses.'}
              </h1>

              <p className="font-sans text-lg sm:text-2xl text-charcoal/70 leading-relaxed max-w-3xl mx-auto font-medium">
                {hp.heroSubtitle || 'Cuva Tech is your full-service crew for IT solutions, branding & printing, and digital marketing. Growing businesses get one calm partner instead of five vendors.'}
              </p>
            </motion.div>

            {/* Call To Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <motion.button
                id="hero-primary-cta"
                onClick={() => handleNavigate('contact')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 cursor-pointer transition-all flex items-center justify-center space-x-2"
              >
                <span>{hp.heroCtaPrimary || 'Start a project'}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                id="hero-secondary-cta"
                onClick={() => handleNavigate('it-services')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-white text-charcoal border border-charcoal/10 px-8 py-4 text-base sm:text-lg font-bold rounded-2xl shadow-sm cursor-pointer transition-all hover:bg-bg"
              >
                {hp.heroCtaSecondary || 'See what we do'}
              </motion.button>
            </motion.div>

            {/* Key Statistics Display */}
            <motion.div
              variants={fadeInUp}
              className="pt-10 sm:pt-14 border-t border-charcoal/5 max-w-3xl mx-auto grid grid-cols-3 gap-4 sm:gap-8 items-center"
            >
              {(hp.stats || [
                { value: '120+', label: 'projects' },
                { value: '98%', label: 'retention' },
                { value: '24/7', label: 'support' }
              ]).map((stat: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-charcoal/40 font-bold uppercase tracking-widest mt-1 sm:mt-2">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* CORE THREE-SERVICES OVERVIEW GRID - ANIMATED */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-10 sm:py-14 bg-white/50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <span className="font-sans text-xs font-bold text-charcoal/30 uppercase tracking-[0.2em] block mb-3">{hp.coreOverview?.eyebrow || 'Core Ecosystem'}</span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal">
              {hp.coreOverview?.title || 'Three Unified Creative Practices'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {(hp.coreOverview?.cards || [
              { title: 'IT Solutions', description: 'Onsite servers migrated seamlessly to AWS & GCP cloud meshes, configured with multi-region backup structures.' },
              { title: 'Branding & Print', description: 'Logo design, Print Shop (T-shirts, Caps, Menus, etc.), and Free Consultations for your brand identity.' },
              { title: 'Digital Marketing', description: 'On-page SEO diagnostics, semantic keyword maps, Meta & Google Ad sandbox campaigns focused on CPA.' }
            ]).map((card: any, i: number) => {
              const targets = ['it-services', 'branding-printing', 'digital-marketing'];
              const icons = [
                <Server className="w-8 h-8 text-primary" />,
                <Shirt className="w-8 h-8 text-primary" />,
                <Megaphone className="w-8 h-8 text-primary" />
              ];
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -12 }}
                  className="bg-white border border-charcoal/5 p-8 rounded-[2.5rem] shadow-xl shadow-charcoal/5 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold text-charcoal mb-4">{card.title}</h3>
                    <p className="font-sans text-base text-charcoal/50 leading-relaxed mb-8">
                      {card.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate(targets[i])}
                    className="text-sm font-bold text-primary hover:text-primary/80 text-left flex items-center space-x-2 cursor-pointer transition-colors"
                  >
                    <span>Explore more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* UNIFIED ALL SERVICES CATALOG */}
      <motion.section
        id="all-services"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-14 sm:py-20 bg-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
            <span className="font-sans text-xs font-bold text-charcoal/30 uppercase tracking-[0.2em] block mb-3">
              Our Services
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal mb-4">
              Everything You Need to Grow
            </h2>
            <p className="font-sans text-base text-charcoal/50 leading-relaxed mb-8">
              From web development to digital marketing — browse all services, see transparent pricing, and book instantly.
            </p>
            <button
              onClick={() => setCatalogExpanded(!catalogExpanded)}
              className="inline-flex items-center space-x-2 bg-charcoal text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-charcoal/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{catalogExpanded ? 'Hide Services' : 'View All Services'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${catalogExpanded ? 'rotate-180' : ''}`} />
            </button>
          </motion.div>

          <AnimatePresence>
            {catalogExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                {/* Filter tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {([['all', 'All Services'], ['it', 'IT Services'], ['branding', 'Branding'], ['marketing', 'Digital Marketing']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setCatalogFilter(key)}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        catalogFilter === key
                          ? 'bg-charcoal text-white shadow-xl shadow-charcoal/20'
                          : 'bg-bg text-charcoal/40 hover:text-charcoal/60 border border-charcoal/5'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Service cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredCatalog.map((service) => {
                      const Icon = service.icon;
                      return (
                        <motion.div
                          key={service.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ y: -8 }}
                          className="bg-bg border border-charcoal/5 rounded-[2rem] p-7 flex flex-col justify-between group transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                service.category === 'it' ? 'bg-blue-50 text-blue-600' :
                                service.category === 'branding' ? 'bg-purple-50 text-purple-600' :
                                'bg-amber-50 text-amber-600'
                              }`}>
                                {service.category === 'it' ? 'IT' : service.category === 'branding' ? 'Branding' : 'Marketing'}
                              </span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-charcoal mb-2">{service.name}</h3>
                            <p className="font-sans text-xs text-charcoal/40 leading-relaxed mb-4 line-clamp-2">{service.description}</p>
                            <ul className="space-y-1.5 mb-6">
                              {service.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-center text-[11px] text-charcoal/50">
                                  <CheckCircle className="w-3 h-3 text-primary mr-2 shrink-0" />
                                  <span>{f}</span>
                                </li>
                              ))}
                              {service.features.length > 3 && (
                                <li className="text-[11px] text-charcoal/30 ml-5">+{service.features.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                            <div>
                              <span className="font-display text-2xl font-extrabold text-charcoal">${service.price}</span>
                            </div>
                            {catalogStripeKey ? (
                              <button
                                onClick={() => setCatalogModalService(service)}
                                className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
                              >
                                Book Now
                              </button>
                            ) : (
                              <button
                                onClick={() => handleNavigate('contact')}
                                className="bg-charcoal/5 text-charcoal/60 px-6 py-3 rounded-xl text-xs font-bold hover:bg-charcoal/10 transition-all cursor-pointer"
                              >
                                Inquire
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Checkout Modal for Catalog */}
      {catalogModalService && (
        <ServiceCheckoutModal
          isOpen={!!catalogModalService}
          onClose={() => setCatalogModalService(null)}
          service={{
            id: catalogModalService.id,
            name: catalogModalService.name,
            description: catalogModalService.description,
            price: catalogModalService.price,
            features: catalogModalService.features,
          }}
          publishableKey={catalogStripeKey}
          serviceType={catalogModalService.category === 'it' ? 'IT' : catalogModalService.category === 'branding' ? 'Branding' : 'Digital Marketing'}
        />
      )}

      {/* IT SOLUTIONS MODULAR PORTFOLIO */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <ITServices />
      </motion.div>

      {/* BRANDING & PRINTING SECTION (CONSOLIDATED WITH PORTFOLIO) */}
      <motion.section
        id="branding-printing"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-10 sm:py-14 bg-bg relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal leading-tight mb-4">
              {hp.brandingSection?.title || 'Branding & Printing Portfolio'}
            </h2>
            <p className="font-sans text-base sm:text-lg text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
              {hp.brandingSection?.subtitle || 'Our full-service print shop, logo studio, and live portfolio showcase of completed brand works.'}
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex bg-white/50 border border-charcoal/5 max-w-md mx-auto rounded-[1.5rem] p-1.5 text-xs sm:text-sm font-bold mb-8 shadow-sm">
            <button
              id="subtab-print"
              onClick={() => setBrandingSubTab(brandingSubTab === 'print' ? null : 'print')}
              className={`flex-1 py-3.5 rounded-xl transition-all cursor-pointer ${
                brandingSubTab === 'print' ? 'bg-charcoal text-white shadow-xl shadow-charcoal/20' : 'text-charcoal/40 hover:bg-white'
              }`}
            >
              Print Configurator
            </button>
            <button
              id="subtab-logo"
              onClick={() => setBrandingSubTab(brandingSubTab === 'logo' ? null : 'logo')}
              className={`flex-1 py-3.5 rounded-xl transition-all cursor-pointer ${
                brandingSubTab === 'logo' ? 'bg-charcoal text-white shadow-xl shadow-charcoal/20' : 'text-charcoal/40 hover:bg-white'
              }`}
            >
              Logos & Graphics
            </button>
          </div>

          {/* Sub Tab Workspace Canvas */}
          <div id="branding-workspace-canvas">
            <AnimatePresence mode="wait">
              {brandingSubTab === 'logo' ? (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                >
                  <CanvaIntegration />
                </motion.div>
              ) : brandingSubTab === 'print' ? (
                <motion.div
                  key="print"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                >
                  <PrintingConfigurator />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Integrated Printing Portfolio Showcase */}
          <div className="mt-10 pt-8 border-t border-charcoal/5">
            <PrintingJobsGallery
              onNavigateToConfigurator={() => {
                setBrandingSubTab('print');
                setTimeout(() => {
                  const el = document.getElementById('branding-workspace-canvas');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
            />
          </div>

        </div>
      </motion.section>

      {/* DIGITAL MARKETING CORE SEC */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <DigitalMarketing />
      </motion.div>

      {/* TESTIMONIALS catalog */}
      <Testimonials />

      {/* RECENT BLOG POSTS — latest 3 with link to the full Journal */}
     {/*<BlogPreview />*/}

      {/* CONTACT FORM & custom coordinate maps */}
    {/* <ContactForm /> */}

      {/* STANDARD SITE FOOTER */}
      <Footer onNavigate={handleNavigate} />

      {/* GLOBAL CONSULTATION BOOKING MODAL */}
      <AnimatePresence>
        {isConsultOpen && (
          <div id="global-modal-overlay" className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              id="global-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-charcoal/20 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-primary/5 p-8 pb-6 flex items-start justify-between">
                <div>
                  <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.2em] block mb-2">Cuva Docket</span>
                  <h3 className="font-display text-3xl font-extrabold text-charcoal leading-tight">Schedule <br />Consultation</h3>
                </div>
                <button
                  id="close-global-modal"
                  onClick={() => setIsConsultOpen(false)}
                  className="w-10 h-10 rounded-full bg-white border border-charcoal/5 flex items-center justify-center hover:bg-bg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-charcoal/40" />
                </button>
              </div>

              {globalSent ? (
                <div id="global-success-state" className="p-12 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full text-primary animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-2xl font-bold text-charcoal">Session Reserved!</h4>
                    <p className="font-sans text-sm text-charcoal/50 leading-relaxed">
                      Thank you. We have blocked space in our schedule. We will reach out shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGlobalSubmit} className="p-8 pt-2 space-y-5 font-sans">

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Your Name</label>
                    <input
                      id="global-input-name"
                      type="text"
                      required
                      value={globalName}
                      onChange={(e) => setGlobalName(e.target.value)}
                      placeholder="Efe Cuva"
                      className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      id="global-input-email"
                      type="email"
                      required
                      value={globalEmail}
                      onChange={(e) => setGlobalEmail(e.target.value)}
                      placeholder="partner@efe_agency.co"
                      className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Interest</label>
                    <div className="relative">
                      <select className="w-full bg-bg border-none px-5 py-4 pr-12 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer">
                        <option>IT Cloud Systems & Migrations</option>
                        <option>Fine Stationery & Booklets print</option>
                        <option>Handdrawn Logo Design Guidelines</option>
                        <option>CPA Marketing & SEO growth checks</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-charcoal/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    id="global-submit-consult"
                    type="submit"
                    className="bg-primary text-white w-full py-5 text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center mt-4"
                  >
                    Send Request
                  </button>

                  <p className="text-[10px] text-charcoal/30 text-center px-4">
                    By submitting, you agree to our data handling protocols. We strictly never sell your information.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);

    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args: any[]) {
      originalPushState.apply(window.history, args as any);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  return (
    <OrderProvider>
      <SiteInfoProvider>
        <ContentProvider>
          {path === '/admin' ? <AdminDashboard /> :
           path === '/blog' ? (
             <PageWrapper activeSection="blog">
               <BlogList />
             </PageWrapper>
           ) :
           path.startsWith('/blog/') ? (
             <PageWrapper activeSection="blog">
               <BlogPost />
             </PageWrapper>
           ) :
           path === '/it-services' ? (
             <PageWrapper activeSection="it-services">
               <ITServices />
             </PageWrapper>
           ) :
           path === '/branding-and-printing' || path === '/branding-and-marketing' ? (
             <PageWrapper activeSection="branding-and-printing">
               <BrandingPrintingPage />
             </PageWrapper>
           ) :
           path === '/digital-marketing' ? (
             <PageWrapper activeSection="digital-marketing">
               <DigitalMarketing />
             </PageWrapper>
           ) :
           path === '/about' ? (
             <PageWrapper activeSection="about-us">
               <AboutUs />
             </PageWrapper>
           ) :
           path === '/contact' ? (
             <PageWrapper activeSection="contact">
               <ContactForm />
             </PageWrapper>
           ) :
           <LandingPage />}
        </ContentProvider>
      </SiteInfoProvider>
    </OrderProvider>
  );
}

function BrandingPrintingPage() {
  const [activeTab, setActiveTab] = useState<'branding' | 'print'>('branding');
  return (
    <div className="py-10 sm:py-14 bg-bg relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal leading-tight mb-4">
            Branding & Printing
          </h1>
          <p className="font-sans text-base sm:text-lg text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
            Logo design, brand identity, and our full-service print shop — all under one roof.
          </p>
        </div>

        <div className="flex bg-white/50 border border-charcoal/5 max-w-md mx-auto rounded-[1.5rem] p-1.5 text-xs sm:text-sm font-bold mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex-1 py-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'branding' ? 'bg-charcoal text-white shadow-xl' : 'text-charcoal/40 hover:bg-white'
            }`}
          >
            Logos & Design
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`flex-1 py-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'print' ? 'bg-charcoal text-white shadow-xl' : 'text-charcoal/40 hover:bg-white'
            }`}
          >
            Print Configurator
          </button>
        </div>

        <div>
          {activeTab === 'branding' && <CanvaIntegration />}
          {activeTab === 'print' && (
            <div className="space-y-10">
              <PrintingConfigurator />
              <PrintingJobsGallery
                onNavigateToConfigurator={() => {
                  setActiveTab('print');
                  setTimeout(() => {
                    const el = document.querySelector('#branding-and-printing .space-y-10 > div:first-child');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageWrapper({ children, activeSection }: { children: React.ReactNode; activeSection: string }) {
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const handleNavigate = (id: string) => {
    const routeMap: Record<string, string> = {
      'hero': '/',
      'it-services': '/it-services',
      'branding-and-printing': '/branding-and-printing',
      'branding-marketing': '/branding-and-printing',
      'branding-printing': '/branding-and-printing',
      'digital-marketing': '/digital-marketing',
      'about-us': '/about',
      'blog': '/blog',
      'contact': '/contact'
    };
    if (routeMap[id]) {
      window.history.pushState({ path: routeMap[id] }, '', routeMap[id]);
    }
  };

  return (
    <div className="bg-bg text-charcoal min-h-screen font-sans antialiased">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultForm={() => setIsConsultOpen(true)}
      />
      <div className="pt-20">
        {children}
      </div>
      <Testimonials />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
