import React, { useState } from 'react';
import { IT_SERVICES } from '../data';
import { ITService } from '../types';
import { HelpCircle, CheckCircle, Send, Check, ChevronDown, ChevronUp, Zap, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders } from '../OrderStore';
import { ScribbleStar, ScribbleCircle } from './NotionIllustrations';

// --- Custom Artisanal Icons (Blueprint Style) ---

const HardwareSetupIcon = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-charcoal stroke-[1.5] fill-none">
    <rect x="20" y="30" width="60" height="40" rx="4" />
    <path d="M35 70 l-5 10 h40 l-5 -10" />
    <path d="M45 45 l5 5 l10 -10" strokeWidth="2.5" />
    <circle cx="85" cy="20" r="3" fill="currentColor" />
    <path d="M75 15 q5 -5 10 5" strokeOpacity="0.3" />
  </svg>
);

const InfrastructureIcon = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-charcoal stroke-[1.5] fill-none">
    <rect x="25" y="15" width="50" height="70" rx="2" />
    <path d="M35 30 h30 M35 50 h30 M35 70 h30" strokeOpacity="0.4" />
    <circle cx="35" cy="30" r="1.5" fill="currentColor" />
    <circle cx="35" cy="50" r="1.5" fill="currentColor" />
    <circle cx="35" cy="70" r="1.5" fill="currentColor" />
    <path d="M75 40 q15 10 0 20" strokeDasharray="3 3" />
  </svg>
);

const WebDevIcon = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-charcoal stroke-[1.5] fill-none">
    <path d="M15 25 h70 v50 h-70 z" />
    <path d="M15 35 h70" />
    <circle cx="22" cy="30" r="2" fill="currentColor" />
    <circle cx="30" cy="30" r="2" fill="currentColor" />
    <path d="M40 50 l-8 8 l8 8 M60 50 l8 8 l-8 8" strokeWidth="2" />
    <path d="M54 48 l-8 20" strokeWidth="2" />
  </svg>
);

const CloudSolutionsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-charcoal stroke-[1.5] fill-none">
    <path d="M25 65 q-15 0 -15 -15 q0 -15 15 -15 q5 -20 25 -20 q20 0 25 20 q20 0 20 15 q0 15 -15 15 z" />
    <path d="M40 45 l10 10 l10 -10" />
    <path d="M50 55 v-20" />
    <circle cx="75" cy="35" r="4" strokeDasharray="2 2" />
  </svg>
);

const SoftwareDevIcon = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-charcoal stroke-[1.5] fill-none">
    <path d="M20 20 h60 v60 h-60 z" />
    <path d="M30 40 h40 M30 50 h25 M30 60 h35" strokeOpacity="0.5" />
    <path d="M75 75 l10 10 M85 75 l-10 10" stroke="currentColor" strokeWidth="2" />
    <path d="M25 25 l-5 -5" strokeOpacity="0.2" />
  </svg>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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

