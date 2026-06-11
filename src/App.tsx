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
    <div className="bg-cream text-charcoal min-h-screen font-sans antialiased selection:bg-sand selection:text-clay">
      
      {/* Dynamic Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultForm={() => setIsConsultOpen(true)}
      />

      {/* HERO SECTION */}
      <header
        id="hero"
        className="pt-32 pb-20 sm:pb-28 bg-cream border-b-2 border-charcoal relative overflow-hidden"
      >
        {/* Subtle grid pattern backing */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1b18_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none" />

        {/* Ambient brand color glows (Clay, Moss, Sand) matching artisanal identity */}
        <div className="absolute top-12 right-12 w-80 h-80 rounded-full bg-sand/25 blur-[90px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-clay/5 blur-[120px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-moss/5 blur-[100px] mix-blend-multiply pointer-events-none -z-10" />

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
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-beige border border-charcoal rounded-md rotate-[-1deg] shadow-sm select-none"
              >
                <Sparkles className="w-4 h-4 text-clay animate-pulse" />
                <span className="font-hand font-extrabold text-sm text-clay select-none">
                  Unifying Silicon & Ink: Artisanal Tech Agency
                </span>
              </motion.div>

              {/* Display Header */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="space-y-4 relative"
              >
                {/* Float stars around heading */}
                <div className="absolute top-[-30px] left-[-15px] text-moss opacity-80 anim-float pointer-events-none">
                  <ScribbleStar className="w-8 h-8" />
                </div>
                <div className="absolute top-[-10px] right-[10%] text-terracotta opacity-70 anim-float-delayed pointer-events-none">
                  <ScribbleStar className="w-6 h-6 transform rotate-45" />
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-black text-charcoal leading-none tracking-tight">
                  High-End Tech <br />
                  <span className="relative inline-block px-1">
                    <span className="text-clay italic font-normal font-serif relative z-10">Synthesised</span>
                    <ScribbleUnderline className="absolute left-0 bottom-[-6px] w-full text-clay h-3 opacity-95" />
                  </span> for Creative Mindsets.
                </h1>
                
                <p className="font-sans text-lg sm:text-xl text-charcoal/80 leading-relaxed max-w-2xl">
                  We build modern cloud environments, custom-printed paper structures, and semantic search campaigns. 
                  A deeply personal, warm touch engineered cleanly from raw paper layout drafts.
                </p>
              </motion.div>

              {/* Action Buttons with offset shadows */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <motion.button
                  id="hero-primary-cta"
                  onClick={() => handleNavigate('branding-printing')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-clay hover:bg-clay/90 text-cream px-6 py-4 text-base font-bold rounded-lg border-2 border-charcoal sketch-shadow hover:shadow-[6px_6px_0px_0px_rgba(30,27,24,1)] cursor-pointer transition-all flex items-center space-x-2"
                >
                  <span>Build Print Order</span>
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </motion.button>
                
                <motion.button
                  id="hero-secondary-cta"
                  onClick={() => handleNavigate('it-services')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-cream hover:bg-[#eae8e0] text-charcoal px-6 py-4 text-base font-bold rounded-lg border-2 border-charcoal sketch-shadow-sm cursor-pointer transition-all hover:shadow-[4px_4px_0px_0px_rgba(30,27,24,1)]"
                >
                  Explore IT Pillars
                </motion.button>
              </motion.div>

              {/* Tiny hand annotation with pointer arrow */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } }
                }}
                className="flex items-center space-x-2 text-clay/80 font-hand text-base font-bold select-none pt-1 relative pr-12 sm:pr-0"
              >
                <span className="animate-pulse text-lg">✍️</span>
                <span>"No AI automation templates here. We hand-sketch every corporate model coordinates!"</span>

                {/* Notion Style hand-drawn arrow pointer to interactive card switcher */}
                <div className="absolute right-[-20px] lg:right-[-65px] top-[-25px] hidden lg:block text-moss anim-float pointer-events-none">
                  <HanddrawnArrow className="w-14 h-14 transform rotate-[25deg] scale-x-[-1]" />
                  <span className="font-hand font-bold text-sm text-moss absolute top-[-14px] right-[-30px] rotate-[10deg] tracking-wide whitespace-nowrap">
                    Interactive Sketches!
                  </span>
                </div>
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
                <div className="absolute inset-0 bg-sand border-2 border-charcoal rounded-xl translate-x-3 translate-y-3 -z-10" />

                {/* Main Image Frame (OOT Box style) */}
                <div className="bg-cream border-2 border-charcoal rounded-xl overflow-hidden shadow-sm relative p-3">
                  
                  {/* Top Switcher Tabs */}
                  <div className="flex border-b border-charcoal/10 pb-2.5 mb-3 text-xxs font-mono font-bold justify-between items-center">
                    <span className="text-charcoal/50">VISUAL_DECK // Dublin_D2</span>
                    
                    <div className="flex bg-beige border border-charcoal/20 rounded p-0.5 space-x-1">
                      <button
                        type="button"
                        onClick={() => setHeroVisual('sketch')}
                        className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                          heroVisual === 'sketch' ? 'bg-charcoal text-cream font-bold' : 'text-charcoal/60 hover:bg-sand'
                        }`}
                      >
                        🖋️ Sketch View
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroVisual('sculpture')}
                        className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                          heroVisual === 'sculpture' ? 'bg-charcoal text-cream font-bold' : 'text-charcoal/60 hover:bg-sand'
                        }`}
                      >
                        🏺 3D Sculpture
                      </button>
                    </div>
                  </div>

                  <div className="bg-beige/40 border border-charcoal/25 p-3 rounded-md relative flex flex-col items-center justify-center overflow-hidden min-h-[310px]">
                    
                    {/* Media content switcher */}
                    <AnimatePresence mode="wait">
                      {heroVisual === 'sketch' ? (
                        <motion.div
                          key="sketches"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="w-full flex flex-col items-center justify-center"
                        >
                          <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto">
                            {activeSketch === 'it' && <ITIllustration className="w-full h-auto" />}
                            {activeSketch === 'print' && <PrintIllustration className="w-full h-auto" />}
                            {activeSketch === 'marketing' && <MarketingIllustration className="w-full h-auto" />}
                          </div>

                          {/* Interactive sketch selective control pills */}
                          <div className="flex flex-wrap justify-center gap-1 mt-4 pt-3.5 border-t border-charcoal/10 w-full select-none">
                            <button
                              type="button"
                              onClick={() => setActiveSketch('it')}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                activeSketch === 'it'
                                  ? 'bg-clay text-cream border-charcoal'
                                  : 'bg-sand/30 hover:bg-sand text-charcoal/70 border-charcoal/15'
                              }`}
                            >
                              💻 Systems
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSketch('print')}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                activeSketch === 'print'
                                  ? 'bg-clay text-cream border-charcoal'
                                  : 'bg-sand/30 hover:bg-sand text-charcoal/70 border-charcoal/15'
                              }`}
                            >
                              📔 Material
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSketch('marketing')}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                activeSketch === 'marketing'
                                  ? 'bg-clay text-cream border-charcoal'
                                  : 'bg-sand/30 hover:bg-sand text-charcoal/70 border-charcoal/15'
                              }`}
                            >
                              🔍 Semantic
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sculpture"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                          className="w-full flex items-center justify-center p-1"
                        >
                          <img
                            src="/src/assets/images/cuva_hero_3d_1781188111481.jpg"
                            alt="Artisanal Tech Concept Sculpture"
                            className="w-full h-auto object-cover rounded shadow-inner"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                  <div className="mt-3 px-1 pb-1 flex items-center justify-between text-xxs font-semibold text-charcoal/50 select-none">
                    <span className="font-mono">PROJECT_CODE: Dublin_D2</span>
                    <span className="font-hand text-clay font-bold text-xs">“Organic proportions”</span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </header>

      {/* CORE THREE-SERVICES OVERVIEW GRID - ANIMATED */}
      <section className="py-20 bg-beige border-b-2 border-charcoal relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-mono text-xs font-bold text-charcoal/40 uppercase tracking-widest block">Core Ecosystem Configs</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-charcoal mt-1">
              Three Unified Creative Practices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: IT Solutions */}
            <motion.div 
              whileHover={{ y: -6, boxShadow: '8px 8px 0px 0px rgba(30,27,24,1)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="bg-cream border-2 border-charcoal p-7 rounded-xl sketch-shadow transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-xxs font-bold text-moss uppercase tracking-wider block mb-2">[ LAYER_01 - SYSTEMS ]</span>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">IT Solutions</h3>
                <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-6">
                  Onsite servers migrated seamlessly to AWS & GCP cloud meshes, configured with multi-region backup structures.
                </p>
              </div>
              <button
                onClick={() => handleNavigate('it-services')}
                className="text-xs font-bold text-clay hover:underline text-left flex items-center space-x-1 cursor-pointer"
              >
                <span>Examine cloud services</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>

            {/* Card 2: Branding & Printing */}
            <motion.div 
              whileHover={{ y: -6, boxShadow: '8px 8px 0px 0px rgba(30,27,24,1)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="bg-cream border-2 border-charcoal p-7 rounded-xl sketch-shadow transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-xxs font-bold text-clay uppercase tracking-wider block mb-2">[ LAYER_02 - MATERIAL ]</span>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">Branding & Fine Print</h3>
                <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-6">
                  Canva project connections, customized logo creation, and bespoke hand-screened garment and notebooks.
                </p>
              </div>
              <button
                onClick={() => handleNavigate('branding-printing')}
                className="text-xs font-bold text-clay hover:underline text-left flex items-center space-x-1 cursor-pointer"
              >
                <span>Launch paper configurator</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>

            {/* Card 3: Digital Marketing */}
            <motion.div 
              whileHover={{ y: -6, boxShadow: '8px 8px 0px 0px rgba(30,27,24,1)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="bg-cream border-2 border-charcoal p-7 rounded-xl sketch-shadow transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-xxs font-bold text-terracotta uppercase tracking-wider block mb-2">[ LAYER_03 - GROWTH ]</span>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">Digital Marketing</h3>
                <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-6">
                  On-page SEO diagnostics, semantic keyword maps, Meta & Google Ad sandbox campaigns focused on CPA.
                </p>
              </div>
              <button
                onClick={() => handleNavigate('digital-marketing')}
                className="text-xs font-bold text-clay hover:underline text-left flex items-center space-x-1 cursor-pointer"
              >
                <span>Study SEO & marketing tab</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* IT SOLUTIONS MODULAR PORTFOLIO */}
      <ITServices />

      {/* BRANDING & PRINTING SECTION */}
      <section id="branding-printing" className="py-20 bg-cream border-b-2 border-charcoal relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="font-hand font-bold text-lg text-clay tracking-wider uppercase block mb-1">
              02 / Material Layer
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-charcoal leading-tight mb-4">
              Branding, Logos & Print
            </h2>
            <div className="w-24 h-1 bg-charcoal mx-auto mb-6 rounded-full" />
            <p className="font-sans text-lg text-charcoal/80 leading-relaxed">
              We design lasting brandmarks and print them on premium, eco-friendly assets. Choose between linking 
              your Canva projects directly or using our custom product configurators.
            </p>
          </div>

          {/* Sub Tab Switcher: Canva vs Configurator */}
          <div className="flex border-2 border-charcoal max-w-sm mx-auto rounded overflow-hidden text-xs sm:text-sm font-bold bg-beige mb-12">
            <button
              id="subtab-print"
              onClick={() => setBrandingSubTab('print')}
              className={`flex-1 py-3 text-center transition-all ${
                brandingSubTab === 'print' ? 'bg-charcoal text-cream' : 'text-charcoal hover:bg-sand'
              }`}
            >
              Printing Configurator
            </button>
            <button
              id="subtab-logo"
              onClick={() => setBrandingSubTab('logo')}
              className={`flex-1 py-3 text-center transition-all ${
                brandingSubTab === 'logo' ? 'bg-charcoal text-cream' : 'text-charcoal hover:bg-sand'
              }`}
            >
              Logos & Canva Connection
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
        <div id="global-modal-overlay" className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            id="global-modal-content"
            className="bg-cream border-2 border-charcoal w-full max-w-md rounded-xl sketch-shadow-lg overflow-hidden animate-scale-in"
          >
            {/* Header */}
            <div className="bg-sand border-b-2 border-charcoal p-5 flex items-center justify-between">
              <div>
                <span className="font-hand font-bold text-sm text-clay">Cuva Consultation Docket</span>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-charcoal leading-none">Schedule Consultation</h3>
              </div>
              <button
                id="close-global-modal"
                onClick={() => setIsConsultOpen(false)}
                className="sketch-border p-2 bg-beige hover:bg-sand text-charcoal rounded hover:scale-105 active:scale-95 transition-all font-mono font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {globalSent ? (
              <div id="global-success-state" className="p-8 text-center space-y-4">
                <div className="inline-block p-3 bg-green-50 border-2 border-charcoal rounded-full text-moss animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-xl font-bold text-charcoal">Session Reserved!</h4>
                <p className="font-sans text-xs text-charcoal/70 leading-normal">
                  Thank you. We have blocked space in Efe and Sarah’s schedule. We will reach out to schedule tea or video link coordinates within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleGlobalSubmit} className="p-6 space-y-4 font-sans">
                
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-charcoal mb-1">Your Name</label>
                  <input
                    id="global-input-name"
                    type="text"
                    required
                    value={globalName}
                    onChange={(e) => setGlobalName(e.target.value)}
                    placeholder="Efe Cuva"
                    className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-charcoal mb-1">Email Address</label>
                  <input
                    id="global-input-email"
                    type="email"
                    required
                    value={globalEmail}
                    onChange={(e) => setGlobalEmail(e.target.value)}
                    placeholder="partner@efe_agency.co"
                    className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-charcoal mb-1 font-bold">Main Service Area of Interest</label>
                  <select className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none">
                    <option>IT Cloud Systems & Migrations</option>
                    <option>Fine Stationery & Booklets print</option>
                    <option>Handdrawn Logo Design Guidelines</option>
                    <option>CPA Marketing & SEO growth checks</option>
                  </select>
                </div>

                <div className="flex items-start pt-1">
                  <input type="checkbox" required defaultChecked className="mt-1 mr-2 p-1 border border-charcoal text-clay" />
                  <span className="text-xxs text-charcoal/60 leading-tight">
                    I agree to the GDPR data rules. My details will remain secure.
                  </span>
                </div>

                <button
                  id="global-submit-consult"
                  type="submit"
                  className="bg-clay hover:bg-clay/90 text-cream w-full py-3 text-xs font-bold rounded border-2 border-charcoal sketch-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center"
                >
                  Send Consultation Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
