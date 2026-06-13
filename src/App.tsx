import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ITServices from './components/ITServices';
import CanvaIntegration from './components/CanvaIntegration';
import PrintingConfigurator from './components/PrintingConfigurator';
import DigitalMarketing from './components/DigitalMarketing';
import AboutUs from './components/AboutUs';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { ITIllustration, PrintIllustration, MarketingIllustration, ScribbleUnderline, HanddrawnArrow, ScribbleStar, ScribbleCircle } from './components/NotionIllustrations';

import { ArrowRight, Sparkles, CheckSquare, Layers, Newspaper, Shield, FileText, Send, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [globalName, setGlobalName] = useState('');
  const [globalEmail, setGlobalEmail] = useState('');
  const [globalSent, setGlobalSent] = useState(false);
  
  // Custom interactive tab for branding
  const [brandingSubTab, setBrandingSubTab] = useState<'logo' | 'print'>('print');

  // Hero interactive visual switcher states
  const [heroVisual, setHeroVisual] = useState<'sculpture' | 'sketch'>('sketch');
  const [activeSketch, setActiveSketch] = useState<'it' | 'print' | 'marketing'>('it');

  // Multi-section tracking active ID on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'it-services', 'branding-printing', 'digital-marketing', 'about-us', 'testimonials', 'contact'];
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

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleGlobalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalName.trim() || !globalEmail.trim()) return;
    setGlobalSent(true);
    setTimeout(() => {
      setGlobalSent(false);
      setIsConsultOpen(false);
      setGlobalName('');
      setGlobalEmail('');
    }, 2200);
  };

  return (
    <div className="bg-bg text-charcoal min-h-screen font-sans antialiased selection:bg-primary/20 selection:text-primary">
      
      {/* Dynamic Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultForm={() => setIsConsultOpen(true)}
      />

      {/* HERO SECTION */}
      <header
        id="hero"
        className="pt-32 pb-20 sm:pb-28 bg-bg relative overflow-hidden"
      >
        {/* Ambient brand color glows (Primary) matching new identity */}
        <div className="absolute top-12 right-12 w-80 h-80 rounded-full bg-primary/10 blur-[90px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-primary/5 blur-[120px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content - STAGGERED MOTION ENTRANCES */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.1
                  }
                }
              }}
              className="lg:col-span-7 space-y-8 text-left"
            >
              
              {/* Hand-sketched tag indicator */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-charcoal/10 rounded-full shadow-sm select-none"
              >
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-sans font-bold text-xs text-charcoal/60 uppercase tracking-widest select-none">
                  Project Preview
                </span>
              </motion.div>

              {/* Display Header */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="space-y-6 relative"
              >
                <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-extrabold text-charcoal leading-none tracking-tight">
                  <span className="relative inline-block">
                    everything tech.
                    <div className="absolute left-0 bottom-2 w-full h-4 bg-primary/30 -z-10 rounded-full" />
                  </span>
                </h1>
                
                <p className="font-sans text-xl sm:text-2xl text-charcoal/70 leading-relaxed max-w-2xl font-medium">
                  Cuva Tech is your full-service crew for IT solutions, 
                  branding & printing, and digital marketing — so 
                  growing businesses get one calm partner instead of 
                  five vendors.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <motion.button
                  id="hero-primary-cta"
                  onClick={() => handleNavigate('contact')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-5 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 cursor-pointer transition-all flex items-center space-x-2"
                >
                  <span>Start a project</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  id="hero-secondary-cta"
                  onClick={() => handleNavigate('it-services')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-charcoal border border-charcoal/10 px-8 py-5 text-lg font-bold rounded-2xl shadow-sm cursor-pointer transition-all hover:bg-bg"
                >
                  See what we do
                </motion.button>
              </motion.div>

              {/* Stats like in image */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.6 } }
                }}
                className="flex items-center space-x-12 pt-10"
              >
                <div>
                  <div className="text-3xl font-extrabold text-charcoal">120+</div>
                  <div className="text-sm text-charcoal/50 font-medium">projects shipped</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-charcoal">98%</div>
                  <div className="text-sm text-charcoal/50 font-medium">clients who stay</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-charcoal">24/7</div>
                  <div className="text-sm text-charcoal/50 font-medium">real human support</div>
                </div>
              </motion.div>

              {/* "that's us!" text with emoji */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.8 } }
                }}
                className="pt-8"
              >
                <span className="font-hand text-3xl text-primary font-bold italic rotate-[-5deg] inline-block">
                  that's us! 👋
                </span>
              </motion.div>

            </motion.div>

            {/* Hero Right Content: INTERACTIVE media switcher (Notion sketches vs 3D) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-5 flex justify-center w-full"
            >
              <div className="relative w-full max-w-md">
                
                {/* Decorative absolute backing card */}
                <div className="absolute inset-0 bg-primary/5 rounded-3xl translate-x-3 translate-y-3 -z-10" />

                {/* Main Image Frame (OOT Box style) */}
                <div className="bg-white border border-charcoal/5 rounded-3xl overflow-hidden shadow-xl relative p-4">
                  
                  {/* Top Switcher Tabs */}
                  <div className="flex border-b border-charcoal/5 pb-3 mb-4 text-[10px] font-bold justify-between items-center">
                    <span className="text-charcoal/30 uppercase tracking-widest">Visual_Deck // Dublin_D2</span>
                    
                    <div className="flex bg-bg rounded-lg p-1 space-x-1">
                      <button
                        type="button"
                        onClick={() => setHeroVisual('sketch')}
                        className={`px-3 py-1.5 rounded-md text-[10px] transition-all cursor-pointer ${
                          heroVisual === 'sketch' ? 'bg-charcoal text-white font-bold shadow-sm' : 'text-charcoal/40 hover:bg-white'
                        }`}
                      >
                        🖋️ Sketch
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroVisual('sculpture')}
                        className={`px-3 py-1.5 rounded-md text-[10px] transition-all cursor-pointer ${
                          heroVisual === 'sculpture' ? 'bg-charcoal text-white font-bold shadow-sm' : 'text-charcoal/40 hover:bg-white'
                        }`}
                      >
                        🏺 3D
                      </button>
                    </div>
                  </div>

                  <div className="bg-bg/50 border border-charcoal/5 p-4 rounded-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[310px]">
                    
                    {/* Media content switcher */}
                    <AnimatePresence mode="wait">
                      {heroVisual === 'sketch' ? (
                        <motion.div
                          key="sketches"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex flex-col items-center justify-center"
                        >
                          <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto">
                            {activeSketch === 'it' && <ITIllustration className="w-full h-auto" />}
                            {activeSketch === 'print' && <PrintIllustration className="w-full h-auto" />}
                            {activeSketch === 'marketing' && <MarketingIllustration className="w-full h-auto" />}
                          </div>

                          {/* Interactive sketch selective control pills */}
                          <div className="flex flex-wrap justify-center gap-2 mt-6 pt-5 border-t border-charcoal/5 w-full select-none">
                            <button
                              type="button"
                              onClick={() => setActiveSketch('it')}
                              className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                activeSketch === 'it'
                                  ? 'bg-primary text-white'
                                  : 'bg-white hover:bg-primary/5 text-charcoal/50 border border-charcoal/5'
                              }`}
                            >
                              💻 Systems
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSketch('print')}
                              className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                activeSketch === 'print'
                                  ? 'bg-primary text-white'
                                  : 'bg-white hover:bg-primary/5 text-charcoal/50 border border-charcoal/5'
                              }`}
                            >
                              📔 Material
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSketch('marketing')}
                              className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                activeSketch === 'marketing'
                                  ? 'bg-primary text-white'
                                  : 'bg-white hover:bg-primary/5 text-charcoal/50 border border-charcoal/5'
                              }`}
                            >
                              🔍 Semantic
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sculpture"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex items-center justify-center p-1"
                        >
                          <img
                            src="/src/assets/images/cuva_hero_3d_1781188111481.jpg"
                            alt="Artisanal Tech Concept Sculpture"
                            className="w-full h-auto object-cover rounded-xl shadow-inner"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                  <div className="mt-4 px-1 pb-1 flex items-center justify-between text-[10px] font-bold text-charcoal/30 select-none">
                    <span className="tracking-widest">PROJECT_CODE: Dublin_D2</span>
                    <span className="font-hand text-primary text-sm italic">“Organic proportions”</span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </header>

      {/* CORE THREE-SERVICES OVERVIEW GRID - ANIMATED */}
      <section className="py-24 bg-white/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="font-sans text-xs font-bold text-charcoal/30 uppercase tracking-[0.2em] block mb-3">Core Ecosystem</span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal">
              Three Unified Creative Practices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Card 1: IT Solutions */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white border border-charcoal/5 p-8 rounded-[2rem] shadow-xl shadow-charcoal/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">[ SYSTEMS ]</span>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-4">IT Solutions</h3>
                <p className="font-sans text-base text-charcoal/50 leading-relaxed mb-8">
                  Onsite servers migrated seamlessly to AWS & GCP cloud meshes, configured with multi-region backup structures.
                </p>
              </div>
              <button
                onClick={() => handleNavigate('it-services')}
                className="text-sm font-bold text-primary hover:text-primary/80 text-left flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <span>Examine services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 2: Branding & Printing */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white border border-charcoal/5 p-8 rounded-[2rem] shadow-xl shadow-charcoal/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">[ MATERIAL ]</span>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-4">Branding & Print</h3>
                <p className="font-sans text-base text-charcoal/50 leading-relaxed mb-8">
                  Canva project connections, customized logo creation, and bespoke hand-screened garment and notebooks.
                </p>
              </div>
              <button
                onClick={() => handleNavigate('branding-printing')}
                className="text-sm font-bold text-primary hover:text-primary/80 text-left flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <span>Launch configurator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 3: Digital Marketing */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white border border-charcoal/5 p-8 rounded-[2rem] shadow-xl shadow-charcoal/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">[ GROWTH ]</span>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-4">Digital Marketing</h3>
                <p className="font-sans text-base text-charcoal/50 leading-relaxed mb-8">
                  On-page SEO diagnostics, semantic keyword maps, Meta & Google Ad sandbox campaigns focused on CPA.
                </p>
              </div>
              <button
                onClick={() => handleNavigate('digital-marketing')}
                className="text-sm font-bold text-primary hover:text-primary/80 text-left flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <span>Study marketing tab</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* IT SOLUTIONS MODULAR PORTFOLIO */}
      <ITServices />

      {/* BRANDING & PRINTING SECTION */}
      <section id="branding-printing" className="py-24 bg-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-sans text-xs font-bold text-primary tracking-widest uppercase block mb-3">
              02 / Material Layer
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-charcoal leading-tight mb-6">
              Branding, Logos & Print
            </h2>
            <p className="font-sans text-lg text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
              We design lasting brandmarks and print them on premium, eco-friendly assets. Choose between linking 
              your Canva projects directly or using our custom product configurators.
            </p>
          </div>

          {/* Sub Tab Switcher: Canva vs Configurator */}
          <div className="flex bg-white/50 border border-charcoal/5 max-w-sm mx-auto rounded-2xl p-1.5 text-xs sm:text-sm font-bold mb-16 shadow-sm">
            <button
              id="subtab-print"
              onClick={() => setBrandingSubTab('print')}
              className={`flex-1 py-3.5 rounded-xl transition-all cursor-pointer ${
                brandingSubTab === 'print' ? 'bg-charcoal text-white shadow-lg' : 'text-charcoal/40 hover:bg-white'
              }`}
            >
              Configurator
            </button>
            <button
              id="subtab-logo"
              onClick={() => setBrandingSubTab('logo')}
              className={`flex-1 py-3.5 rounded-xl transition-all cursor-pointer ${
                brandingSubTab === 'logo' ? 'bg-charcoal text-white shadow-lg' : 'text-charcoal/40 hover:bg-white'
              }`}
            >
              Logos & Canva
            </button>
          </div>

          {/* Sub Tab Workspace Canvas */}
          <div id="branding-workspace-canvas">
            {brandingSubTab === 'logo' ? (
              <div className="animate-fade-in-down">
                <CanvaIntegration />
              </div>
            ) : (
              <div className="animate-fade-in-down">
                <PrintingConfigurator />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* DIGITAL MARKETING CORE SEC */}
      <DigitalMarketing />

      {/* ABOUT US story, mission, crew blocks */}
      <AboutUs />

      {/* TESTIMONIALS catalog and TrustpilotScoreboard */}
      <Testimonials />

      {/* CONTACT FORM & custom coordinate maps */}
      <ContactForm />

      {/* STANDARD SITE FOOTER */}
      <Footer onNavigate={handleNavigate} />

      {/* GLOBAL CONSULTATION BOOKING MODAL */}
      {isConsultOpen && (
        <div id="global-modal-overlay" className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            id="global-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
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
                    Thank you. We have blocked space in Efe and Sarah’s schedule. We will reach out shortly.
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
                  <select className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none">
                    <option>IT Cloud Systems & Migrations</option>
                    <option>Fine Stationery & Booklets print</option>
                    <option>Handdrawn Logo Design Guidelines</option>
                    <option>CPA Marketing & SEO growth checks</option>
                  </select>
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

    </div>
  );
}
