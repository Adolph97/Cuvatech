import React, { useState, useEffect } from 'react';
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
import { ITIllustration, PrintIllustration, MarketingIllustration, MasterHeroIllustration, ScribbleUnderline, HanddrawnArrow, ScribbleStar, ScribbleCircle } from './components/NotionIllustrations';

import { ArrowRight, Sparkles, CheckSquare, Layers, Newspaper, Shield, FileText, Send, CheckCircle, Smartphone, X, Server, Shirt, Search, Cpu, Cloud, PenTool, Type, TrendingUp, BarChart, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Admin System Imports
import { OrderProvider, useOrders } from './OrderStore';
import AdminDashboard from './components/AdminDashboard';

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
  const [activeSection, setActiveSection] = useState('hero');
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [globalName, setGlobalName] = useState('');
  const [globalEmail, setGlobalEmail] = useState('');
  const [globalSent, setGlobalSent] = useState(false);
  
  // Custom interactive tab for branding
  const [brandingSubTab, setBrandingSubTab] = useState<'logo' | 'print' | null>(null);

  // Hero interactive visual switcher states
  const [activeSketch, setActiveSketch] = useState<'it' | 'print' | 'marketing'>('it');

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
        className="pt-32 pb-20 sm:pb-32 bg-bg relative overflow-hidden"
      >
        {/* Ambient brand color glows (Primary) matching new identity */}
        <div className="absolute top-12 right-12 w-80 h-80 rounded-full bg-primary/10 blur-[90px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-primary/5 blur-[120px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Hero Left Content - STAGGERED MOTION ENTRANCES */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-8 text-left"
            >
              
              {/* Hand-sketched tag indicator */}
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-charcoal/5 rounded-full shadow-sm select-none"
              >
              {/*
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-sans font-bold text-[10px] text-charcoal/40 uppercase tracking-[0.2em] select-none">
                  Project Preview
                </span> */}
              </motion.div>

              {/* Display Header */}
              <motion.div 
                variants={fadeInUp}
                className="space-y-6 relative"
              >
                <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-extrabold text-charcoal leading-[0.9] tracking-tight">
                  <span className="relative inline-block">
                    Optimizing Businesses.
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute left-0 bottom-0 h-4 bg-primary/30 -z-10 rounded-full" 
                    />
                  </span>
                </h1>
                
                <p className="font-sans text-xl sm:text-2xl text-charcoal/60 leading-relaxed max-w-2xl font-medium">
                  Cuva Tech is your full-service crew for IT solutions, 
                  branding & printing, and digital marketing.  
                  Growing businesses get one calm partner instead of 
                  five vendors.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <motion.button
                  id="hero-primary-cta"
                  onClick={() => handleNavigate('contact')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-5 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 cursor-pointer transition-all flex items-center space-x-2"
                >
                  <span>Start a project</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  id="hero-secondary-cta"
                  onClick={() => handleNavigate('it-services')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-charcoal border border-charcoal/5 px-8 py-5 text-lg font-bold rounded-2xl shadow-sm cursor-pointer transition-all hover:bg-bg"
                >
                  See what we do
                </motion.button>
              </motion.div>

              {/* Stats like in image */}
              <motion.div 
                variants={fadeInUp}
                className="flex items-center space-x-12 pt-10"
              >
                <div>
                  <div className="text-4xl font-extrabold text-charcoal">120+</div>
                  <div className="text-xs text-charcoal/30 font-bold uppercase tracking-widest mt-1">projects</div>
                </div>
                <div className="w-px h-10 bg-charcoal/5" />
                <div>
                  <div className="text-4xl font-extrabold text-charcoal">98%</div>
                  <div className="text-xs text-charcoal/30 font-bold uppercase tracking-widest mt-1">retention</div>
                </div>
                <div className="w-px h-10 bg-charcoal/5" />
                <div>
                  <div className="text-4xl font-extrabold text-charcoal">24/7</div>
                  <div className="text-xs text-charcoal/30 font-bold uppercase tracking-widest mt-1">support</div>
                </div>
              </motion.div>

              {/* "that's us!" text with emoji */}
             {/* <motion.div 
                variants={fadeInUp}
                className="pt-8"
              >
                <span className="font-hand text-4xl text-primary font-bold italic rotate-[-5deg] inline-block">
                  that's us! 👋
                </span>
              </motion.div>*/}

            </motion.div>

            {/* Hero Right Content: ORBITAL 3D REVOLVING GRAPHIC */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center w-full relative h-[500px] items-center"
            >
              {/* Background Decorative Glows */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] -z-10" 
              />

              {/* Main Central Illustration */}
              <div className="relative z-10 w-full max-w-[400px] drop-shadow-[0_20px_50px_rgba(229,139,109,0.15)]">
                <MasterHeroIllustration 
                  className="w-full h-auto" 
                  activePillar={activeSketch} 
                />
              </div>

              {/* Orbital Icons Layer */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                
                <AnimatePresence mode="popLayout">
                  {/* Orbit 1 */}
                  <motion.div
                    key={`${activeSketch}-orbit-1`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute w-[350px] h-[350px] border border-charcoal/[0.03] rounded-full"
                    >
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 bg-white border border-charcoal/5 rounded-2xl shadow-xl pointer-events-auto"
                      >
                        {activeSketch === 'it' && <Server className="w-6 h-6 text-primary" />}
                        {activeSketch === 'print' && <Shirt className="w-6 h-6 text-primary" />}
                        {activeSketch === 'marketing' && <Search className="w-6 h-6 text-primary" />}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Orbit 2 */}
                  <motion.div
                    key={`${activeSketch}-orbit-2`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      style={{ rotate: 120 }}
                      className="absolute w-[420px] h-[420px] border border-charcoal/[0.02] rounded-full"
                    >
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        style={{ rotate: -120 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 bg-white border border-charcoal/5 rounded-2xl shadow-xl pointer-events-auto"
                      >
                        {activeSketch === 'it' && <Cpu className="w-6 h-6 text-primary" />}
                        {activeSketch === 'print' && <PenTool className="w-6 h-6 text-primary" />}
                        {activeSketch === 'marketing' && <BarChart className="w-6 h-6 text-primary" />}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Orbit 3 */}
                  <motion.div
                    key={`${activeSketch}-orbit-3`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                      style={{ rotate: 240 }}
                      className="absolute w-[380px] h-[380px] border border-charcoal/[0.025] rounded-full"
                    >
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                        style={{ rotate: -240 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 p-4 bg-white border border-charcoal/5 rounded-2xl shadow-xl pointer-events-auto"
                      >
                        {activeSketch === 'it' && <Cloud className="w-6 h-6 text-primary" />}
                        {activeSketch === 'print' && <Type className="w-6 h-6 text-primary" />}
                        {activeSketch === 'marketing' && <Megaphone className="w-6 h-6 text-primary" />}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

              </div>

              {/* Bottom Caption & Selector UI Overlay */}
              <div className="absolute bottom-[-20px] left-0 right-0 flex flex-col items-center space-y-6 z-20">
                <div className="flex bg-white/80 backdrop-blur-md border border-charcoal/5 rounded-full p-1.5 shadow-xl">
                  {['it', 'print', 'marketing'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActiveSketch(p as any)}
                      className={`px-6 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                        activeSketch === p
                          ? 'bg-charcoal text-white shadow-lg'
                          : 'text-charcoal/30 hover:bg-bg hover:text-charcoal'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <span className="font-sans text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.4em]">Agency_System </span>
                 {/* <span className="font-hand text-primary text-lg font-bold italic opacity-60">"Revolving Creative Logic"</span>*/}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </header>

      {/* CORE THREE-SERVICES OVERVIEW GRID - ANIMATED */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 bg-white/50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-20">
            <span className="font-sans text-xs font-bold text-charcoal/30 uppercase tracking-[0.2em] block mb-3">Core Ecosystem</span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal">
              Three Unified Creative Practices
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Card 1: IT Solutions */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -12 }}
              className="bg-white border border-charcoal/5 p-8 rounded-[2.5rem] shadow-xl shadow-charcoal/5 transition-all flex flex-col justify-between group"
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
                <span>Explore more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 2: Branding & Printing */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -12 }}
              className="bg-white border border-charcoal/5 p-8 rounded-[2.5rem] shadow-xl shadow-charcoal/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">[ MATERIAL ]</span>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-4">Branding & Print</h3>
                <p className="font-sans text-base text-charcoal/50 leading-relaxed mb-8">
                  Logo design, Print Shop (T-shirts, Caps, Menus, etc.), and Free Consultations for your brand identity.
                </p>
              </div>
              <button
                onClick={() => handleNavigate('branding-printing')}
                className="text-sm font-bold text-primary hover:text-primary/80 text-left flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <span>Explore more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 3: Digital Marketing */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -12 }}
              className="bg-white border border-charcoal/5 p-8 rounded-[2.5rem] shadow-xl shadow-charcoal/5 transition-all flex flex-col justify-between group"
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
                <span>Explore more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* IT SOLUTIONS MODULAR PORTFOLIO */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <ITServices />
      </motion.div>

      {/* BRANDING & PRINTING SECTION */}
      <motion.section
        id="branding-printing"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-bg relative"
      >
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
          <div className="flex bg-white/50 border border-charcoal/5 max-w-sm mx-auto rounded-[1.5rem] p-1.5 text-xs sm:text-sm font-bold mb-16 shadow-sm">
            <button
              id="subtab-print"
              onClick={() => setBrandingSubTab(brandingSubTab === 'print' ? null : 'print')}
              className={`flex-1 py-4 rounded-xl transition-all cursor-pointer ${
                brandingSubTab === 'print' ? 'bg-charcoal text-white shadow-xl shadow-charcoal/20' : 'text-charcoal/40 hover:bg-white'
              }`}
            >
              Print
            </button>
            <button
              id="subtab-logo"
              onClick={() => setBrandingSubTab(brandingSubTab === 'logo' ? null : 'logo')}
              className={`flex-1 py-4 rounded-xl transition-all cursor-pointer ${
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

        </div>
      </motion.section>

      {/* PRINTING JOBS GALLERY SECTION */}
      <motion.div
        id="printing-jobs"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <PrintingJobsGallery />
      </motion.div>

      {/* DIGITAL MARKETING CORE SEC */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <DigitalMarketing />
      </motion.div>

      {/* ABOUT US story, mission, crew blocks */}
      <AboutUs />

      {/* TESTIMONIALS catalog and TrustpilotScoreboard */}
      <Testimonials />

      {/* CONTACT FORM & custom coordinate maps */}
      <ContactForm />

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
    
    // Polyfill for manual pushState
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
      {path === '/admin' ? <AdminDashboard /> : <LandingPage />}
    </OrderProvider>
  );
}
