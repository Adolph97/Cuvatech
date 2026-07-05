import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CloudUpload,
  ExternalLink,
  Network,
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

const canvaDrafts = [
  {
    id: 'retro-organic-seal',
    title: 'Retro Organic Seal',
    category: 'Branding / Vintage Accent',
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
        <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" />
        <path d="M40 17l6.5 14 15.2 1.8-11.2 10.4 3 15.1L40 50.9 26.5 58.3l3-15.1-11.2-10.4L33.5 31 40 17z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M28 39h24" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'nordic-grid-lettermark',
    title: 'Nordic Grid Lettermark',
    category: 'Minimal Editorial',
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
        <rect x="25" y="22" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M25 37h30M40 22v30M29 26l22 22" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <text x="35" y="44" className="font-display" fontSize="18" fontWeight="800" fill="currentColor">C</text>
      </svg>
    )
  },
  {
    id: 'handdrawn-botanical',
    title: 'Handdrawn Botanical',
    category: 'Organic / Craft Identity',
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
        <path d="M40 59C27 47 22 39 23 31c1-7 9-10 17-3 8-7 16-4 17 3 1 8-4 16-17 28z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M40 28v31M29 39l11 7M52 38l-12 8" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    )
  },
  {
    id: 'symmetrical-wireframe',
    title: 'Symmetrical Wireframe',
    category: 'Modern SaaS / Fintech',
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
        <path d="M40 17l20 12v22L40 63 20 51V29l20-12z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M40 25l13 8v14l-13 8-13-8V33l13-8zM40 17v8M40 55v8M20 29l7 4M53 47l7 4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </svg>
    )
  }
];

const paletteOptions = [
  'Warm Earth tones',
  'Blue and graphite',
  'Minimal black and white',
  'Fresh green and cream',
  'Bold high-contrast color'
];

