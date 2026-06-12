import React, { useState } from 'react';
import { IT_SERVICES } from '../data';
import { ITService } from '../types';
import { Server, Cpu, Cloud, HelpCircle, FileText, CheckCircle, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ITServicesProps {
  onPreSelectService?: string;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

export default function ITServices() {
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
    setFormSubmitted(true);
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'cloud-migration':
        return <Cloud className="w-10 h-10 text-moss stroke-[1.5]" />;
      case 'cloud-architecture':
        return <Cpu className="w-10 h-10 text-clay stroke-[1.5]" />;
      case 'infrastructure-management':
        return <Server className="w-10 h-10 text-terracotta stroke-[1.5]" />;
      default:
        return <HelpCircle className="w-10 h-10 text-moss stroke-[1.5]" />;
    }
  };

  return (
    <section id="it-services" className="py-20 bg-cream border-b-2 border-charcoal relative">
      {/* Visual Organic Accent Grid line background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b18_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-hand font-bold text-lg text-clay tracking-wider uppercase block mb-1">
            01 / System Layer
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-charcoal leading-tight mb-4">
            IT Solutions & Systems
          </h2>
          <div className="w-24 h-1 bg-charcoal mx-auto mb-6 rounded-full" />
          <p className="font-sans text-lg text-charcoal/80 leading-relaxed">
            Quiet, bulletproof infrastructure built for creative minds. We draft setups using paper-based 
            clarity before engineering cloud architectures that withstand massive traffic peaks. 
          </p>
        </div>

        {/* Services Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {IT_SERVICES.map((service, idx) => (
            <motion.div
              id={`it-service-${service.id}`}
              key={service.id}
              onClick={() => openFormFor(service)}
              whileHover={{ y: -6, boxShadow: "8px 8px 0px 0px rgba(30, 27, 24, 1)" }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="bg-beige border-2 border-charcoal p-8 rounded-lg sketch-shadow cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-cream border-2 border-charcoal rounded-md sketch-shadow-sm group-hover:bg-sand transition-colors">
                    {getServiceIcon(service.id)}
                  </div>
                  <span className="font-mono text-xs text-charcoal/40 font-bold tracking-widest uppercase">
                    [01-{idx + 1}]
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-1">
                  {service.title}
                </h3>
                
                <p className="font-hand font-bold text-base text-clay mb-4">
                  “{service.tagline}”
                </p>

                <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-3 mb-6">
                  {service.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start text-xs sm:text-sm text-charcoal/80">
                      <span className="p-0.5 mr-2.5 mt-0.5 rounded-full bg-cream border border-charcoal text-clay">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-charcoal/10 flex items-center justify-between text-xs sm:text-sm font-bold text-charcoal hover:text-clay">
                <span>Request details & pricing spec</span>
                <span className="font-hand font-semibold text-clay/80 group-hover:translate-x-1 transition-transform">
                  Let’s Work →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Consultation request Banner */}
        <div className="mt-16 bg-sand border-2 border-charcoal p-8 sm:p-12 rounded-xl sketch-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h4 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">
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
            className="whitespace-nowrap bg-charcoal hover:bg-charcoal/90 text-cream px-6 py-3.5 text-sm sm:text-base font-bold rounded border-2 border-charcoal sketch-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Schedule System Audit
          </button>
        </div>

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
              className="bg-cream border-2 border-charcoal w-full max-w-lg rounded-xl shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-sand border-b-2 border-charcoal p-5 flex items-center justify-between">
                <div>
                  <span className="font-hand font-bold text-sm text-clay">IT Solutions Spec Sheet</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-charcoal leading-none">
                    Consultation: {selectedService.title}
                  </h3>
                </div>
                <button
                  id="close-it-modal"
                  onClick={() => setSelectedService(null)}
                  className="sketch-border p-2 bg-beige hover:bg-sand text-charcoal rounded hover:scale-105 active:scale-95 transition-all font-mono font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Content view toggle */}
              {!formSubmitted ? (
                <form id="it-consultation-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="bg-beige/40 p-4 rounded border border-charcoal/10">
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
                        {errors.fullName && <span className="text-terracotta text-xxs font-normal">{errors.fullName}</span>}
                      </label>
                      <input
                        id="it-form-fullName"
                        type="text"
                        name="fullName"
                        value={formInputs.fullName}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
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
                        className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                        <span>Email Address</span>
                        {errors.email && <span className="text-terracotta text-xxs font-normal">{errors.email}</span>}
                      </label>
                      <input
                        id="it-form-email"
                        type="email"
                        name="email"
                        value={formInputs.email}
                        onChange={handleInputChange}
                        placeholder="jane@scribe.co"
                        className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                        <span>Phone Number</span>
                        {errors.phone && <span className="text-terracotta text-xxs font-normal">{errors.phone}</span>}
                      </label>
                      <input
                        id="it-form-phone"
                        type="tel"
                        name="phone"
                        value={formInputs.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 381-0029"
                        className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
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
                      className="bg-sand/60 border-2 border-charcoal p-2.5 rounded text-sm text-charcoal/70 outline-none cursor-not-allowed select-none"
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
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm text-charcoal focus:outline-none focus:bg-white resize-none"
                    />
                  </div>

                  {/* GDPR Consent */}
                  <div className="flex items-start pt-1">
                    <input
                      id="it-form-gdpr"
                      type="checkbox"
                      required
                      defaultChecked
                      className="mt-1 mr-2 p-1 border-2 border-charcoal text-clay focus:ring-0 cursor-pointer"
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
                      className="bg-clay hover:bg-clay/90 text-cream w-full py-3 text-sm font-bold rounded border-2 border-charcoal sketch-shadow hover:shadow-[5px_5px_0px_0px_rgba(30,27,24,1)] active:translate-x-0 active:translate-y-0 cursor-pointer transition-all flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Request Spec</span>
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div id="it-form-success" className="p-8 text-center space-y-6">
                  <div className="inline-block p-4 bg-beige border-2 border-charcoal rounded-full sketch-shadow-sm text-moss animate-bounce">
                    <CheckCircle className="w-12 h-12 stroke-[1.5]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-serif text-2xl font-black text-charcoal">
                      Blueprint Registered!
                    </h4>
                    <p className="font-sans text-sm text-charcoal/80 max-w-sm mx-auto leading-relaxed">
                      Thank you <strong className="font-bold">{formInputs.fullName}</strong>. We have logged your request under reference number:
                      <span className="font-mono bg-sand/60 px-2 py-0.5 rounded border border-charcoal/10 mx-1 select-all font-bold">
                        CUVA-IT-{Math.floor(1000 + Math.random() * 9000)}
                      </span>
                    </p>
                  </div>

                  {/* Simulated Handdrawn Note */}
                  <div className="bg-[#faf3e0] border-2 border-charcoal/20 p-5 rounded rotate-[-1deg] shadow-sm text-left max-w-sm mx-auto">
                    <span className="font-hand font-bold text-xs text-clay block mb-2 opacity-65">HAND-WRITTEN CONFIRMATION —</span>
                    <p className="font-hand text-base leading-relaxed text-charcoal font-semibold">
                      "Sarah or Sarah’s assistant is reviewing Scribe Editorial's request details today. 
                      Expect a warm response with a sketched deployment mock-up in your inbox inside 4 hours."
                    </p>
                    <span className="font-hand text-sm font-bold text-clay block text-right mt-3">- Cuva Studio</span>
                  </div>

                  <button
                    id="success-close-btn"
                    onClick={() => setSelectedService(null)}
                    className="bg-charcoal hover:bg-charcoal/90 text-cream px-6 py-2 text-xs font-bold border-2 border-charcoal rounded-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Return to Ecosystem
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
