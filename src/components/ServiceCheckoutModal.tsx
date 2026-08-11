import React, { useState, useMemo } from 'react';
import { X, Lock, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useOrders } from '../OrderStore';

const cardElementStyle = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: '#1E1B18',
      '::placeholder': { color: 'rgba(30,27,24,0.3)' },
      padding: '16px',
    },
    invalid: { color: '#ef4444' },
  },
};

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features?: string[];
}

interface ServiceCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServicePackage;
  publishableKey: string;
  serviceType: string;
}

function CheckoutForm({
  service,
  publishableKey,
  serviceType,
  onSuccess,
}: {
  service: ServicePackage;
  publishableKey: string;
  serviceType: string;
  onSuccess: (ref: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { addOrder } = useOrders();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    if (!stripe || !elements) {
      setError('Stripe is still loading. Please wait.');
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.');
      return;
    }

    const cardElement = elements.getElement(CardElement) as any;
    if (!cardElement) {
      setError('Card element not found.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(service.price * 100),
          currency: 'usd',
          orderId: `CUVA-${serviceType}-${Math.floor(100000 + Math.random() * 900000)}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment');

      const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: name.trim(), email: email.trim() },
        },
      });

      if (confirmError) throw new Error(confirmError.message || 'Payment failed');

      const ref = `CUVA-${serviceType}-${Math.floor(100000 + Math.random() * 900000)}`;

      await addOrder({
        type: serviceType,
        customerName: name.trim(),
        customerEmail: email.trim(),
        details: {
          service: service.name,
          description: service.description,
          total: service.price,
          paymentStatus: 'paid',
          reference: ref
        }
      });

      onSuccess(ref);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="font-sans text-[9px] sm:text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full bg-bg border border-charcoal/5 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="font-sans text-[9px] sm:text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.co"
            className="w-full bg-bg border border-charcoal/5 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-sans text-[9px] sm:text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Card Details</label>
        <div className="bg-white border border-charcoal/5 px-5 py-4 sm:py-5 rounded-2xl">
          <CardElement options={cardElementStyle} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="font-sans text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      <button
        type="button"
        disabled={!stripe || submitting}
        onClick={handlePay}
        className="bg-primary text-white w-full py-5 rounded-2xl font-bold text-sm shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
      >
        {submitting ? (
          <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Processing...</span></>
        ) : (
          <><Lock className="w-4 h-4" /><span>Pay ${service.price.toFixed(2)}</span></>
        )}
      </button>
    </div>
  );
}

export default function ServiceCheckoutModal({
  isOpen,
  onClose,
  service,
  publishableKey,
  serviceType,
}: ServiceCheckoutModalProps) {
  const [successRef, setSuccessRef] = useState('');
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  const handleClose = () => {
    setSuccessRef('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-charcoal/20 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {successRef ? (
              <div className="p-12 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full text-primary animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-2xl font-extrabold text-charcoal">Booked!</h4>
                  <p className="font-sans text-sm text-charcoal/50 leading-relaxed">
                    Your <strong>{service.name}</strong> service has been confirmed.
                  </p>
                  <span className="font-mono bg-primary/10 font-bold px-4 py-1 rounded-full border border-primary/20 inline-block mt-2 text-primary text-sm select-all">
                    {successRef}
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="bg-bg border border-charcoal/10 text-charcoal px-8 py-4 rounded-2xl font-bold text-sm hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-primary/5 p-8 pb-6 flex items-start justify-between">
                  <div>
                    <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.2em] block mb-2">Secure Checkout</span>
                    <h3 className="font-display text-2xl font-extrabold text-charcoal leading-tight">{service.name}</h3>
                    <p className="font-sans text-xs text-charcoal/40 mt-1">{service.description}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full bg-white border border-charcoal/5 flex items-center justify-center hover:bg-bg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-charcoal/40" />
                  </button>
                </div>

                {/* Price badge */}
                <div className="px-8 pt-6">
                  <div className="flex items-center justify-between bg-bg border border-charcoal/5 p-4 rounded-2xl">
                    <span className="font-sans text-xs font-bold text-charcoal/40 uppercase tracking-widest">Total</span>
                    <span className="font-display font-extrabold text-charcoal text-2xl">${service.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="px-8 pt-4">
                    <ul className="space-y-2">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-start text-xs text-charcoal/60">
                          <CheckCircle className="w-3.5 h-3.5 text-primary mr-2 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Checkout form */}
                <div className="p-8 pt-6">
                  {publishableKey ? (
                    <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
                      <CheckoutForm
                        service={service}
                        publishableKey={publishableKey}
                        serviceType={serviceType}
                        onSuccess={setSuccessRef}
                      />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-10 h-10 text-charcoal/10 mx-auto mb-3" />
                      <p className="font-sans text-sm text-charcoal/40 font-medium">
                        Payment not configured. Set Stripe keys in Admin Settings.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
