import React, { useState } from 'react';
import { IT_SERVICES } from '../data';
import { ITService } from '../types';
import { Server, Cpu, Cloud, HelpCircle, FileText, CheckCircle, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders } from '../OrderStore';

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

interface ITServicesProps {
  onPreSelectService?: string;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

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

    // Process valid form
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
      case 'cloud-solutions':
        return <Cloud className="w-10 h-10 text-charcoal stroke-[1.5]" />;
      case 'it-infrastructure':
        return <Cpu className="w-10 h-10 text-primary stroke-[1.5]" />;
      case 'hardware-software-setup':
        return <Server className="w-10 h-10 text-primary stroke-[1.5]" />;
      case 'web-development':
        return <FileText className="w-10 h-10 text-primary stroke-[1.5]" />;
      case 'software-development':
        return <Send className="w-10 h-10 text-primary stroke-[1.5]" />;
      default:
        return <HelpCircle className="w-10 h-10 text-charcoal stroke-[1.5]" />;
    }
  };

  const [showAll, setShowAll] = useState(false);
  const visibleServices = showAll ? IT_SERVICES : IT_SERVICES.slice(0, 2);

  return (
    <motion.section 
      id="it-services" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-20 bg-bg border-b border-charcoal/5 relative"
    >
      {/* Visual Organic Accent Grid line background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b18_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-charcoal leading-tight mb-4">
            IT Solutions & Systems
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mb-6 rounded-full" />
          <p className="font-sans text-lg text-charcoal/80 leading-relaxed">
            Quiet, bulletproof infrastructure built for creative minds. We draft setups using paper-based 
            clarity before engineering cloud architectures that withstand massive traffic peaks. 
          </p>
        </motion.div>

        {/* Services Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence>
            {visibleServices.map((service, idx) => (
              <motion.div
                id={`it-service-${service.id}`}
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                variants={fadeInUp}
                onClick={() => openFormFor(service)}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="soft-card p-8 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white border border-charcoal/5 rounded-2xl shadow-sm group-hover:bg-primary/5 transition-colors">
                      {getServiceIcon(service.id)}
                    </div>
                    <span className="font-mono text-xs text-charcoal/40 font-bold tracking-widest uppercase">
                      [01-{idx + 1}]
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-1">
                    {service.title}
                  </h3>
                  
                  <p className="font-hand font-bold text-base text-primary mb-4">
                    “{service.tagline}”
                  </p>

                  <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-3 mb-6">
                    {service.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start text-xs sm:text-sm text-charcoal/80">
                        <span className="p-0.5 mr-2.5 mt-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-charcoal/5 flex items-center justify-between text-xs sm:text-sm font-bold text-charcoal group-hover:text-primary transition-colors">
                  <span>Request details & pricing spec</span>
                  <span className="font-hand font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    Let’s Work →
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Reveal All Button */}
        {!showAll && IT_SERVICES.length > 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <button
              id="reveal-all-it-services"
              onClick={() => setShowAll(true)}
              className="btn-secondary px-10 py-4 text-sm font-bold rounded-2xl border border-charcoal/10 hover:bg-white transition-all shadow-sm cursor-pointer"
            >
              Reveal All Services
            </button>
          </motion.div>
        )}

        {/* Dynamic Consultation request Banner */}
        <motion.div 
          variants={fadeInUp}
          className="mt-16 bg-primary/10 border border-primary/20 p-8 sm:p-12 rounded-3xl shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-2xl">
            <h4 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-2">
              Unsure about legacy database frameworks?
            </h4>
            <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed">
              We offer free, zero-commitment physical tech audits. Let our principal systems architect sit 
              down with you (via video call or hot tea) to map out your architecture securely.
            </p>
          </div>
          <button
            id="audit-cta-btn"
            onClick={() => openFormFor(IT_SERVICES[0])}
            className="btn-primary whitespace-nowrap"
          >
            Schedule System Audit
          </button>
        </motion.div>

      </div>

      {/* MODAL VIEW */}
      <AnimatePresence>
        {selectedService && (
          <div id="it-modal-overlay" className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              id="it-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-bg border border-charcoal/10 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-primary/10 border-b border-charcoal/5 p-6 flex items-center justify-between">
                <div>
                  <span className="font-hand font-bold text-sm text-primary">IT Solutions Spec Sheet</span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal leading-none">
                    Consultation: {selectedService.title}
                  </h3>
                </div>
                <button
                  id="close-it-modal"
                  onClick={() => setSelectedService(null)}
                  className="p-2 hover:bg-white/50 text-charcoal rounded-full transition-all font-mono font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Content view toggle */}
              {!formSubmitted ? (
                <form id="it-consultation-form" onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="bg-white/40 p-4 rounded-2xl border border-charcoal/5">
                    <p className="font-sans text-xs text-charcoal/70">
                      You have selected <strong className="text-charcoal font-semibold">{selectedService.title}</strong>. 
                      This form pre-populates our CRM so a lead technician can study your agency needs immediately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                        <span>Full Name</span>
                        {errors.fullName && <span className="text-primary text-xxs font-normal">{errors.fullName}</span>}
                      </label>
                      <input
                        id="it-form-fullName"
                        type="text"
                        name="fullName"
                        value={formInputs.fullName}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    {/* Company Name */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">Company Name</label>
                      <input
                        id="it-form-company"
                        type="text"
                        name="companyName"
                        value={formInputs.companyName}
                        onChange={handleInputChange}
                        placeholder="Scribe Editorial"
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                        <span>Email Address</span>
                        {errors.email && <span className="text-primary text-xxs font-normal">{errors.email}</span>}
                      </label>
                      <input
                        id="it-form-email"
                        type="email"
                        name="email"
                        value={formInputs.email}
                        onChange={handleInputChange}
                        placeholder="jane@scribe.co"
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                        <span>Phone Number</span>
                        {errors.phone && <span className="text-primary text-xxs font-normal">{errors.phone}</span>}
                      </label>
                      <input
                        id="it-form-phone"
                        type="tel"
                        name="phone"
                        value={formInputs.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 381-0029"
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Service Interest (Auto) */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">Service of Interest</label>
                    <input
                      id="it-form-service"
                      type="text"
                      readOnly
                      value={selectedService.title}
                      className="bg-primary/5 border border-primary/20 p-3 rounded-xl text-sm text-charcoal/70 outline-none cursor-not-allowed select-none"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">Any specific needs or timescales?</label>
                    <textarea
                      id="it-form-message"
                      name="message"
                      value={formInputs.message}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="E.g., We have 3 local server cages and 12 virtual databases. Ideal deployment targets is mid-August."
                      className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  {/* GDPR Consent */}
                  <div className="flex items-start pt-1">
                    <input
                      id="it-form-gdpr"
                      type="checkbox"
                      required
                      defaultChecked
                      className="mt-1 mr-2 p-1 border-primary text-primary focus:ring-primary/20 cursor-pointer rounded"
                    />
                    <span className="font-sans text-xxs text-charcoal/70 leading-normal">
                      I agree to secure data handling protocols under GDPR values. Cuva Tech will strictly never sell my information.
                    </span>
                  </div>

                  <div className="pt-2">
                    <motion.button
                      id="submit-it-consult"
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Request Spec</span>
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div id="it-form-success" className="p-10 text-center space-y-6">
                  <div className="inline-block p-4 bg-primary/10 border border-primary/20 rounded-full text-primary animate-bounce">
                    <CheckCircle className="w-12 h-12 stroke-[1.5]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-display text-2xl font-bold text-charcoal">
                      Blueprint Registered!
                    </h4>
                    <p className="font-sans text-sm text-charcoal/80 max-w-sm mx-auto leading-relaxed">
                      Thank you <strong className="font-bold">{formInputs.fullName}</strong>. We have logged your request under reference number:
                      <span className="font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20 mx-1 select-all font-bold">
                        CUVA-IT-{Math.floor(1000 + Math.random() * 9000)}
                      </span>
                    </p>
                  </div>

                  {/* Simulated Handdrawn Note */}
                  <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl shadow-sm text-left max-w-sm mx-auto">
                    <span className="font-hand font-bold text-xs text-primary block mb-2 opacity-65">HAND-WRITTEN CONFIRMATION —</span>
                    <p className="font-hand text-base leading-relaxed text-charcoal font-semibold">
                      "Sarah or Sarah’s assistant is reviewing Scribe Editorial's request details today. 
                      Expect a warm response with a sketched deployment mock-up in your inbox inside 4 hours."
                    </p>
                    <span className="font-hand text-sm font-bold text-primary block text-right mt-3">- Cuva Studio</span>
                  </div>

                  <button
                    id="success-close-btn"
                    onClick={() => setSelectedService(null)}
                    className="btn-secondary w-full"
                  >
                    Return to Ecosystem
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