export default function CanvaIntegration() {
  const { addOrder } = useOrders();
  const [isConnected, setIsConnected] = useState(true);
  const [selectedDraftId, setSelectedDraftId] = useState(canvaDrafts[0].id);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [briefForm, setBriefForm] = useState({
    name: '',
    email: '',
    brandGoal: '',
    paletteVibe: paletteOptions[0]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedDraft = useMemo(
    () => canvaDrafts.find((draft) => draft.id === selectedDraftId) || canvaDrafts[0],
    [selectedDraftId]
  );

  const handleBriefChange = (field: keyof typeof briefForm, value: string) => {
    setBriefForm((current) => ({ ...current, [field]: value }));
    if (uploadError) setUploadError('');
  };

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

    if (!validFormats.includes(extension)) {
      setUploadError(`Unrecognized file format (${extension}). Please upload PNG, JPG, PDF, AI, or SVG formats.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB limit. Please compress your logo file.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setUploadError('');
    setDesignFile(file);
    setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setDesignFile(null);
    setPreviewUrl(null);
  };

  const resetForm = () => {
    handleRemoveFile();
    setBriefForm({
      name: '',
      email: '',
      brandGoal: '',
      paletteVibe: paletteOptions[0]
    });
    setSelectedDraftId(canvaDrafts[0].id);
    setIsConnected(true);
  };

  const handleLogoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasCanvaDraft = isConnected && selectedDraft;
    const hasBrief = briefForm.brandGoal.trim();

    if (!briefForm.name.trim() || !briefForm.email.trim()) {
      setUploadError('Add your name and email so we can sync this branding brief.');
      return;
    }

    if (!hasBrief && !designFile && !hasCanvaDraft) {
      setUploadError('Select a Canva draft, write the brand goal, or attach artwork.');
      return;
    }

    setSubmitting(true);

    try {
      let uploadData: { name: string; url: string; type: string } | null = null;

      if (designFile) {
        const formData = new FormData();
        formData.append('file', designFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error('Upload failed');
        }

        uploadData = await uploadRes.json();
      }

      await addOrder({
        type: 'Branding',
        customerName: briefForm.name.trim(),
        customerEmail: briefForm.email.trim(),
        details: {
          requestType: designFile ? 'Canva studio brief with attachment' : 'Canva studio brief',
          canvaConnection: isConnected ? 'Connected workspace' : 'Manual brief',
          selectedCanvaDraft: isConnected ? selectedDraft.title : '',
          selectedDraftCategory: isConnected ? selectedDraft.category : '',
          brandGoal: briefForm.brandGoal.trim(),
          paletteVibe: briefForm.paletteVibe,
          ...(uploadData ? {
            logoFile: uploadData.name,
            logoUrl: uploadData.url,
            fileType: uploadData.type
          } : {})
        }
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        resetForm();
      }, 3000);
    } catch (err) {
      setUploadError('Failed to submit the branding brief. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      onSubmit={handleLogoSubmit}
      className="max-w-7xl mx-auto overflow-hidden rounded-[2.5rem] bg-white border border-charcoal/5 shadow-2xl shadow-charcoal/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="bg-[#f6f3f1] px-6 py-8 sm:px-10 md:px-14 lg:px-16 lg:py-14">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-white border border-charcoal/5 shadow-lg shadow-charcoal/5 flex items-center justify-center text-primary">
              <Network className="w-8 h-8" />
            </div>
            <div>
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary block">
                Connected Workspace
              </span>
              <h3 className="font-display text-3xl font-extrabold text-charcoal leading-tight">
                Canva Studio
              </h3>
            </div>
          </div>

          <p className="font-sans text-base text-charcoal/55 leading-relaxed max-w-xl mt-10">
            Link your Canva master folder seamlessly. Our designers can inspect your current design drafts and brand outlines directly from the platform.
          </p>

          <div className="bg-white rounded-[2rem] border border-charcoal/5 shadow-2xl shadow-charcoal/10 mt-12 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-charcoal/5 pb-6">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-charcoal/20'}`} />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/35">
                  {isConnected ? 'Live Connection' : 'Manual Mode'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsConnected((current) => !current)}
                className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-primary hover:text-charcoal transition-colors"
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            <div className="pt-8">
              <span className="font-sans text-[10px] font-extrabold uppercase tracking-[0.28em] text-charcoal/20 block">
                Select Canva Draft
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {canvaDrafts.map((draft) => {
                  const selected = selectedDraftId === draft.id && isConnected;

                  return (
                    <button
                      key={draft.id}
                      type="button"
                      onClick={() => {
                        setIsConnected(true);
                        setSelectedDraftId(draft.id);
                      }}
                      className={`text-left rounded-2xl border bg-white p-5 transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-lg ${
                        selected ? 'border-primary ring-2 ring-primary/10' : 'border-charcoal/5 hover:border-primary/20'
                      }`}
                    >
                      <div className={`h-24 flex items-center justify-center ${selected ? 'text-primary' : 'text-charcoal'}`}>
                        {draft.icon}
                      </div>
                      <div className="border-t border-charcoal/5 pt-4">
                        <span className="font-display text-sm font-extrabold text-charcoal block">
                          {draft.title}
                        </span>
                        <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-charcoal/35 block mt-1">
                          {draft.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 md:px-14 lg:px-16 lg:py-14">
          <div>
            <h3 className="font-display text-3xl font-extrabold text-charcoal leading-tight">
              Brief Specifications
            </h3>
            <p className="font-hand text-2xl text-primary font-bold mt-2 rotate-[-1deg]">
              Let us synthesize your brand coordinates
            </p>
          </div>

          <div className="border-t border-charcoal/5 mt-9 pt-9 space-y-7">
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
                Brand Goal & Target Audience
              </label>
              <textarea
                rows={4}
                value={briefForm.brandGoal}
                onChange={(e) => handleBriefChange('brandGoal', e.target.value)}
                placeholder="E.g. High-end eco-friendly apparel line targeting millennial designers."
                className="w-full bg-[#f8f5f0] border border-transparent p-5 rounded-[1.5rem] text-sm font-medium text-charcoal outline-none resize-none focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">
                Preferred Palette Vibe
              </label>
              <select
                value={briefForm.paletteVibe}
                onChange={(e) => handleBriefChange('paletteVibe', e.target.value)}
                className="w-full bg-[#f8f5f0] border border-transparent px-5 py-4 rounded-2xl text-sm font-bold text-charcoal outline-none focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 appearance-none"
              >
                {paletteOptions.map((palette) => (
                  <option key={palette} value={palette}>{palette}</option>
                ))}
              </select>
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
                      <img src={previewUrl} alt="Manual artwork preview" className="max-h-28 max-w-full object-contain rounded-xl" />
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
                    <span className="font-display text-sm font-extrabold text-charcoal block">Manual artwork fallback</span>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-charcoal/30 block mt-2">
                      PNG, SVG, PDF up to 25MB
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
                <p className="font-sans text-xs text-green-700 font-bold">Branding brief synced to the backend.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span>{submitting ? 'Syncing Brief...' : 'Submit Briefing'}</span>
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <a
              href="https://www.canva.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold uppercase tracking-widest text-charcoal/30 hover:text-primary flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Canva workspace
            </a>
          </div>
        </section>
      </div>
    </motion.form>
  );
}
