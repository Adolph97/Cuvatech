import React, { useState } from 'react';
import { Send, CheckCircle, MapPin, Mail, Phone, Clock, Twitter, Instagram, Linkedin, HelpCircle } from 'lucide-react';

export default function ContactForm() {
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

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-cream border-b-2 border-charcoal relative">
      <div className="absolute inset-0 bg-[#fbfbf9]/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Custom map & Contact Specifications */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-hand font-bold text-lg text-clay block">Say Hello</span>
              <h3 className="font-serif text-4xl sm:text-5xl font-black text-charcoal">
                Establish Direct Contact
              </h3>
              <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed">
                Whether you need server systems aligned, organic booklets bound, or organic search 
                campaigns mapped, we keep the line warm. Get in touch directly, with no bot gates.
              </p>
            </div>

            {/* Custom Hand-Drawn Map (SVG layout of Temple Lane, Dublin) */}
            <div className="bg-white border-2 border-charcoal p-4 rounded-xl sketch-shadow-sm space-y-3">
              <span className="font-mono text-xxs font-bold text-clay/80 uppercase block">OUR WORKSPACE POSITION SPEC</span>
              
              <div className="h-44 bg-beige border-2 border-charcoal rounded-md relative overflow-hidden flex items-center justify-center">
                
                {/* Visual sketch map shapes */}
                <svg className="absolute inset-0 w-full h-full text-charcoal/20 stroke-[1.2]" viewBox="0 0 300 200" fill="none">
                  {/* Street grids */}
                  <path d="M0,45h300M0,150h300M120,0v200M220,0v200" stroke="currentColor" strokeWidth="6" />
                  {/* Small back alleys */}
                  <path d="M40,45v105M120,95h100" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
                  
                  {/* Blocks shapes representing buildings */}
                  <rect x="20" y="10" width="80" height="25" fill="#eae6db" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="140" y="10" width="60" height="25" fill="#eae6db" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="240" y="10" width="50" height="120" fill="#eae6db" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="20" y="60" width="80" height="75" fill="#eae6db" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="140" y="60" width="60" height="25" fill="#fcfbf9" stroke="currentColor" strokeWidth="1.5" />
                  {/* Cuva studio block highlighted */}
                  <rect x="140" y="105" width="60" height="30" fill="#faf3e0" stroke="currentColor" strokeWidth="2" />
                  
                  {/* River Liffey representation at bottom */}
                  <path d="M0,185 Q100,180 200,190 T300,182" stroke="#8c5d3a" strokeWidth="4" strokeOpacity="0.15" />
                  
                  {/* Text tags */}
                  <text x="50" y="25" fontFamily="Georgia" fontSize="9" fill="#1e1b18" fillOpacity="0.4">DAME ST.</text>
                  <text x="175" y="125" fontFamily="Georgia" fontSize="10" fontWeight="bold" fill="#8c5d3a">CUVA</text>
                  <text x="250" y="70" fontFamily="Georgia" fontSize="8" fill="#1e1b18" fillOpacity="0.4" transform="rotate(90, 250, 70)">TEMPLE LANE</text>
                </svg>

                {/* Animated Map Pin */}
                <div className="absolute top-[100px] left-[155px] flex flex-col items-center group cursor-pointer">
                  <div className="bg-clay text-cream p-1 rounded-full border border-charcoal animate-bounce sketch-shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="bg-charcoal text-cream text-[9px] font-bold px-2 py-0.5 rounded border border-charcoal mt-1 pointer-events-none whitespace-nowrap">
                    Cuva Studio
                  </div>
                </div>
              </div>

              <span className="font-sans text-[10px] text-charcoal/50 text-center block italic">
                (Click the pin or search 8 Temple Lane South, Dublin 2, Ireland on standard layouts)
              </span>
            </div>

            {/* Direct addresses points */}
            <div className="space-y-4 font-sans text-sm text-charcoal">
              <div className="flex items-start space-x-3.5">
                <span className="p-2 bg-beige border border-charcoal/20 rounded">
                  <MapPin className="w-4 h-4 text-clay" />
                </span>
                <div>
                  <strong className="text-charcoal block">Cuva Studio HQ</strong>
                  <span className="text-charcoal/70">8 Temple Lane South, Temple Bar, Dublin 2, Ireland</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="p-2 bg-beige border border-charcoal/20 rounded">
                  <Mail className="w-4 h-4 text-clay" />
                </span>
                <div>
                  <strong className="text-charcoal block">Email Correspondence</strong>
                  <a href="mailto:studio@cuva.tech" className="text-clay hover:underline font-semibold">studio@cuva.tech</a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="p-2 bg-beige border border-charcoal/20 rounded">
                  <Phone className="w-4 h-4 text-clay" />
                </span>
                <div>
                  <strong className="text-charcoal block">Direct Phone Hub</strong>
                  <span className="text-charcoal/70">+353 (1) 482-9031</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="p-2 bg-beige border border-charcoal/20 rounded">
                  <Clock className="w-4 h-4 text-clay" />
                </span>
                <div>
                  <strong className="text-charcoal block">Studio Availability</strong>
                  <span className="text-charcoal/70">Monday – Friday: 09:00 - 17:30 GMT</span>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="pt-4 border-t border-charcoal/10 flex items-center space-x-4">
              <span className="text-xs font-bold text-charcoal/40 uppercase font-mono">Analog Threads:</span>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-beige hover:bg-sand border border-charcoal rounded transition-colors" title="Twitter / X">
                <Twitter className="w-4 h-4 text-charcoal" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-beige hover:bg-sand border border-charcoal rounded transition-colors" title="Instagram">
                <Instagram className="w-4 h-4 text-charcoal" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-beige hover:bg-sand border border-charcoal rounded transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4 text-charcoal" />
              </a>
            </div>

          </div>

          {/* Right Side: Inquiry Contact Form */}
          <div className="lg:col-span-7 bg-white border-2 border-charcoal p-6 sm:p-10 rounded-xl sketch-shadow">
            
            {submitted ? (
              <div id="contact-success-state" className="py-12 text-center space-y-6">
                <div className="inline-block p-4 bg-orange-50 border-2 border-charcoal rounded-full text-clay animate-bounce">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-3xl font-black text-charcoal">Brief lodged!</h4>
                  <p className="font-sans text-sm text-charcoal/70 max-w-sm mx-auto leading-relaxed">
                    Thank you <strong className="font-bold">{formInputs.fullName}</strong>. Your inquiry of interest has been scheduled on Sarah’s creative layout docket.
                  </p>
                </div>

                <div className="bg-[#FAF3E0] p-5 rounded border-2 border-charcoal text-left max-w-md mx-auto space-y-2">
                  <span className="font-mono text-xxs font-bold text-moss block">CUVA WORKFLOW SPEC:</span>
                  <div className="grid grid-cols-2 text-xs font-sans gap-y-1">
                    <span className="text-charcoal/50">Service Area:</span>
                    <span className="text-charcoal font-bold text-right">{formInputs.enquiryType}</span>
                    <span className="text-charcoal/50">Contact Email:</span>
                    <span className="text-charcoal font-bold text-right truncate pl-4">{formInputs.email}</span>
                    <span className="text-charcoal/50">Est. Response:</span>
                    <span className="text-clay font-bold text-right">Inside 4 business hours</span>
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
                  className="bg-charcoal hover:bg-charcoal/90 text-cream px-6 py-2 border-2 border-charcoal rounded text-xs font-bold sketch-shadow transition-all"
                >
                  Log Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                
                <div className="border-b border-charcoal/10 pb-4 mb-3">
                  <h4 className="font-serif text-2xl font-black text-charcoal">
                    Write to our Studio
                  </h4>
                  <span className="font-hand font-bold text-clay text-sm block">Let's compile client blueprints</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                      <span>Your Name</span>
                      {errors.fullName && <span className="text-terracotta text-xxs font-normal">{errors.fullName}</span>}
                    </label>
                    <input
                      id="contact-form-name"
                      type="text"
                      name="fullName"
                      value={formInputs.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                    />
                  </div>

                  {/* Company field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">Company / Organization</label>
                    <input
                      id="contact-form-company"
                      type="text"
                      name="companyName"
                      value={formInputs.companyName}
                      onChange={handleInputChange}
                      placeholder="Lighthouse Books"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                      <span>Email coordinates</span>
                      {errors.email && <span className="text-terracotta text-xxs font-normal">{errors.email}</span>}
                    </label>
                    <input
                      id="contact-form-email"
                      type="email"
                      name="email"
                      value={formInputs.email}
                      onChange={handleInputChange}
                      placeholder="jane@lighthouse.co"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">Phone callback number</label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      name="phone"
                      value={formInputs.phone}
                      onChange={handleInputChange}
                      placeholder="+353 (1) 500-2918"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* Dropdown service switcher */}
                <div className="flex flex-col">
                  <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">Service area of choice</label>
                  <select
                    id="contact-form-enquiry"
                    name="enquiryType"
                    value={formInputs.enquiryType}
                    onChange={handleInputChange}
                    className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none font-bold text-charcoal"
                  >
                    <option value="IT Systems">IT Cloud Systems (AWS, GCP, Net setups)</option>
                    <option value="Logo & Brand specs">Bespoke Logo & Brand Guidelines</option>
                    <option value="Fine Printing configs">Custom Paperworks & Fine Printing</option>
                    <option value="Search SEO">Growth Marketing & Local Search checks</option>
                    <option value="Mixed custom brief">Mixed custom multi-service request</option>
                  </select>
                </div>

                {/* Message text area */}
                <div className="flex flex-col">
                  <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                    <span>How can we help synthesize your goals?</span>
                    {errors.message && <span className="text-terracotta text-xxs font-normal">{errors.message}</span>}
                  </label>
                  <textarea
                    id="contact-form-message"
                    name="message"
                    rows={4}
                    value={formInputs.message}
                    onChange={handleInputChange}
                    placeholder="E.g., We need our physical networks bridged to cloud storage and are hoping to print 200 companion leather notebooks with our minimal branding. Help design?"
                    className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* GDPR Consent */}
                <div className="flex items-start pt-1">
                  <input
                    id="contact-form-gdpr"
                    type="checkbox"
                    required
                    checked={formInputs.consent}
                    onChange={handleCheckboxChange}
                    className="mt-1 mr-2 p-1 border-2 border-charcoal text-clay"
                  />
                  <span className="font-sans text-xxs text-charcoal/60 leading-tight">
                    I agree to the GDPR client privacy covenants. I consent to Cuva Tech logging my details securely to reply to this studio project specifications brief.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    id="submit-contact-btn"
                    type="submit"
                    className="bg-clay hover:bg-clay/90 text-cream w-full py-4 text-sm font-bold border-2 border-charcoal sketch-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lodge Project Spec Brief</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
