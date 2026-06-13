import React, { useState, useRef } from 'react';
import { PRINTING_PRODUCTS } from '../data';
import { PrintingProduct, DesignFile } from '../types';
import { Shirt, Album, BookOpen, Flag, Grid, Gift, Pin, FileQuestion, UploadCloud, Trash2, ArrowRight, ArrowLeft, CreditCard, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
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

export default function PrintingConfigurator() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedProduct, setSelectedProduct] = useState<PrintingProduct>(PRINTING_PRODUCTS[0]);
  const [quantity, setQuantity] = useState<number>(PRINTING_PRODUCTS[0].minQty);
  const [customDimension, setCustomDimension] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Custom Product open field
  const [customProductLabel, setCustomProductLabel] = useState('');

  // Upload Draft
  const [designFile, setDesignFile] = useState<DesignFile | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Billing Page
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [consentGdpr, setConsentGdpr] = useState(true);
  
  // Order Process
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  const getProductIcon = (id: string) => {
    switch (id) {
      case 't-shirts': return <Shirt className="w-5 h-5 text-primary" />;
      case 'notebooks': return <Album className="w-5 h-5 text-charcoal" />;
      case 'receipts': return <BookOpen className="w-5 h-5 text-charcoal" />;
      case 'banners': return <Flag className="w-5 h-5 text-primary" />;
      case 'stickers': return <Grid className="w-5 h-5 text-charcoal" />;
      case 'souvenirs': return <Gift className="w-5 h-5 text-primary" />;
      case 'pens': return <Pin className="w-5 h-5 text-charcoal" />;
      default: return <FileQuestion className="w-5 h-5 text-charcoal" />;
    }
  };

  const handleProductChange = (prod: PrintingProduct) => {
    setSelectedProduct(prod);
    setQuantity(prod.minQty);
    setUploadError('');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setQuantity(val);
  };

  // Drag-and-drop simulated file uploaded
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const validFormats = ['.png', '.jpg', '.jpeg', '.pdf', '.ai', '.svg'];
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validFormats.includes(extension) && !validFormats.includes(extension + 'eg')) {
      setUploadError(`Unrecognized file format (${extension}). Fallback rule: please supply PNG, JPG, PDF, AI, or SVG formats.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds our 25MB scale limit. Please compress vectors or use shared storage links.');
      return;
    }

    setUploadError('');
    // Create a mock local pointer
    setDesignFile({
      name: file.name,
      size: Math.round(file.size / 1024),
      type: file.type,
      previewUrl: URL.createObjectURL(file)
    });
  };

  const handleRemoveFile = () => {
    if (designFile?.previewUrl) {
      URL.revokeObjectURL(designFile.previewUrl);
    }
    setDesignFile(null);
  };

  // Pricing calculations
  const actualProductLabel = selectedProduct.id === 'custom' && customProductLabel.trim() 
    ? customProductLabel 
    : selectedProduct.label;

  const unitPrice = selectedProduct.basePrice;
  const rawSubtotal = unitPrice * Math.max(quantity, selectedProduct.minQty);
  
  // Custom bulk discounts
  const bulkFactor = quantity >= 500 ? 0.8 : quantity >= 200 ? 0.9 : 1.0;
  const subtotal = Math.round(rawSubtotal * bulkFactor * 100) / 100;
  
  const setupFee = selectedProduct.id === 'custom' ? 25.00 : 15.00;
  const total = Math.round((subtotal + setupFee) * 100) / 100;

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!designFile) {
        setUploadError('An attached design file or layout sketch is required to compile print registers.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);
    
    // Process billing
    setTimeout(() => {
      setSubmittingOrder(false);
      setOrderComplete(true);
      setOrderReference(`CUVA-PRNT-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 2200);
  };

  return (
    <motion.div 
      id="printing-configurator-card" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="bg-bg border border-charcoal/5 rounded-[2.5rem] shadow-2xl overflow-hidden max-w-6xl mx-auto"
    >
      
      {/* Configurator Header & Progress Steps */}
      <motion.div variants={fadeInUp} className="bg-primary/5 border-b border-charcoal/5 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-10">
        <div>
          <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.2em] block mb-2">Print Configurator</span>
          <h3 className="font-display text-3xl font-extrabold text-charcoal leading-none">Cuva Paperworks</h3>
        </div>
        
        {/* Steps display */}
        <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest">
          {[
            { n: 1, label: 'Choose' },
            { n: 2, label: 'Design' },
            { n: 3, label: 'Checkout' }
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className={`flex items-center ${currentStep >= s.n ? 'text-primary' : 'text-charcoal/20'}`}>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all font-bold ${currentStep === s.n ? 'bg-white shadow-xl shadow-primary/10 border border-primary/20 scale-110' : currentStep > s.n ? 'bg-primary/10' : 'bg-charcoal/5'}`}>{s.n}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < 2 && <span className="text-charcoal/5 font-normal tracking-[-0.2em]">⎯⎯⎯</span>}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {orderComplete ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} id="print-order-complete" className="p-16 sm:p-24 text-center space-y-10">
          <div className="inline-block p-8 bg-primary/10 border border-primary/20 rounded-full text-primary animate-bounce shadow-inner">
            <CheckCircle className="w-20 h-20 stroke-[1.5]" />
          </div>

          <div className="space-y-4">
            <h4 className="font-display text-4xl font-extrabold text-charcoal leading-none">Order Lodged!</h4>
            <p className="font-sans text-base text-charcoal/50 max-w-lg mx-auto leading-relaxed">
              Your payment has cleared successfully. The design and dimensions have been locked under Reference ID:
              <span className="font-mono bg-primary/10 font-bold px-4 py-1.5 rounded-full border border-primary/20 inline-block mt-4 select-all text-primary">
                {orderReference}
              </span>
            </p>
          </div>

          <div className="max-w-md mx-auto font-hand text-2xl text-primary font-bold opacity-80 leading-relaxed rotate-[-1deg]">
            “Our press technicians are inspecting your vector format resolution now. PDF proof coming soon!”
          </div>

          <button
            id="re-config-btn"
            onClick={() => {
              setCurrentStep(1);
              setOrderComplete(false);
              setDesignFile(null);
              setCustomDimension('');
              setAdditionalNotes('');
              setCustomProductLabel('');
            }}
            className="bg-bg border border-charcoal/10 text-charcoal px-10 py-5 rounded-2xl font-bold text-sm hover:bg-white transition-all shadow-sm cursor-pointer"
          >
            Start New Request
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-t border-charcoal/5 divide-charcoal/5">
          
          {/* Main workspace section */}
          <div className="flex-1 p-8 sm:p-12 space-y-10 bg-bg overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1 Content: Category list */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  id="step-1-category-view"
                  className="space-y-8"
                >
                  <span className="font-sans text-[10px] text-charcoal/30 font-bold block uppercase tracking-[0.2em]">
                    [01] Select product category
                  </span>
                  
                  <div className="flex flex-col xl:flex-row gap-10 items-stretch">
                    {/* Left Column: Bento Deck */}
                    <div className="w-full xl:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 select-none self-start">
                      {PRINTING_PRODUCTS.map((prod) => {
                        const isSelected = selectedProduct.id === prod.id;
                        return (
                          <motion.button
                            id={`print-prod-${prod.id}`}
                            key={prod.id}
                            onClick={() => handleProductChange(prod)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            className={`text-left p-5 rounded-2xl border transition-all flex items-center space-x-4 group relative cursor-pointer ${
                              isSelected
                                ? 'border-primary bg-white shadow-xl shadow-primary/5'
                                : 'border-charcoal/5 hover:border-primary/20 bg-white/50 hover:bg-white'
                            }`}
                          >
                            <span className="p-3 bg-bg border border-charcoal/5 rounded-xl group-hover:scale-110 transition-transform shrink-0 flex items-center justify-center">
                              {getProductIcon(prod.id)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="font-sans font-bold text-sm text-charcoal block leading-tight">
                                {prod.label.split(' / ')[0]}
                              </span>
                              <span className="font-sans text-[10px] text-charcoal/30 block mt-1 uppercase font-bold tracking-widest">
                                Min: {prod.minQty}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Right Column: Spec card */}
                    <div className="flex-1 bg-white border border-charcoal/5 rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between relative shadow-xl shadow-charcoal/5 min-h-[400px]">
                      <div className="space-y-8">
                        <div className="flex items-center space-x-5 pb-6 border-b border-charcoal/5">
                          <span className="p-4 bg-bg border border-charcoal/5 rounded-[1.5rem] shrink-0">
                            {getProductIcon(selectedProduct.id)}
                          </span>
                          <div>
                            <span className="font-sans font-bold text-[10px] text-primary block tracking-[0.2em] uppercase mb-1.5">
                              Active Specification
                            </span>
                            <h4 className="font-display font-bold text-2xl text-charcoal leading-none">
                              {selectedProduct.label}
                            </h4>
                          </div>
                        </div>

                        <p className="font-sans text-base text-charcoal/60 leading-relaxed italic">
                          "{selectedProduct.description}"
                        </p>

                        {/* Financial specs */}
                        <div className="bg-bg border border-charcoal/5 p-6 rounded-2xl grid grid-cols-2 gap-y-4 text-xs font-sans">
                          <span className="text-charcoal/30 font-bold uppercase tracking-widest">Unit Price</span>
                          <span className="text-charcoal font-extrabold text-right">${selectedProduct.basePrice.toFixed(2)}</span>
                          
                          <span className="text-charcoal/30 font-bold uppercase tracking-widest">Batch Volume</span>
                          <span className="text-charcoal font-extrabold text-right">{selectedProduct.minQty} {selectedProduct.unitLabel}</span>
                          
                          <span className="text-charcoal/30 font-bold uppercase tracking-widest">Setup Fee</span>
                          <span className="text-charcoal font-extrabold text-right">${selectedProduct.id === 'custom' ? '25.00' : '15.00'}</span>
                        </div>
                      </div>

                      <div className="pt-8 mt-8 border-t border-charcoal/5 flex items-center justify-between gap-6">
                        <span className="font-hand font-bold text-xl text-primary/40 select-none animate-pulse rotate-[-2deg]">
                          “Plate ready!”
                        </span>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-3 cursor-pointer"
                        >
                          <span>Next Step</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 Content: Specs & Upload */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  id="step-2-specs-view"
                  className="space-y-10"
                >
                <span className="font-sans text-[10px] text-charcoal/30 font-bold block uppercase tracking-[0.2em]">
                  [02] Specify volume & attach layouts
                </span>

                {/* Grid inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  
                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1 flex justify-between">
                      <span>Order Quantity</span>
                      <span className="text-primary">Min: {selectedProduct.minQty}</span>
                    </label>
                    <input
                      id="config-print-qty"
                      type="number"
                      min={selectedProduct.minQty}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full bg-white border border-charcoal/5 px-6 py-5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold text-charcoal"
                    />
                  </div>

                  {/* Size / Dimensions option */}
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">
                      Preferred Sizes & Dimensions
                    </label>
                    <input
                      id="config-print-sizes"
                      type="text"
                      value={customDimension}
                      onChange={(e) => setCustomDimension(e.target.value)}
                      placeholder="E.g., 5 Large, 12 Medium"
                      className="w-full bg-white border border-charcoal/5 px-6 py-5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold text-charcoal"
                    />
                  </div>

                </div>

                {/* DRAG AND DROP VECTOR UPLOAD */}
                <div className="space-y-4">
                  <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1 block">
                    Upload Design Brief
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all relative ${
                      isDragging ? 'bg-primary/5 border-primary scale-[1.02]' : 'bg-white border-charcoal/5 hover:border-primary/20 hover:bg-bg/50 shadow-sm'
                    }`}
                  >
                    <input
                      id="config-file-picker"
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept=".png,.jpg,.jpeg,.pdf,.ai,.svg"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />

                    {!designFile ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-primary/5 rounded-full inline-block animate-pulse">
                          <UploadCloud className="w-12 h-12 text-primary stroke-[1.2]" />
                        </div>
                        <div>
                          <p className="font-display text-xl font-bold text-charcoal">
                            Drag and drop Vector Layouts
                          </p>
                          <p className="font-sans text-xs text-charcoal/30 mt-2 max-w-sm mx-auto font-medium">
                            PNG, JPG, PDF, AI, or SVG. Maximum scale: 25MB.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div id="file-ready-preview" className="space-y-6">
                        {designFile.type.startsWith('image/') ? (
                          <div className="p-3 bg-white border border-charcoal/5 rounded-[1.5rem] inline-block shadow-2xl shadow-charcoal/5">
                            <img
                              src={designFile.previewUrl}
                              alt="Preview"
                              className="max-h-48 max-w-xs object-contain rounded-xl"
                            />
                          </div>
                        ) : (
                          <div className="bg-primary/10 border border-primary/20 w-24 h-24 rounded-[1.5rem] mx-auto flex items-center justify-center shadow-xl shadow-primary/5">
                            <span className="font-mono font-bold text-xs text-primary tracking-widest uppercase">Spec</span>
                          </div>
                        )}

                        <div className="flex items-center justify-center space-x-6 bg-white p-4 border border-charcoal/5 rounded-2xl max-w-md mx-auto shadow-sm">
                          <div className="text-left truncate min-w-0">
                            <span className="font-mono text-xs font-bold text-charcoal block truncate">
                              {designFile.name}
                            </span>
                            <span className="font-sans text-[9px] text-charcoal/30 block font-bold uppercase mt-1 tracking-widest">
                              {designFile.size} KB • {designFile.type.split('/')[1] || 'Spec'}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveFile(); }}
                            className="p-3 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-full transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">
                    Special production instructions
                  </label>
                  <textarea
                    id="config-print-notes"
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="E.g. We prefer white water-based inks on organic black textiles."
                    className="w-full bg-white border border-charcoal/5 p-6 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm font-medium text-charcoal"
                  />
                </div>
                </motion.div>
              )}

              {/* Step 3 Content: Billing */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form id="print-billing-form" onSubmit={handleCheckoutSubmit} className="space-y-8">
                <span className="font-sans text-[10px] text-charcoal/30 font-bold block uppercase tracking-[0.2em]">
                  [03] Secure SSL Checkout Gate
                </span>

                <div className="bg-green-50 border border-green-100 p-6 rounded-[1.5rem] flex items-start space-x-5">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-green-500">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-display font-bold block text-green-900 text-lg">Encrypted gateway active</span>
                    <p className="text-green-800/60 text-xs mt-1 font-medium leading-relaxed">
                      Proceed to seal checkout. Invoice PDF will be sent to the contact address parameters.
                    </p>
                  </div>
                </div>

                {/* Card inputs */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Cardholder Name</label>
                    <input
                      id="card-holder-input" type="text" required
                      value={cardHolder} onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white border border-charcoal/5 px-6 py-5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Credit Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-5 h-5 text-charcoal/10 absolute left-6 top-1/2 -translate-y-1/2" />
                      <input
                        id="card-number-input" type="text" required
                        value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19} placeholder="4111 8888 2222 3912"
                        className="w-full bg-white border border-charcoal/5 px-6 pl-14 py-5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-mono tracking-[0.2em] font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Expiry</label>
                      <input
                        id="card-expiry-input" type="text" required placeholder="MM/YY" maxLength={5}
                        value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-charcoal/5 px-6 py-5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-mono text-center font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">CVV</label>
                      <input
                        id="card-cvv-input" type="password" required maxLength={3}
                        value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g,''))}
                        placeholder="***"
                        className="w-full bg-white border border-charcoal/5 px-6 py-5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-mono text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  id="submit-payment-btn" type="submit" disabled={submittingOrder}
                  className="bg-primary text-white w-full py-6 rounded-2xl font-bold text-sm shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                >
                  {submittingOrder ? (
                    <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Processing...</span></>
                  ) : (
                    <><Lock className="w-4 h-4" /><span>Confirm Order: ${total.toFixed(2)}</span></>
                  )}
                </button>
              </form>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Back action */}
            {currentStep > 1 && (
              <div className="pt-8 border-t border-charcoal/5 flex justify-start">
                <button
                  type="button" onClick={handlePrevStep}
                  className="px-6 py-3 hover:bg-white text-charcoal/40 hover:text-primary text-[10px] font-bold uppercase tracking-widest flex items-center space-x-3 transition-all rounded-full border border-transparent hover:border-charcoal/5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go back</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Price summary */}
          <div className="w-full lg:w-[400px] bg-white p-10 sm:p-14 flex flex-col justify-between shadow-inner">
            <div className="space-y-10">
              <span className="font-sans text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.3em] block">
                Live Ledger
              </span>

              <div className="border-b border-dashed border-charcoal/10 pb-8">
                <h4 className="font-display text-2xl font-extrabold text-charcoal truncate">
                  {actualProductLabel}
                </h4>
                <p className="font-sans text-[10px] text-charcoal/20 font-bold mt-2 uppercase tracking-widest">
                  Active Configuration
                </p>
              </div>

              {/* Calc List */}
              <div className="space-y-5 text-[11px] font-sans">
                <div className="flex justify-between font-medium">
                  <span className="text-charcoal/40 uppercase tracking-widest">Unit cost</span>
                  <span className="text-charcoal font-bold">${unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-charcoal/40 uppercase tracking-widest">Batch Qty</span>
                  <span className="text-charcoal font-bold">{Math.max(quantity, selectedProduct.minQty)}</span>
                </div>
                {quantity >= 200 && (
                  <div className="flex justify-between text-primary font-bold">
                    <span className="uppercase tracking-widest">Bulk Tier</span>
                    <span>-{quantity >= 500 ? '20%' : '10%'}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-charcoal/5 pt-5 font-medium">
                  <span className="text-charcoal/40 uppercase tracking-widest">Plate Fee</span>
                  <span className="text-charcoal font-bold">${setupFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-charcoal/5 mt-14">
              <div className="flex justify-between items-baseline mb-10">
                <span className="font-display font-bold text-charcoal/20 text-sm uppercase tracking-widest">Total</span>
                <span className="font-display font-extrabold text-charcoal text-5xl">
                  ${total.toFixed(2)}
                </span>
              </div>

              {currentStep === 2 && (
                <button
                  id="printing-configurator-next" onClick={handleNextStep}
                  className="bg-charcoal text-white w-full py-6 rounded-2xl font-bold text-sm shadow-2xl shadow-charcoal/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
