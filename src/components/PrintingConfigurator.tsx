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
      case 't-shirts': return <Shirt className="w-5 h-5 text-clay" />;
      case 'notebooks': return <Album className="w-5 h-5 text-moss" />;
      case 'receipts': return <BookOpen className="w-5 h-5 text-charcoal" />;
      case 'banners': return <Flag className="w-5 h-5 text-terracotta" />;
      case 'stickers': return <Grid className="w-5 h-5 text-moss" />;
      case 'souvenirs': return <Gift className="w-5 h-5 text-clay" />;
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
    <div id="printing-configurator-card" className="bg-cream border-2 border-charcoal rounded-xl sketch-shadow-lg overflow-hidden max-w-4xl mx-auto">
      
      {/* Configurator Header & Progress Steps */}
      <div className="bg-sand border-b-2 border-charcoal p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-hand font-bold text-sm text-clay">Step-by-Step Print Configurator</span>
          <h3 className="font-serif text-2xl font-black text-charcoal">Cuva Paperworks</h3>
        </div>
        
        {/* Steps display */}
        <div className="flex items-center space-x-2 text-xs font-bold">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-clay' : 'text-charcoal/40'}`}>
            <span className={`w-6 h-6 border-2 border-charcoal rounded-full flex items-center justify-center mr-1 ${currentStep === 1 ? 'bg-cream' : 'bg-sand'}`}>1</span>
            <span className="hidden sm:inline">Choose</span>
          </div>
          <span className="text-charcoal/30">⎯⎯</span>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-clay' : 'text-charcoal/40'}`}>
            <span className={`w-6 h-6 border-2 border-charcoal rounded-full flex items-center justify-center mr-1 ${currentStep === 2 ? 'bg-cream' : 'bg-sand'}`}>2</span>
            <span className="hidden sm:inline">Design & Qty</span>
          </div>
          <span className="text-charcoal/30">⎯⎯</span>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-clay' : 'text-charcoal/40'}`}>
            <span className={`w-6 h-6 border-2 border-charcoal rounded-full flex items-center justify-center mr-1 ${currentStep === 3 ? 'bg-cream' : 'bg-sand'}`}>3</span>
            <span className="hidden sm:inline">Checkout</span>
          </div>
        </div>
      </div>

      {orderComplete ? (
        <div id="print-order-complete" className="p-8 sm:p-12 text-center space-y-6">
          <div className="inline-block p-4 bg-orange-50 border-2 border-charcoal rounded-full text-terracotta animate-bounce sketch-shadow-sm">
            <CheckCircle className="w-16 h-16 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-3xl font-black text-charcoal">Order & Layout Lodged!</h4>
            <p className="font-sans text-sm text-charcoal/80 max-w-lg mx-auto">
              Your payment has cleared successfully. The design and dimensions have been locked onto our 
              silkscreen master plate under Reference ID:
              <span className="font-mono bg-sand/60 font-bold px-2.5 py-0.5 rounded border border-charcoal/30 block mt-2 max-w-sm mx-auto select-all">
                {orderReference}
              </span>
            </p>
          </div>

          {/* Recapitulation of printed specs */}
          <div className="bg-beige border-2 border-charcoal max-w-md mx-auto p-5 rounded-lg text-left space-y-3">
            <span className="font-mono text-xxs font-bold text-clay/80 uppercase block">Print Docket Details:</span>
            <div className="grid grid-cols-2 text-xs gap-y-1.5 font-sans">
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
          <div className="max-w-md mx-auto font-hand text-base text-clay font-bold opacity-80 rotate-[-1deg]">
            “Our press technicians are inspecting your vector format resolution now. You will receive a PDFproof layout confirmation email inside shortly!”
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
            className="bg-charcoal hover:bg-charcoal/90 text-cream px-6 py-3 font-bold border-2 border-charcoal rounded sketch-shadow text-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Create New Print Request
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x-2 divide-charcoal">
          
          {/* Main workspace section */}
          <div className="flex-1 p-6 sm:p-8 space-y-6 bg-cream overflow-hidden">
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
                  className="space-y-4"
                >
                  <span className="font-sans text-xs text-charcoal/60 font-bold block uppercase tracking-widest">
                    [1/3] Select custom product category:
                  </span>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-stretch">
                    {/* Left Column: Interactive 2-Column Bento Deck - Zero Scrolling on Desktop */}
                    <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-3 select-none self-start">
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
                            className={`text-left p-3.5 rounded-lg border-2 transition-all flex items-center space-x-3 group relative cursor-pointer relative ${
                              isSelected
                                ? 'border-clay bg-sand/30 font-bold sketch-shadow-sm translate-x-0.5 translate-y-0.5'
                                : 'border-charcoal/10 hover:border-charcoal hover:bg-beige/40 bg-white'
                            }`}
                          >
                            <span className="p-2 border border-charcoal/20 rounded bg-white group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
                              {getProductIcon(prod.id)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="font-sans font-bold text-xs text-charcoal block leading-snug">
                                {prod.label.split(' / ')[0]}
                              </span>
                              <span className="font-mono text-[9px] text-charcoal/40 block mt-0.5">
                                Min: {prod.minQty} {prod.unitLabel}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="absolute right-3 top-3 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-clay"></span>
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Right Column: Spec card highlighting currently selected item */}
                    <div className="flex-1 bg-sand/15 border-2 border-charcoal/15 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
                      {/* Quiet logo backdrop mask */}
                      <div className="absolute right-[-15px] top-[-15px] text-charcoal/[0.03] w-24 h-24 pointer-events-none transform rotate-12">
                        {getProductIcon(selectedProduct.id)}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 pb-3 border-b border-charcoal/10">
                          <span className="p-2 border-2 border-charcoal rounded bg-white shrink-0">
                            {getProductIcon(selectedProduct.id)}
                          </span>
                          <div>
                            <span className="font-hand font-extrabold text-xs text-clay block tracking-wide uppercase leading-none mb-1">
                              Active Product Spec Sheet
                            </span>
                            <h4 className="font-serif font-black text-2xl text-charcoal leading-none">
                              {selectedProduct.label}
                            </h4>
                          </div>
                        </div>

                        <p className="font-sans text-sm text-charcoal/80 leading-relaxed min-h-[48px]">
                          {selectedProduct.description}
                        </p>

                        {/* Custom Input integrated directly inside details panel if custom chosen */}
                        {selectedProduct.id === 'custom' && (
                          <div id="custom-label-input-container" className="pt-2 flex flex-col space-y-1.5 antialiased animate-scale-in">
                            <label className="font-sans text-xs font-bold text-charcoal/70">
                              Describe custom material, asset or dimensions:
                            </label>
                            <input
                              id="custom-product-text"
                              type="text"
                              value={customProductLabel}
                              onChange={(e) => setCustomProductLabel(e.target.value)}
                              placeholder="E.g., Linen folder, wooden box cover"
                              className="bg-white border-2 border-charcoal p-2 rounded text-xs focus:outline-none focus:ring-1 focus:ring-clay w-full"
                            />
                          </div>
                        )}

                        {/* Financial specs sheet detail */}
                        <div className="bg-beige border border-charcoal/15 p-3 rounded-lg grid grid-cols-2 gap-y-2 text-xs font-sans">
                          <span className="text-charcoal/50">Baseline Unit Price:</span>
                          <span className="text-charcoal font-bold text-right">${selectedProduct.basePrice.toFixed(2)} / {selectedProduct.unitLabel.slice(0, -1) || 'unit'}</span>
                          
                          <span className="text-charcoal/50">Minimum Batch Volume:</span>
                          <span className="text-charcoal font-bold text-right">{selectedProduct.minQty} {selectedProduct.unitLabel}</span>
                          
                          <span className="text-charcoal/50">Initial setup overhead:</span>
                          <span className="text-charcoal font-bold text-right">${selectedProduct.id === 'custom' ? '25.00' : '15.00'}</span>
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-charcoal/10 flex items-center justify-between gap-4">
                        <span className="font-hand font-extrabold text-sm text-moss select-none animate-pulse">
                          “Artisanal plate ready!”
                        </span>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-clay hover:bg-clay/90 text-cream px-5 py-2.5 text-xs font-bold rounded border-2 border-charcoal sketch-shadow cursor-pointer transition-all hover:-translate-y-0.5 flex items-center space-x-1.5"
                        >
                          <span>Configure Volume</span>
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
                  className="space-y-6"
                >
                <span className="font-sans text-xs text-charcoal/60 font-bold block uppercase tracking-widest">
                  [2/3] Specify volume & attach layouts:
                </span>

                {/* Grid inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Quantity with limits */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1 flex justify-between">
                      <span>Order Quantity ({selectedProduct.unitLabel})</span>
                      <span className="text-clay text-xs font-bold font-mono">Min: {selectedProduct.minQty}</span>
                    </label>
                    <input
                      id="config-print-qty"
                      type="number"
                      min={selectedProduct.minQty}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                    />
                    {quantity < selectedProduct.minQty && (
                      <span className="text-terracotta text-xxs mt-1 font-bold">
                        Under product budget minimum. Resetting to {selectedProduct.minQty} before checkout calculation.
                      </span>
                    )}
                  </div>

                  {/* Size / Dimensions option */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">
                      Preferred Sizes & Layout dimensions
                    </label>
                    <input
                      id="config-print-sizes"
                      type="text"
                      value={customDimension}
                      onChange={(e) => setCustomDimension(e.target.value)}
                      placeholder="E.g., 5 Large, 12 Medium | 100cm x 50cm"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                    />
                  </div>

                </div>

                {/* DRAG AND DROP VECTOR UPLOAD */}
                <div className="space-y-2">
                  <label className="font-sans text-xs sm:text-sm font-bold text-charcoal block">
                    Upload Design File
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed border-charcoal rounded-xl p-8 text-center transition-all relative ${
                      isDragging ? 'bg-sand/60 border-clay scale-[1.01]' : 'bg-beige/40 hover:bg-beige/60'
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
                      <div className="space-y-3">
                        <UploadCloud className="w-12 h-12 text-charcoal/50 mx-auto stroke-[1.2]" />
                        <div>
                          <p className="font-sans text-sm font-bold text-charcoal">
                            Drag and drop Vector Layout files here or browse files
                          </p>
                          <p className="font-sans text-xxs text-charcoal/50 mt-1 max-w-sm mx-auto">
                            Requires PNG, JPG, PDF, AI, or SVG parameters. Maximum size limit is 25MB under standard client guidelines.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div id="file-ready-preview" className="space-y-4 animate-scale-in">
                        {/* If previewable */}
                        {designFile.type.startsWith('image/') ? (
                          <img
                            src={designFile.previewUrl}
                            alt="Preview layout"
                            className="bg-white border text-center border-charcoal/20 max-h-36 max-w-xs mx-auto object-contain rounded p-2"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="bg-white border-2 border-charcoal/20 w-16 h-16 rounded mx-auto flex items-center justify-center">
                            <span className="font-mono font-bold text-xs text-clay">PDF/AI</span>
                          </div>
                        )}

                        <div className="flex items-center justify-center space-x-3 bg-white p-2.5 border border-charcoal/20 rounded-md max-w-md mx-auto">
                          <div className="text-left truncate min-w-0">
                            <span className="font-mono text-xs font-bold text-charcoal block truncate">
                              {designFile.name}
                            </span>
                            <span className="font-sans text-xxs text-charcoal/50 block">
                              {designFile.size} KB • Type: {designFile.type || 'Vector Spec'}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveFile();
                            }}
                            className="p-1.5 border border-charcoal/20 hover:border-terracotta hover:text-terracotta rounded transition-colors bg-beige/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div id="upload-alert" className="bg-red-50 text-red-800 text-xs p-3 rounded-lg flex items-start space-x-2.5 border border-red-200">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Additional Spec notes */}
                <div className="flex flex-col">
                  <label className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1">
                    Custom production notes or special instructions (Ink choice, bleed etc.)
                  </label>
                  <textarea
                    id="config-print-notes"
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="E.g. We would prefer white water-based silkscreen inks on organic black textiles. Standard sizing."
                    className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white resize-none"
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
                  <form id="print-billing-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
                <span className="font-sans text-xs text-charcoal/60 font-bold block uppercase tracking-widest">
                  [3/3] Secure SSL Checkout Gate:
                </span>

                <div className="bg-[#eef5ed] border-2 border-green-800/20 p-4 rounded-xl flex items-start space-x-3 text-emerald-950">
                  <Lock className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block">Encrypted payment gateway active</span>
                    <p className="text-emerald-900/80 mt-0.5">
                      This order summary has been checked against print inventory codes. Proceed to seal checkout.
                    </p>
                  </div>
                </div>

                {/* Card input field */}
                <div className="space-y-3.5">
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Cardholder Name</label>
                    <input
                      id="card-holder-input"
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Jane Doe"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Credit Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-5 h-5 text-charcoal/40 absolute left-3 top-3" />
                      <input
                        id="card-number-input"
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        placeholder="4111 8888 2222 3912"
                        className="bg-beige border-2 border-charcoal p-2.5 pl-10 rounded text-sm focus:outline-none focus:bg-white w-full font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1">Expiry Date</label>
                      <input
                        id="card-expiry-input"
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white font-mono"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1">CVV / Security</label>
                      <input
                        id="card-cvv-input"
                        type="password"
                        required
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g,''))}
                        placeholder="***"
                        className="bg-beige border-2 border-charcoal p-2.5 rounded text-sm focus:outline-none focus:bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* GDPR */}
                  <div className="flex items-start pt-1">
                    <input
                      id="card-gdpr-check"
                      type="checkbox"
                      required
                      checked={consentGdpr}
                      onChange={(e) => setConsentGdpr(e.target.checked)}
                      className="mt-1 mr-2 p-1 border-2 border-charcoal text-clay"
                    />
                    <span className="font-sans text-xxs text-charcoal/60 leading-tight">
                      Yes, I consent to secure card processing in accordance with PCI-DSS guidelines. Invoice PDF will be sent to the contact address parameters.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="submit-payment-btn"
                    type="submit"
                    disabled={submittingOrder}
                    className="bg-emerald-800 hover:bg-emerald-900 text-cream w-full py-4 text-sm font-bold border-2 border-charcoal sketch-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                  >
                    {submittingOrder ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sealing Encrypted Handshakes...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 fill-current mr-1" />
                        <span>Settle Order Deposition: ${total.toFixed(2)}</span>
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
              <div className="pt-4 border-t border-charcoal/10 flex justify-start">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 hover:bg-sand/40 text-charcoal text-xs font-bold flex items-center space-x-1.5 transition-colors border border-transparent rounded-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go back</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Simple Price Estimation summary */}
          <div className="w-full lg:w-80 bg-beige/30 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="font-mono text-xxs font-bold text-charcoal/40 uppercase tracking-widest block">
                Live Pricing Ledger
              </span>

              <div className="border-b-2 border-dashed border-charcoal/20 pb-4">
                <h4 className="font-serif text-xl font-bold text-charcoal truncate">
                  {actualProductLabel}
                </h4>
                <p className="font-sans text-xs text-charcoal/60 mt-1">
                  Selected model budget configuration.
                </p>
              </div>

              {/* Calc List */}
              <div className="space-y-3.5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Base unit cost:</span>
                  <span className="text-charcoal font-bold">${unitPrice.toFixed(2)} / unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Batch Quantity:</span>
                  <span className="text-charcoal font-bold">{Math.max(quantity, selectedProduct.minQty)} {selectedProduct.unitLabel}</span>
                </div>
                {quantity >= 200 && (
                  <div className="flex justify-between text-clay font-bold">
                    <span>Bulk discount tier:</span>
                    <span>-{quantity >= 500 ? '20%' : '10%'} off</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-charcoal/10 pt-2.5">
                  <span className="text-charcoal/60">Press Setup & Plate Fee:</span>
                  <span className="text-charcoal font-bold">${setupFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-charcoal mt-6">
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-serif font-black text-charcoal text-base">Calculated Total:</span>
                <span className="font-serif font-black text-charcoal text-3xl">
                  ${total.toFixed(2)}
                </span>
              </div>

              {currentStep === 2 && (
                <button
                  id="printing-configurator-next"
                  onClick={handleNextStep}
                  className="bg-clay hover:bg-clay/90 text-cream w-full py-3 text-xs sm:text-sm font-bold border-2 border-charcoal sketch-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
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
