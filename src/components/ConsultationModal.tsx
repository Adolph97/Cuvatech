import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, ChevronDown, Clock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useOrders } from '../OrderStore';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterest?: string;
}

const INTEREST_OPTIONS = [
  'General Agency Inquiry',
  'IT Support & Cloud Systems',
  'Web & Software Development',
  'Brand Identity & Logo Design',
  'Custom Printing & Merchandise',
  'Digital Marketing & SEO Audit'
];

export default function ConsultationModal({ isOpen, onClose, defaultInterest }: ConsultationModalProps) {
  const { addOrder } = useOrders();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(defaultInterest || INTEREST_OPTIONS[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!phone.trim()) {
      errs.phone = 'Phone number is required so we can coordinate.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setInterest(defaultInterest || INTEREST_OPTIONS[0]);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await addOrder({
        type: 'Consultation',
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        details: {
          interest,
          phone: phone.trim(),
          notes: notes.trim() || 'No additional notes provided.',
          source: 'Landing Navigation Modal'
        }
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit consultation booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="consultation-modal-overlay" className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            id="consultation-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-charcoal/20 overflow-hidden my-auto border border-charcoal/5"
          >
            {/* Modal Header */}
            <div className="bg-primary/5 p-8 pb-6 flex items-start justify-between border-b border-charcoal/5">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                    <Clock className="w-3 h-3" />
                  </span>
                  <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.2em] block">
                    Cuva Discovery ticket
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal leading-tight">
                  {isSuccess ? 'Consultation Confirmed' : <>Schedule Free <br className="hidden sm:inline" />Consultation</>}
                </h3>
              </div>
              <button
                id="close-consult-modal"
                onClick={handleClose}
                type="button"
                className="w-10 h-10 rounded-full bg-white border border-charcoal/5 flex items-center justify-center hover:bg-bg transition-colors cursor-pointer text-charcoal/40 hover:text-charcoal shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <motion.div
                id="consult-success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-10 text-center space-y-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full text-primary">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-2xl font-bold text-charcoal">Request Successfully Submitted!</h4>
                  <p className="font-sans text-sm text-charcoal/60 leading-relaxed max-w-sm mx-auto">
                    Thank you, <strong className="text-charcoal font-bold">{fullName}</strong>. Your consultation request for <strong className="text-primary font-bold">{interest}</strong> has been logged to our ticket. A team member will reach out to you via <strong className="text-charcoal font-bold">{phone}</strong> or <strong className="text-charcoal font-bold">{email}</strong> within 24 hours.
                  </p>
                </div>

                <div className="bg-bg rounded-2xl p-4 text-left space-y-2 text-xs font-sans border border-charcoal/5">
                  <div className="flex justify-between">
                    <span className="text-charcoal/40 font-bold uppercase tracking-wider text-[10px]">Contact</span>
                    <span className="text-charcoal font-bold">{fullName} ({phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/40 font-bold uppercase tracking-wider text-[10px]">Email</span>
                    <span className="text-charcoal font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/40 font-bold uppercase tracking-wider text-[10px]">Topic</span>
                    <span className="text-primary font-bold">{interest}</span>
                  </div>
                </div>

                <button
                  id="consult-done-btn"
                  onClick={handleClose}
                  type="button"
                  className="bg-charcoal text-white w-full py-4 text-sm font-bold rounded-2xl shadow-lg hover:bg-charcoal/90 active:scale-[0.99] transition-all text-center cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4 font-sans">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest ml-1">
                    Your Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="consult-input-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="e.g. Marcus Aurelius"
                    className={`w-full bg-bg px-5 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none border ${
                      errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-transparent'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.fullName}</p>}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest ml-1">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      id="consult-input-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="client@company.com"
                      className={`w-full bg-bg px-5 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none border ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-transparent'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest ml-1">
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <input
                      id="consult-input-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+1 (555) 019-2834"
                      className={`w-full bg-bg px-5 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none border ${
                        errors.phone ? 'border-red-400 bg-red-50/20' : 'border-transparent'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Primary Interest Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest ml-1">
                    Primary Area of Interest
                  </label>
                  <div className="relative">
                    <select
                      id="consult-select-interest"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-bg border border-transparent px-5 py-3.5 pr-12 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer text-charcoal"
                    >
                      {INTEREST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-charcoal/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Optional Note/Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest ml-1">
                    Project Details / Goals <span className="text-charcoal/30 lowercase font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="consult-input-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us briefly about what you are aiming to build or solve..."
                    className="w-full bg-bg border border-transparent px-5 py-3.5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  id="consult-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white w-full py-4 text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.99] transition-all text-center mt-2 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting ticket...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Schedule Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-2 pt-1 text-[10px] text-charcoal/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Zero-commitment consultation. We strictly protect your privacy.</span>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
