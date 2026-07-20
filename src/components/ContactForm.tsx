import React, { useState } from 'react';
import { Send, CheckCircle, MapPin, Mail, Phone, Clock, Instagram, Linkedin, HelpCircle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useOrders } from '../OrderStore';
import { useSiteInfo } from '../SiteInfoStore';

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

const FALLBACK_PHONE_DISPLAY = '+1 (678) 656-8814';
const FALLBACK_PHONE_TEL = 'tel:+16786568814';
const FALLBACK_X = 'https://x.com/cuva.tech';
const FALLBACK_TIKTOK = 'https://www.tiktok.com/@cuva.tech';
const FALLBACK_INSTAGRAM = 'https://www.instagram.com/cuva.tech?igsh=MTJnbmM5Mm03Y2Fx';
const FALLBACK_LINKEDIN = 'https://www.linkedin.com/company/cuva-tech/';

export default function ContactForm() {
  const { addOrder } = useOrders();
  const { siteInfo } = useSiteInfo();
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    enquiryType: 'IT Systems',
    message: '',
    consent: true
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputs(prev => ({ ...prev, consent: e.target.checked }));
  };

  const address = siteInfo.address || '2108 Bradley Court, Springfield IL';
  const email = siteInfo.email || 'info@cuvatech.com';
  const phoneDisplay = siteInfo.phone || FALLBACK_PHONE_DISPLAY;
  const phoneTel = siteInfo.phone ? 'tel:+' + siteInfo.phone.replace(/\D/g, '') : FALLBACK_PHONE_TEL;
  const hours = siteInfo.openingHours
    ? `Monday – Friday: ${siteInfo.openingHours}${siteInfo.closingHours ? ' - ' + siteInfo.closingHours : ''} GMT`
    : 'Monday – Friday: 09:00 - 17:30 GMT';
  const xUrl = siteInfo.socials.x || FALLBACK_X;
  const tiktokUrl = siteInfo.socials.tiktok || FALLBACK_TIKTOK;
  const instagramUrl = siteInfo.socials.instagram || FALLBACK_INSTAGRAM;
  const linkedinUrl = siteInfo.socials.linkedin || FALLBACK_LINKEDIN;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formInputs.fullName.trim()) newErrors.fullName = 'Please let us know your name.';
    if (!formInputs.email.trim()) {
      newErrors.email = 'An email coordinates is necessary.';
    } else if (!/\S+@\S+\.\S+/.test(formInputs.email)) {
      newErrors.email = 'Please provide a valid email format config.';
    }
    if (!formInputs.message.trim()) newErrors.message = 'Please sketch out a brief query.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Log to Admin Store
    addOrder({
      type: 'Contact',
      customerName: formInputs.fullName,
      customerEmail: formInputs.email,
      details: {
        company: formInputs.companyName,
        phone: formInputs.phone,
        enquiryType: formInputs.enquiryType,
        message: formInputs.message
      }
    });

    setSubmitted(true);
  };

  return (
    <motion.section 
      id="contact" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-20 bg-bg border-b border-charcoal/5 relative"
    >
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Custom map & Contact Specifications */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-hand font-bold text-lg text-primary block">Say Hello</span>
              <h3 className="font-display text-4xl sm:text-5xl font-bold text-charcoal leading-tight">
                Establish Direct Contact
              </h3>
              <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed">
                Whether you need server systems aligned, organic booklets bound, or organic search 
                campaigns mapped, we keep the line warm. Get in touch directly, with no bot gates.
              </p>
            </div>

            {/* Custom Hand-Drawn Map (SVG layout of Temple Lane, Dublin) */}
            <div className="bg-white border border-charcoal/5 p-5 rounded-2xl shadow-sm space-y-4">
              <span className="font-mono text-[10px] font-bold text-primary/60 uppercase block tracking-widest">OUR WORKSPACE POSITION SPEC</span>
              
              <div className="h-48 bg-bg border border-charcoal/5 rounded-xl relative overflow-hidden flex items-center justify-center">
                
                {/* Visual sketch map shapes */}
                <svg className="absolute inset-0 w-full h-full text-charcoal/10 stroke-[1.2]" viewBox="0 0 300 200" fill="none">
                  {/* Street grids */}
                  <path d="M0,45h300M0,150h300M120,0v200M220,0v200" stroke="currentColor" strokeWidth="4" />
                  {/* Small back alleys */}
                  <path d="M40,45v105M120,95h100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
                  
                  {/* Blocks shapes representing buildings */}
                  <rect x="20" y="10" width="80" height="25" fill="#fcfbf9" stroke="currentColor" strokeWidth="1" />
                  <rect x="140" y="10" width="60" height="25" fill="#fcfbf9" stroke="currentColor" strokeWidth="1" />
                  <rect x="240" y="10" width="50" height="120" fill="#fcfbf9" stroke="currentColor" strokeWidth="1" />
                  <rect x="20" y="60" width="80" height="75" fill="#fcfbf9" stroke="currentColor" strokeWidth="1" />
                  <rect x="140" y="60" width="60" height="25" fill="#fcfbf9" stroke="currentColor" strokeWidth="1" />
                  {/* Cuva studio block highlighted */}
                  <rect x="140" y="105" width="60" height="30" fill="rgba(229, 139, 109, 0.1)" stroke="var(--color-primary)" strokeWidth="1" />
                  
                  {/* River Liffey representation at bottom */}
                  <path d="M0,185 Q100,180 200,190 T300,182" stroke="var(--color-primary)" strokeWidth="4" strokeOpacity="0.1" />
                </svg>

                {/* Animated Map Pin */}
                <div className="absolute top-[105px] left-[155px] flex flex-col items-center group cursor-pointer">
                  <div className="bg-primary text-white p-1.5 rounded-full shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="bg-charcoal text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 pointer-events-none whitespace-nowrap shadow-sm">
                    Cuva Studio
                  </div>
                </div>
              </div>

              <span className="font-sans text-[10px] text-charcoal/40 text-center block font-medium">
                ({address})
              </span>
            </div>

            {/* Direct addresses points */}
            <div className="space-y-5 font-sans text-sm text-charcoal">
              <div className="flex items-start space-x-4">
                <span className="p-2.5 bg-primary/5 border border-primary/10 rounded-xl">
                  <MapPin className="w-4 h-4 text-primary" />
                </span>
                <div>
                  <strong className="text-charcoal block font-bold">Cuva Studio HQ</strong>
                  <span className="text-charcoal/60">{address}</span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="p-2.5 bg-primary/5 border border-primary/10 rounded-xl">
                  <Mail className="w-4 h-4 text-primary" />
                </span>
                <div>
                  <strong className="text-charcoal block font-bold">Email Correspondence</strong>
                  <a href={`mailto:${email}`} className="text-primary hover:underline font-bold">{email}</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="p-2.5 bg-primary/5 border border-primary/10 rounded-xl">
                  <Phone className="w-4 h-4 text-primary" />
                </span>
                <div>
                  <strong className="text-charcoal block font-bold">Direct Phone Hub</strong>
                  <a href={phoneTel} className="text-primary font-bold">{phoneDisplay}</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="p-2.5 bg-primary/5 border border-primary/10 rounded-xl">
                  <Clock className="w-4 h-4 text-primary" />
                </span>
                <div>
                  <strong className="text-charcoal block font-bold">Studio Availability</strong>
                  <span className="text-charcoal/60">{hours}</span>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="pt-6 border-t border-charcoal/5 flex items-center space-x-4">
              <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest font-sans">Connect:</span>
              <motion.a whileHover={{ y: -5 }} href={xUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="X">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href={tiktokUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href={instagramUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="Instagram">
                <Instagram className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors" />
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href={linkedinUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white hover:bg-bg border border-charcoal/5 rounded-full transition-all shadow-sm group" title="LinkedIn">
                <Linkedin className="w-4 h-4 text-charcoal group-hover:text-primary transition-colors" />
              </motion.a>
            </div>

          </motion.div>

          {/* Right Side: Inquiry Contact Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-7 bg-white border border-charcoal/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg w-full overflow-hidden">
            
            {submitted ? (
              <div id="contact-success-state" className="py-12 text-center space-y-8">
                <div className="inline-block p-6 bg-primary/10 border border-primary/20 rounded-full text-primary animate-bounce shadow-sm">
                  <CheckCircle className="w-16 h-16 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <h4 className="font-display text-3xl font-bold text-charcoal">Brief lodged!</h4>
                  <p className="font-sans text-sm text-charcoal/60 max-w-sm mx-auto leading-relaxed">
                    Thank you <strong className="font-bold text-charcoal">{formInputs.fullName}</strong>. Your inquiry of interest has been scheduled on Sarah’s creative layout docket.
                  </p>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-left max-w-md mx-auto space-y-4">
                  <span className="font-mono text-[10px] font-bold text-primary/60 block uppercase tracking-widest">CUVA WORKFLOW SPEC:</span>
                  <div className="grid grid-cols-2 text-xs font-sans gap-y-2">
                    <span className="text-charcoal/50">Service Area:</span>
                    <span className="text-charcoal font-bold text-right">{formInputs.enquiryType}</span>
                    <span className="text-charcoal/50">Contact Email:</span>
                    <span className="text-charcoal font-bold text-right truncate pl-4">{formInputs.email}</span>
                    <span className="text-charcoal/50">Est. Response:</span>
                    <span className="text-primary font-bold text-right uppercase tracking-tighter">Inside 4 business hours</span>
                  </div>
                </div>

                <button
                  id="reset-contact-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setFormInputs({
                      fullName: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      enquiryType: 'IT Systems',
                      message: '',
                      consent: true
                    });
                  }}
                  className="btn-secondary w-full max-w-xs"
                >
                  Log Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="border-b border-charcoal/5 pb-6 mb-2">
                  <h4 className="font-display text-3xl font-bold text-charcoal">
                    Write to our Studio
                  </h4>
                  <span className="font-hand font-bold text-primary text-base block mt-1">Let's compile client blueprints</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1 flex justify-between">
                      <span>Your Name</span>
                      {errors.fullName && <span className="text-primary text-[10px] font-bold uppercase">{errors.fullName}</span>}
                    </label>
                    <input
                      id="contact-form-name"
                      type="text"
                      name="fullName"
                      value={formInputs.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="bg-bg border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>

                  {/* Company field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1">Company / Organization</label>
                    <input
                      id="contact-form-company"
                      type="text"
                      name="companyName"
                      value={formInputs.companyName}
                      onChange={handleInputChange}
                      placeholder="Lighthouse Books"
                      className="bg-bg border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1 flex justify-between">
                      <span>Email coordinates</span>
                      {errors.email && <span className="text-primary text-[10px] font-bold uppercase">{errors.email}</span>}
                    </label>
                    <input
                      id="contact-form-email"
                      type="email"
                      name="email"
                      value={formInputs.email}
                      onChange={handleInputChange}
                      placeholder="jane@lighthouse.co"
                      className="bg-bg border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1">Phone callback number</label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      name="phone"
                      value={formInputs.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (678) 656-8814"
                      className="bg-bg border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Dropdown service switcher */}
                <div className="flex flex-col">
                  <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1">Service area of choice</label>
                  <div className="relative">
                    <select
                      id="contact-form-enquiry"
                      name="enquiryType"
                      value={formInputs.enquiryType}
                      onChange={handleInputChange}
                      className="w-full bg-bg border border-charcoal/10 p-3.5 pr-11 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold text-charcoal cursor-pointer appearance-none"
                    >
                      <option value="IT Systems">IT Cloud Systems (AWS, GCP, Net setups)</option>
                      <option value="Logo & Brand specs">Bespoke Logo & Brand Guidelines</option>
                      <option value="Fine Printing configs">Custom Paperworks & Fine Printing</option>
                      <option value="Search SEO">Growth Marketing & Local Search checks</option>
                      <option value="Mixed custom brief">Mixed custom multi-service request</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-charcoal/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Message text area */}
                <div className="flex flex-col">
                  <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1 flex justify-between">
                    <span>How can we help synthesize your goals?</span>
                    {errors.message && <span className="text-primary text-[10px] font-bold uppercase">{errors.message}</span>}
                  </label>
                  <textarea
                    id="contact-form-message"
                    name="message"
                    rows={4}
                    value={formInputs.message}
                    onChange={handleInputChange}
                    placeholder="E.g., We need our physical networks bridged to cloud storage and are hoping to print 200 companion leather notebooks..."
                    className="bg-bg border border-charcoal/10 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm resize-none"
                  />
                </div>

                {/* GDPR Consent */}
                <div className="flex items-start pt-2">
                  <input
                    id="contact-form-gdpr"
                    type="checkbox"
                    required
                    checked={formInputs.consent}
                    onChange={handleCheckboxChange}
                    className="mt-1 mr-3 p-1 border border-charcoal/10 text-primary focus:ring-primary/20 cursor-pointer rounded transition-all"
                  />
                  <span className="font-sans text-[11px] font-medium text-charcoal/40 leading-relaxed">
                    I agree to the GDPR client privacy covenants. I consent to Cuva Tech logging my details securely to reply to this studio project specifications brief.
                  </span>
                </div>

                <div className="pt-4">
                  <button
                    id="submit-contact-btn"
                    type="submit"
                    className="btn-primary w-full py-4 text-sm flex items-center justify-center space-x-3 shadow-xl shadow-primary/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lodge Project Spec Brief</span>
                  </button>
                </div>

              </form>
            )}

          </motion.div>

        </div>

      </div>
    </motion.section>
  );
}
