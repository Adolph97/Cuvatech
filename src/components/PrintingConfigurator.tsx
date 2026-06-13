import React, { useState, useRef } from 'react';
import { PRINTING_PRODUCTS } from '../data';
import { PrintingProduct, DesignFile } from '../types';
import { Shirt, Album, BookOpen, Flag, Grid, Gift, Pin, FileQuestion, UploadCloud, Trash2, ArrowRight, ArrowLeft, CreditCard, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      setUploadError(`Unrecognized file format (${extension}). Fallback rule: please supply PNG, JPG, PDF, AI, or SVG formats or click below to request technical assistance.`);
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
    <div id="printing-configurator-card" className="bg-bg border border-charcoal/5 rounded-3xl shadow-xl overflow-visible max-w-6xl mx-auto">
      
      {/* Configurator Header & Progress Steps */}
      <div className="bg-primary/5 border-b border-charcoal/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-t-3xl">
        <div>
          <span className="font-hand font-bold text-sm text-primary">Step-by-Step Print Configurator</span>
          <h3 className="font-display text-2xl font-bold text-charcoal">Cuva Paperworks</h3>
        </div>
        
        {/* Steps display */}
        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-wider">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-charcoal/30'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-colors ${currentStep === 1 ? 'bg-white shadow-sm border border-charcoal/5' : 'bg-primary/10'}`}>1</span>
            <span className="hidden sm:inline">Choose</span>
          </div>
          <span className="text-charcoal/10">⎯⎯</span>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-charcoal/30'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-colors ${currentStep === 2 ? 'bg-white shadow-sm border border-charcoal/5' : 'bg-primary/10'}`}>2</span>
            <span className="hidden sm:inline">Design</span>
          </div>
          <span className="text-charcoal/10">⎯⎯</span>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-charcoal/30'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-colors ${currentStep === 3 ? 'bg-white shadow-sm border border-charcoal/5' : 'bg-primary/10'}`}>3</span>
            <span className="hidden sm:inline">Checkout</span>
          </div>
        </div>
      </div>

      {orderComplete ? (
        <div id="print-order-complete" className="p-10 sm:p-16 text-center space-y-8">
          <div className="inline-block p-6 bg-primary/10 border border-primary/20 rounded-full text-primary animate-bounce shadow-sm">
            <CheckCircle className="w-16 h-16 stroke-[1.5]" />
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-3xl font-bold text-charcoal">Order & Layout Lodged!</h4>
            <p className="font-sans text-sm text-charcoal/80 max-w-lg mx-auto leading-relaxed">
              Your payment has cleared successfully. The design and dimensions have been locked onto our 
              silkscreen master plate under Reference ID:
              <span className="font-mono bg-primary/10 font-bold px-3 py-1 rounded-full border border-primary/20 inline-block mt-3 select-all">
                {orderReference}
              </span>
            </p>
          </div>

          {/* Recapitulation of printed specs */}
          <div className="bg-white border border-charcoal/5 max-w-md mx-auto p-6 rounded-2xl shadow-sm space-y-4">
            <span className="font-mono text-[10px] font-bold text-primary uppercase block tracking-widest">Print Docket Details:</span>
            <div className="grid grid-cols-2 text-xs gap-y-2.5 font-sans">
              <span className="text-charcoal/50">Product Category:</span>
              <span className="text-charcoal font-bold text-right">{actualProductLabel}</span>
              
              <span className="text-charcoal/50">Total Quantity:</span>
              <span className="text-charcoal font-bold text-right">{quantity} {selectedProduct.unitLabel}</span>
              
              <span className="text-charcoal/50">Design Filename:</span>
              <span className="text-charcoal font-mono text-right truncate pl-4">{designFile?.name}</span>

              {customDimension && (
                <>
                  <span className="text-charcoal/50">Preferred Sizes:</span>
                  <span className="text-charcoal font-bold text-right">{customDimension}</span>
                </>
              )}
            </div>
          </div>

          {/* Next Steps text */}
          <div className="max-w-md mx-auto font-hand text-lg text-primary font-bold opacity-80 leading-relaxed">
            “Our press technicians are inspecting your vector format resolution now. You will receive a PDF proof layout confirmation email shortly!”
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
            className="btn-primary"
          >
            Create New Print Request
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-t border-charcoal/5 divide-charcoal/5">
          
          {/* Main workspace section */}
          <div className="flex-1 p-6 sm:p-10 space-y-8 bg-bg overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1 Content: Category list */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  id="step-1-category-view"
                  className="space-y-6"
                >
                  <span className="font-sans text-xs text-charcoal/40 font-bold block uppercase tracking-widest">
                    [1/3] Select custom product category:
                  </span>
                  
                  <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                    {/* Left Column: Bento Deck */}
                    <div className="w-full xl:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3 select-none self-start">
                      {PRINTING_PRODUCTS.map((prod) => {
                        const isSelected = selectedProduct.id === prod.id;
                        return (
                          <motion.button
                            id={`print-prod-${prod.id}`}
                            key={prod.id}
                            onClick={() => handleProductChange(prod)}
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            type="button"
                            className={`text-left p-4 rounded-2xl border transition-all flex items-center space-x-3 group relative cursor-pointer ${
                              isSelected
                                ? 'border-primary/50 bg-white shadow-md'
                                : 'border-charcoal/5 hover:border-primary/20 bg-white/50 hover:bg-white'
                            }`}
                          >
                            <span className="p-2.5 bg-bg border border-charcoal/5 rounded-xl group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
                              {getProductIcon(prod.id)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="font-sans font-bold text-xs text-charcoal block leading-snug">
                                {prod.label.split(' / ')[0]}
                              </span>
                              <span className="font-mono text-[9px] text-charcoal/40 block mt-1 uppercase font-bold">
                                Min: {prod.minQty} {prod.unitLabel}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="absolute right-3 top-3 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Right Column: Spec card */}
                    <div className="flex-1 bg-white border border-charcoal/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-sm min-h-[340px]">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4 pb-5 border-b border-charcoal/5">
                          <span className="p-3 bg-bg border border-charcoal/5 rounded-2xl shrink-0">
                            {getProductIcon(selectedProduct.id)}
                          </span>
                          <div>
                            <span className="font-hand font-bold text-xs text-primary block tracking-wide uppercase leading-none mb-1.5">
                              Active Product Spec Sheet
                            </span>
                            <h4 className="font-display font-bold text-2xl text-charcoal leading-none">
                              {selectedProduct.label}
                            </h4>
                          </div>
                        </div>

                        <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                          {selectedProduct.description}
                        </p>

                        {/* Custom Input */}
                        {selectedProduct.id === 'custom' && (
                          <div id="custom-label-input-container" className="pt-2 flex flex-col space-y-2 animate-scale-in">
                            <label className="font-sans text-xs font-bold text-charcoal/60">
                              Describe custom material, asset or dimensions:
                            </label>
                            <input
                              id="custom-product-text"
                              type="text"
                              value={customProductLabel}
                              onChange={(e) => setCustomProductLabel(e.target.value)}
                              placeholder="E.g., Linen folder, wooden box cover"
                              className="bg-bg border border-charcoal/10 p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-full transition-all"
                            />
                          </div>
                        )}

                        {/* Financial specs */}
                        <div className="bg-bg border border-charcoal/5 p-4 rounded-2xl grid grid-cols-2 gap-y-2.5 text-xs font-sans">
                          <span className="text-charcoal/50">Baseline Unit Price:</span>
                          <span className="text-charcoal font-bold text-right">${selectedProduct.basePrice.toFixed(2)} / {selectedProduct.unitLabel.slice(0, -1) || 'unit'}</span>
                          
                          <span className="text-charcoal/50">Minimum Batch Volume:</span>
                          <span className="text-charcoal font-bold text-right">{selectedProduct.minQty} {selectedProduct.unitLabel}</span>
                          
                          <span className="text-charcoal/50">Initial setup overhead:</span>
                          <span className="text-charcoal font-bold text-right">${selectedProduct.id === 'custom' ? '25.00' : '15.00'}</span>
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-charcoal/5 flex items-center justify-between gap-4">
                        <span className="font-hand font-bold text-base text-charcoal/40 select-none animate-pulse">
                          “Artisanal plate ready!”
                        </span>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="btn-primary py-2.5 px-6 flex items-center space-x-2"
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
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  id="step-2-specs-view"
                  className="space-y-8"
                >
                <span className="font-sans text-xs text-charcoal/40 font-bold block uppercase tracking-widest">
                  [2/3] Specify volume & attach layouts:
                </span>

                {/* Grid inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Quantity */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1.5 flex justify-between">
                      <span>Order Quantity ({selectedProduct.unitLabel})</span>
                      <span className="text-primary text-xs font-bold font-mono">Min: {selectedProduct.minQty}</span>
                    </label>
                    <input
                      id="config-print-qty"
                      type="number"
                      min={selectedProduct.minQty}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="bg-white border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                    {quantity < selectedProduct.minQty && (
                      <span className="text-primary text-xxs mt-2 font-bold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Under product budget minimum.
                      </span>
                    )}
                  </div>

                  {/* Size / Dimensions option */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1.5">
                      Preferred Sizes & Layout dimensions
                    </label>
                    <input
                      id="config-print-sizes"
                      type="text"
                      value={customDimension}
                      onChange={(e) => setCustomDimension(e.target.value)}
                      placeholder="E.g., 5 Large, 12 Medium | 100cm x 50cm"
                      className="bg-white border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>

                </div>

                {/* DRAG AND DROP VECTOR UPLOAD */}
                <div className="space-y-3">
                  <label className="font-sans text-xs sm:text-sm font-bold text-charcoal block">
                    Upload Design File
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all relative ${
                      isDragging ? 'bg-primary/5 border-primary scale-[1.01]' : 'bg-white border-charcoal/10 hover:border-primary/30 hover:bg-white shadow-sm'
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
                      <div className="space-y-4">
                        <UploadCloud className="w-12 h-12 text-primary/30 mx-auto stroke-[1.2]" />
                        <div>
                          <p className="font-sans text-sm font-bold text-charcoal">
                            Drag and drop Vector Layout files here or browse files
                          </p>
                          <p className="font-sans text-xxs text-charcoal/40 mt-1.5 max-w-sm mx-auto">
                            Requires PNG, JPG, PDF, AI, or SVG parameters. Maximum size limit is 25MB.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div id="file-ready-preview" className="space-y-5 animate-scale-in">
                        {designFile.type.startsWith('image/') ? (
                          <div className="p-2 bg-bg border border-charcoal/5 rounded-2xl inline-block">
                            <img
                              src={designFile.previewUrl}
                              alt="Preview layout"
                              className="max-h-40 max-w-xs object-contain rounded-xl"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="bg-primary/10 border border-primary/20 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center">
                            <span className="font-mono font-bold text-xs text-primary">PDF/AI</span>
                          </div>
                        )}

                        <div className="flex items-center justify-center space-x-4 bg-bg p-3 border border-charcoal/5 rounded-2xl max-w-md mx-auto">
                          <div className="text-left truncate min-w-0">
                            <span className="font-mono text-xs font-bold text-charcoal block truncate">
                              {designFile.name}
                            </span>
                            <span className="font-sans text-xxs text-charcoal/40 block font-bold uppercase mt-0.5 tracking-tighter">
                              {designFile.size} KB • {designFile.type || 'Vector Spec'}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveFile();
                            }}
                            className="p-2 bg-white border border-charcoal/10 hover:border-primary hover:text-primary rounded-full transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div id="upload-alert" className="bg-primary/5 text-primary text-xs p-4 rounded-2xl flex items-start space-x-3 border border-primary/10 animate-shake">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="font-bold">{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Additional Spec notes */}
                <div className="flex flex-col">
                  <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1.5">
                    Custom production notes or special instructions
                  </label>
                  <textarea
                    id="config-print-notes"
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="E.g. We would prefer white water-based silkscreen inks on organic black textiles."
                    className="bg-white border border-charcoal/10 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm"
                  />
                </div>
                </motion.div>
              )}

              {/* Step 3 Content: Billing */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                >
                  <form id="print-billing-form" onSubmit={handleCheckoutSubmit} className="space-y-6">
                <span className="font-sans text-xs text-charcoal/40 font-bold block uppercase tracking-widest">
                  [3/3] Secure SSL Checkout Gate:
                </span>

                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start space-x-4 text-emerald-950">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold block text-sm">Encrypted payment gateway active</span>
                    <p className="text-emerald-800/60 mt-1 leading-relaxed">
                      This order summary has been checked against print inventory codes. Proceed to seal checkout.
                    </p>
                  </div>
                </div>

                {/* Card inputs */}
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1.5">Cardholder Name</label>
                    <input
                      id="card-holder-input"
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Jane Doe"
                      className="bg-white border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1.5">Credit Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-5 h-5 text-charcoal/20 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        id="card-number-input"
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        placeholder="4111 8888 2222 3912"
                        className="bg-white border border-charcoal/10 p-3.5 pl-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm w-full font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5">Expiry Date</label>
                      <input
                        id="card-expiry-input"
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-white border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-mono text-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5">CVV / Security</label>
                      <input
                        id="card-cvv-input"
                        type="password"
                        required
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g,''))}
                        placeholder="***"
                        className="bg-white border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* GDPR */}
                  <div className="flex items-start pt-2">
                    <div className="relative flex items-center">
                      <input
                        id="card-gdpr-check"
                        type="checkbox"
                        required
                        checked={consentGdpr}
                        onChange={(e) => setConsentGdpr(e.target.checked)}
                        className="w-4 h-4 border-charcoal/10 text-primary focus:ring-primary/20 cursor-pointer rounded transition-all"
                      />
                    </div>
                    <span className="font-sans text-[10px] font-medium text-charcoal/50 ml-3 leading-snug">
                      I consent to secure card processing in accordance with PCI-DSS guidelines. Invoice PDF will be sent to the contact address parameters.
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    id="submit-payment-btn"
                    type="submit"
                    disabled={submittingOrder}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/10 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submittingOrder ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 fill-current" />
                        <span>Confirm Order: ${total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Back action */}
            {currentStep > 1 && (
              <div className="pt-6 border-t border-charcoal/5 flex justify-start">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 hover:bg-primary/5 text-charcoal/60 hover:text-primary text-xs font-bold flex items-center space-x-2 transition-all rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go back</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Price summary */}
          <div className="w-full lg:w-96 bg-white p-6 sm:p-10 flex flex-col justify-between shadow-inner">
            <div className="space-y-8">
              <span className="font-mono text-[10px] font-bold text-charcoal/30 uppercase tracking-widest block">
                Live Pricing Ledger
              </span>

              <div className="border-b border-dashed border-charcoal/10 pb-6">
                <h4 className="font-display text-xl font-bold text-charcoal truncate">
                  {actualProductLabel}
                </h4>
                <p className="font-sans text-xs text-charcoal/40 font-bold mt-1.5 uppercase tracking-tighter">
                  Selected model configuration
                </p>
              </div>

              {/* Calc List */}
              <div className="space-y-4 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-charcoal/40 font-bold uppercase tracking-tighter">Base unit cost:</span>
                  <span className="text-charcoal font-bold">${unitPrice.toFixed(2)} / unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/40 font-bold uppercase tracking-tighter">Batch Quantity:</span>
                  <span className="text-charcoal font-bold">{Math.max(quantity, selectedProduct.minQty)} {selectedProduct.unitLabel}</span>
                </div>
                {quantity >= 200 && (
                  <div className="flex justify-between text-primary font-bold">
                    <span className="uppercase tracking-tighter">Bulk discount tier:</span>
                    <span>-{quantity >= 500 ? '20%' : '10%'} off</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-charcoal/5 pt-4">
                  <span className="text-charcoal/40 font-bold uppercase tracking-tighter">Setup & Plate Fee:</span>
                  <span className="text-charcoal font-bold">${setupFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-charcoal/5 mt-10">
              <div className="flex justify-between items-baseline mb-8">
                <span className="font-display font-bold text-charcoal/40 text-sm uppercase tracking-widest">Total:</span>
                <span className="font-display font-bold text-charcoal text-4xl">
                  ${total.toFixed(2)}
                </span>
              </div>

              {currentStep === 2 && (
                <button
                  id="printing-configurator-next"
                  onClick={handleNextStep}
                  className="btn-primary w-full py-4 text-sm flex items-center justify-center space-x-2 shadow-xl shadow-primary/20"
                >
                  <span>Checkout & Purchase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
