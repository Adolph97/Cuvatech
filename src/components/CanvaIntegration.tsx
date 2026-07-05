import React, { useState, useRef } from 'react';
import { Palette, ExternalLink, Upload, X, AlertTriangle, CheckCircle, Box, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders } from '../OrderStore';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function CanvaIntegration() {
  const { addOrder } = useOrders();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const processFile = (file: File) => {
    const validFormats = ['.png', '.jpg', '.jpeg', '.pdf', '.ai', '.svg'];
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!validFormats.includes(extension) && !validFormats.includes(extension + 'eg')) {
      setUploadError(`Unrecognized file format (${extension}). Please upload PNG, JPG, PDF, AI, or SVG formats.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB limit. Please compress your logo file.');
      return;
    }

    setUploadError('');
    setDesignFile(file);

    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setDesignFile(null);
    setPreviewUrl(null);
  };

  const handleLogoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designFile) return;

    try {
      const formData = new FormData();
      formData.append('file', designFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        await addOrder({
          type: 'Branding',
          customerName: 'Logo Upload',
          customerEmail: 'logo@upload.cuvatech.com',
          details: {
            logoFile: uploadData.name,
            logoUrl: uploadData.url,
            fileType: uploadData.type
          }
        });
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          handleRemoveFile();
        }, 3000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setUploadError('Failed to upload logo. Please try again.');
    }
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="bg-white border border-charcoal/5 rounded-[2rem] p-8 sm:p-12 max-w-4xl mx-auto shadow-lg"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-primary/5 rounded-[1.5rem]">
          <Palette className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
          Logo & Graphics Studio
        </h3>
      </div>

      <p className="font-sans text-base text-charcoal/60 leading-relaxed mb-8">
        Upload your logo designs or connect Canva projects directly. We support PNG, JPG, SVG, PDF, and AI formats.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-bg border border-charcoal/5 p-6 rounded-2xl">
          <ExternalLink className="w-5 h-5 text-primary mb-3" />
          <h4 className="font-display font-bold text-charcoal mb-2">Share Canva Links</h4>
          <p className="font-sans text-sm text-charcoal/60">
            Provide Canva share links for your logos, posters, and marketing materials.
          </p>
        </div>

        <div className="bg-bg border border-charcoal/5 p-6 rounded-2xl">
          <Box className="w-5 h-5 text-primary mb-3" />
          <h4 className="font-display font-bold text-charcoal mb-2">Print Ready</h4>
          <p className="font-sans text-sm text-charcoal/60">
            Minimum order: 10kg. Standard delivery fee applies.
          </p>
        </div>
      </div>

      {/* Logo Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-[2rem] p-8 text-center transition-all ${
          isDragging ? 'bg-primary/5 border-primary scale-[1.02]' : 'bg-bg border-charcoal/5 hover:border-primary/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) processFile(files[0]);
          }}
          accept=".png,.jpg,.jpeg,.pdf,.ai,.svg"
          className="hidden"
        />

        {uploadSuccess ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-full inline-block">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <p className="font-display text-lg font-bold text-charcoal">Logo Uploaded!</p>
            <p className="font-sans text-sm text-charcoal/50">We'll review your design and contact you shortly.</p>
          </div>
        ) : !designFile ? (
          <div className="space-y-5">
            <div className="p-4 bg-primary/5 rounded-full inline-block animate-pulse">
              <Upload className="w-12 h-12 text-primary" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-charcoal">Drag & Drop Your Logo</p>
              <p className="font-sans text-xs text-charcoal/30 mt-2 max-w-sm mx-auto font-medium">
                PNG, JPG, SVG, PDF, or AI format • Maximum 25MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              Select File
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {previewUrl ? (
              <div className="p-3 bg-white border border-charcoal/5 rounded-[1.5rem] inline-block shadow-sm max-w-xs">
                <img src={previewUrl} alt="Logo Preview" className="max-h-40 max-w-full object-contain rounded-xl" />
              </div>
            ) : (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-[1.5rem] inline-block">
                <Tag className="w-10 h-10 text-primary" />
              </div>
            )}
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-charcoal/5 px-4 py-2 rounded-xl text-xs font-bold hover:bg-bg transition-all cursor-pointer"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-all cursor-pointer"
              >
                Remove
              </button>
            </div>
            <button
              onClick={handleLogoSubmit}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              Submit Logo
            </button>
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 max-w-sm mx-auto">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="font-sans text-xs text-red-600 font-medium">{uploadError}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}