export default function ITServices() {
  const { addOrder } = useOrders();
  const [selectedService, setSelectedService] = useState<ITService | null>(null);
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);

  const openFormFor = (service: ITService) => {
    setSelectedService(service);
    setFormSubmitted(false);
    setFormInputs({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      message: `Hi Cuva Tech, I am interested in your ${service.title} plan. Let's arrange a consultation.`
    });
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formInputs.fullName.trim()) newErrors.fullName = 'Please let us know your name.';
    if (!formInputs.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formInputs.email)) {
      newErrors.email = 'Please provide a valid email structure.';
    }
    if (!formInputs.phone.trim()) newErrors.phone = 'Phone number helps us coordinate.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addOrder({
      type: 'IT',
      customerName: formInputs.fullName,
      customerEmail: formInputs.email,
      details: {
        service: selectedService?.title,
        company: formInputs.companyName,
        phone: formInputs.phone,
        message: formInputs.message
      }
    });

    setFormSubmitted(true);
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'hardware-software-setup': return <HardwareSetupIcon />;
      case 'it-infrastructure': return <InfrastructureIcon />;
      case 'web-development': return <WebDevIcon />;
      case 'cloud-solutions': return <CloudSolutionsIcon />;
      case 'software-development': return <SoftwareDevIcon />;
      default: return <HelpCircle className="w-10 h-10 text-charcoal stroke-[1.5]" />;
    }
  };

  const visibleServices = showAll ? IT_SERVICES : IT_SERVICES.slice(0, 2);

  return (
    <motion.section 
      id="it-services" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-16 bg-bg border-b border-charcoal/5 relative overflow-hidden"
    >
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b18_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />
      
      {/* Decorative "Staples" and "Notations" */}
      <div className="absolute top-10 left-10 w-8 h-1 bg-charcoal/10 rounded-full rotate-45" />
      <div className="absolute top-12 left-8 w-8 h-1 bg-charcoal/10 rounded-full rotate-45" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-12 relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
            <ScribbleCircle className="w-48 h-24 text-primary" />
          </div>
         {/* <span className="font-hand font-bold text-xl text-primary tracking-widest uppercase block mb-3 rotate-[-1deg]">
            System Architecture Layer
          </span>*/}
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-charcoal leading-none mb-6 tracking-tighter">
            IT Solutions <br /> & <span className="italic font-light">Digital Logic</span>
          </h2>
          <p className="font-sans text-xl text-charcoal/60 leading-relaxed max-w-2xl mx-auto font-medium">
            Quiet, bulletproof infrastructure built for creative minds. We draft setups using paper-based 
            clarity before engineering cloud architectures that withstand massive traffic peaks. 
          </p>
        </motion.div>

        {/* Services Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          <AnimatePresence mode="popLayout">
            {visibleServices.map((service, idx) => (
              <motion.div
                id={`it-service-${service.id}`}
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => openFormFor(service)}
                whileHover={{ y: -8, rotate: idx % 2 === 0 ? 0.5 : -0.5 }}
                className="relative cursor-pointer group"
              >
                {/* Asymmetrical "Blueprint" Card */}
                <div className="absolute inset-0 bg-charcoal/[0.02] border border-charcoal/5 rounded-3xl translate-x-2 translate-y-2 -z-10" />
                <div className="bg-white border border-charcoal/10 p-10 rounded-3xl shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-charcoal/5 group-hover:border-primary/20 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 bg-primary/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                        {getServiceIcon(service.id)}
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] text-charcoal/20 font-bold tracking-[0.3em] uppercase block">
                          Ref_No
                        </span>
                        <span className="font-mono text-xs text-charcoal/40 font-bold">
                          [01-0{idx + 1}]
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-3xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-8 h-px bg-primary/30" />
                      <p className="font-hand font-bold text-lg text-primary/70">
                        “{service.tagline}”
                      </p>
                    </div>

                    <p className="font-sans text-base text-charcoal/60 leading-relaxed mb-8 font-medium">
                      {service.description}
                    </p>

                    {/* Bullets */}
                    <ul className="space-y-3 mb-8">
                      {service.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start text-sm text-charcoal/70 font-medium">
                          <span className="mr-3 mt-1 text-primary">
                            <ScribbleStar className="w-3 h-3" />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-charcoal/5 flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-charcoal/30 uppercase tracking-widest">
                      Deployment Target: Stable
                    </span>
                    <div className="flex items-center space-x-2 text-primary">
                      <span className="font-hand font-bold text-lg">Build Order</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Toggle Button (Reveal/Conceal) */}
        {IT_SERVICES.length > 2 && (
          <motion.div 
            layout
            className="mt-12 text-center"
          >
            <button
              id="toggle-it-services"
              onClick={() => setShowAll(!showAll)}
              className="group relative inline-flex items-center space-x-4 px-10 py-4 bg-charcoal text-white font-display text-lg font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-charcoal/20 cursor-pointer"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span>{showAll ? 'Conceal Tech Layers' : 'Reveal All Services'}</span>
                {showAll ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 animate-bounce" />}
              </span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22, 1, 0.36, 1]" />
            </button>
            
            {!showAll && (
              <div className="mt-4 opacity-30 flex justify-center items-center space-x-2">
                <span className="font-hand text-sm font-bold">Scroll for expansion logic</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        )}

        {/* Dynamic Consultation request Banner - Technical Blueprint Style */}
        <motion.div 
          variants={fadeInUp}
          className="mt-14 bg-white border-2 border-dashed border-charcoal/10 p-10 sm:p-14 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
        >
          {/* Subtle watermarked "C" */}
          <div className="absolute -bottom-10 -right-10 text-[20rem] font-display font-black text-charcoal/[0.02] select-none leading-none pointer-events-none">C</div>
          
          <div className="max-w-2xl relative">
            {/*<div className="absolute -top-8 -left-8">
              <Zap className="w-12 h-12 text-primary opacity-20 rotate-[-15deg]" />
            </div>*/}
            <h4 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-4 tracking-tight">
              Unsure about legacy <br />database frameworks?
            </h4>
            <p className="font-sans text-lg text-charcoal/60 leading-relaxed font-medium">
              We offer free, zero-commitment physical tech audits. Let our principal systems architect sit 
              down with you to map out your architecture securely.
            </p>
          </div>
          
          <div className="relative">
            <motion.button
              id="audit-cta-btn"
              onClick={() => openFormFor(IT_SERVICES[0])}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/20 cursor-pointer flex items-center space-x-3 group"
            >
              <MousePointer2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Schedule Audit</span>
            </motion.button>
            <div className="absolute -bottom-6 right-0 font-hand text-primary font-bold text-sm rotate-[-3deg] opacity-60">
              *Paper-first analysis
            </div>
          </div>
        </motion.div>

      </div>

      {/* MODAL VIEW - SPEC SHEET STYLE */}
      <AnimatePresence>
        {selectedService && (
          <div id="it-modal-overlay" className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              id="it-modal-content"
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              className="bg-bg border border-charcoal/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header - Spec Sheet style */}
              <div className="bg-white border-b border-charcoal/10 p-8 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[10px] text-primary uppercase tracking-[0.3em] block mb-1">Docket_System_v4.2</span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal leading-none">
                    Service Spec: {selectedService.title}
                  </h3>
                </div>
                <button
                  id="close-it-modal"
                  onClick={() => setSelectedService(null)}
                  className="w-12 h-12 bg-bg border border-charcoal/10 rounded-full flex items-center justify-center hover:bg-white hover:rotate-90 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-2xl font-light">×</span>
                </button>
              </div>

              {/* Content view toggle */}
              {!formSubmitted ? (
                <form id="it-consultation-form" onSubmit={handleSubmit} className="p-10 space-y-8 bg-white/50">
                  <div className="bg-primary/5 p-6 rounded-2xl border-l-4 border-primary">
                    <p className="font-sans text-sm text-charcoal/70 leading-relaxed font-medium">
                      You are requesting a blueprint for <strong className="text-charcoal">{selectedService.title}</strong>. 
                      Our lead technicians will study your infrastructure parameters immediately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 flex justify-between">
                        <span>Legal Name</span>
                        {errors.fullName && <span className="text-primary font-normal lowercase">{errors.fullName}</span>}
                      </label>
                      <input
                        id="it-form-fullName"
                        type="text"
                        name="fullName"
                        value={formInputs.fullName}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className="bg-white border border-charcoal/10 px-5 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2">Company / Agency</label>
                      <input
                        id="it-form-company"
                        type="text"
                        name="companyName"
                        value={formInputs.companyName}
                        onChange={handleInputChange}
                        placeholder="Scribe Editorial"
                        className="bg-white border border-charcoal/10 px-5 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 flex justify-between">
                        <span>Secure Email</span>
                        {errors.email && <span className="text-primary font-normal lowercase">{errors.email}</span>}
                      </label>
                      <input
                        id="it-form-email"
                        type="email"
                        name="email"
                        value={formInputs.email}
                        onChange={handleInputChange}
                        placeholder="jane@scribe.co"
                        className="bg-white border border-charcoal/10 px-5 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 flex justify-between">
                        <span>Direct Phone</span>
                        {errors.phone && <span className="text-primary font-normal lowercase">{errors.phone}</span>}
                      </label>
                      <input
                        id="it-form-phone"
                        type="tel"
                        name="phone"
                        value={formInputs.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 381-0029"
                        className="bg-white border border-charcoal/10 px-5 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-sans text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2">Technical Brief / Scale</label>
                    <textarea
                      id="it-form-message"
                      name="message"
                      value={formInputs.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="E.g., We have 3 local server cages and 12 virtual databases. Ideal deployment targets is mid-August."
                      className="bg-white border border-charcoal/10 px-5 py-6 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                    />
                  </div>

                  <div className="flex items-start pt-2">
                    <input
                      id="it-form-gdpr"
                      type="checkbox"
                      required
                      defaultChecked
                      className="mt-1 mr-3 w-4 h-4 text-primary border-charcoal/10 rounded focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="font-sans text-[10px] text-charcoal/50 leading-relaxed font-bold uppercase tracking-wider">
                      I authorize secure data handling under GDPR protocols. Cuva Tech enforces zero-leak policies.
                    </span>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      id="submit-it-consult"
                      type="submit"
                      whileHover={{ scale: 1.02, backgroundColor: '#000' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-charcoal text-white py-6 rounded-2xl font-display text-xl font-bold shadow-xl shadow-charcoal/10 flex items-center justify-center space-x-3 transition-colors cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                      <span>Submit Blueprint Request</span>
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div id="it-form-success" className="p-16 text-center space-y-8 bg-white">
                  <div className="relative inline-block">
                    <ScribbleCircle className="absolute inset-0 w-32 h-32 text-primary -translate-x-4 -translate-y-4 opacity-20 pointer-events-none" />
                    <div className="relative p-6 bg-primary/10 rounded-full text-primary">
                      <CheckCircle className="w-16 h-16 stroke-[1]" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-display text-3xl font-bold text-charcoal">
                      Transmission Successful
                    </h4>
                    <p className="font-sans text-base text-charcoal/60 max-w-sm mx-auto leading-relaxed font-medium">
                      Thank you <strong className="text-charcoal">{formInputs.fullName}</strong>. Your request is queued under secure reference:
                      <span className="block font-mono text-primary font-bold text-xl mt-4 tracking-widest">
                        CUVA-SYS-{Math.floor(1000 + Math.random() * 9000)}
                      </span>
                    </p>
                  </div>

                  {/* Simulated Handdrawn Note */}
                  <div className="bg-bg border border-charcoal/5 p-8 rounded-[2rem] text-left max-w-sm mx-auto relative">
                    <div className="absolute top-0 right-10 w-4 h-8 bg-primary/10 rounded-full -translate-y-1/2" />
                    <span className="font-mono font-bold text-[9px] text-primary/40 block mb-4 uppercase tracking-[0.4em]">Internal_Memo</span>
                    <p className="font-hand text-xl leading-relaxed text-charcoal font-bold italic rotate-[-1deg]">
                      "The Scribe Editorial migration brief is on my desk. I'm sketching the initial network layout now. Expect a secure proof in your inbox within 4 hours."
                    </p>
                    <span className="font-hand text-lg font-bold text-primary block text-right mt-6">- Victor</span>
                  </div>

                  <button
                    id="success-close-btn"
                    onClick={() => setSelectedService(null)}
                    className="w-full py-5 font-sans font-bold text-charcoal/40 hover:text-charcoal transition-colors uppercase tracking-[0.3em] text-[10px] cursor-pointer"
                  >
                    Return to System Overview
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
