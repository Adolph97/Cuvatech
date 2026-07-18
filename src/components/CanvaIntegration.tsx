import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CloudUpload,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useOrders } from '../OrderStore';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function CanvaIntegration() {
  const { addOrder } = useOrders();

  const [canvaUrl, setCanvaUrl] = useState('https://www.canva.com/');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [briefForm, setBriefForm] = useState({ name: '', email: '', note: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read the configurable Canva URL (create page or template link) from public settings.
  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data?.canva?.createUrl) setCanvaUrl(data.canva.createUrl);
      })
      .catch(() => { /* keep default */ });
  }, []);

  const handleBriefChange = (field: keyof typeof briefForm, value: string) => {
    setBriefForm((current) => ({ ...current, [field]: value }));
    if (uploadError) setUploadError('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFile(files[0]);
  };

  const processFile = (file: File) => {
    const validFormats = ['.png', '.jpg', '.jpeg', '.pdf', '.ai', '.svg'];
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!validFormats.includes(extension)) {
      setUploadError(`Unrecognized file format (${extension}). Please upload PNG, JPG, PDF, AI, or SVG.`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB limit. Please compress your design file.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadError('');
    setDesignFile(file);
    setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setDesignFile(null);
    setPreviewUrl(null);
  };

  const resetForm = () => {
    handleRemoveFile();
    setBriefForm({ name: '', email: '', note: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!briefForm.name.trim() || !briefForm.email.trim()) {
      setUploadError('Add your name and email so we can match this design to you.');
      return;
    }
    if (!designFile) {
      setUploadError('Attach the design you downloaded from Canva.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', designFile);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData: { name: string; url: string; type: string } = await uploadRes.json();

      await addOrder({
        type: 'Branding',
        customerName: briefForm.name.trim(),
        customerEmail: briefForm.email.trim(),
        details: {
          requestType: 'Canva design upload',
          note: briefForm.note.trim(),
          logoFile: uploadData.name,
          logoUrl: uploadData.url,
          fileType: uploadData.type
        }
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        resetForm();
      }, 3000);
    } catch {
      setUploadError('Failed to submit your design. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="max-w-3xl mx-auto overflow-hidden rounded-[2.5rem] bg-white border border-charcoal/5 shadow-2xl shadow-charcoal/5"
    >
      {/* Step 1 — Design in Canva */}
      <section className="px-6 py-10 sm:px-12 sm:py-12 bg-[#f6f3f1] text-center">
        <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary block">
          Step 1 — Create
        </span>
        <h3 className="font-display text-3xl font-extrabold text-charcoal leading-tight mt-2">
          Design your artwork in Canva
        </h3>
        <p className="font-sans text-base text-charcoal/55 leading-relaxed max-w-xl mx-auto mt-4">
          Open Canva in a new tab, design your logo or graphic, and download the finished file to your device.
          When you're done, come back here and upload it below.
        </p>

        <a
          href={canvaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 mt-8 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
        >
          <span>Design in Canva</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      {/* Step 2 — Upload your design */}
      <section className="px-6 py-10 sm:px-12 sm:py-12">
        <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary block">
          Step 2 — Upload
        </span>
        <h3 className="font-display text-3xl font-extrabold text-charcoal leading-tight mt-2">
          Send us your finished design
        </h3>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">
                Name
              </label>
              <input
                type="text"
                value={briefForm.name}
                onChange={(e) => handleBriefChange('name', e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-[#f8f5f0] border border-transparent px-5 py-4 rounded-2xl text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                type="email"
                value={briefForm.email}
                onChange={(e) => handleBriefChange('email', e.target.value)}
                placeholder="brand@scribe.co"
                className="w-full bg-[#f8f5f0] border border-transparent px-5 py-4 rounded-2xl text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">
              Note <span className="text-charcoal/20">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={briefForm.note}
              onChange={(e) => handleBriefChange('note', e.target.value)}
              placeholder="Anything we should know about this design?"
              className="w-full bg-[#f8f5f0] border border-transparent p-5 rounded-[1.5rem] text-sm font-medium text-charcoal outline-none resize-none focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-[2rem] min-h-[184px] p-6 flex items-center justify-center text-center transition-all ${
              isDragging ? 'bg-primary/5 border-primary scale-[1.01]' : 'bg-white border-charcoal/10 hover:border-primary/25'
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

            {designFile ? (
              <div className="w-full space-y-4">
                {previewUrl ? (
                  <div className="bg-[#f8f5f0] border border-charcoal/5 rounded-2xl p-3 inline-block">
                    <img src={previewUrl} alt="Design preview" className="max-h-28 max-w-full object-contain rounded-xl" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mx-auto border border-primary/10">
                    <Sparkles className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <p className="font-mono text-xs font-bold text-charcoal break-all">{designFile.name}</p>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-charcoal/30 mt-1">
                    {Math.round(designFile.size / 1024)} KB
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-bg border border-charcoal/5 text-charcoal px-4 py-2 rounded-xl text-xs font-bold hover:bg-white transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-4"
              >
                <span className="w-16 h-16 rounded-2xl bg-white border border-charcoal/5 shadow-lg shadow-charcoal/5 flex items-center justify-center text-primary">
                  <CloudUpload className="w-8 h-8" />
                </span>
                <span>
                  <span className="font-display text-sm font-extrabold text-charcoal block">Upload your Canva design</span>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-charcoal/30 block mt-2">
                    PNG, JPG, SVG, PDF up to 25MB
                  </span>
                </span>
              </button>
            )}
          </div>

          {uploadError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="font-sans text-xs text-red-600 font-bold">{uploadError}</p>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              <p className="font-sans text-xs text-green-700 font-bold">Design submitted — we'll be in touch shortly.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            <span>{submitting ? 'Submitting...' : 'Submit Design'}</span>
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </section>
    </motion.div>
  );
}
