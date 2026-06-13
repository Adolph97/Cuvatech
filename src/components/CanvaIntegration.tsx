import React, { useState } from 'react';
import { Layout, Share2, UploadCloud, AlertCircle, CheckCircle, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders } from '../OrderStore';
import { DesignFile } from '../types';

interface CanvaTemplate {
  id: string; title: string; category: string; preview: React.ReactNode;
}

const TEMPLATES: CanvaTemplate[] = [
  { id: 't-retro', title: 'Retro Organic Seal', category: 'Branding / Vintage Accent', preview: <svg className="w-16 h-16 text-primary mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" /><polygon points="50,22 58,40 76,40 62,52 68,70 50,58 32,70 38,52 24,40 42,40" stroke="currentColor" strokeWidth="2.5" /><path d="M28 50h44" stroke="currentColor" strokeWidth="1.5" /></svg> },
  { id: 't-nordic', title: 'Nordic Grid Lettermark', category: 'Minimal Editorial', preview: <svg className="w-16 h-16 text-charcoal mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="2" /><path d="M25 50h50M50 25v50M25 25l50 50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" /><text x="50" y="55" fontFamily="Plus Jakarta Sans" fontSize="24" fontWeight="bold" textAnchor="middle" fill="currentColor">C</text></svg> },
  { id: 't-botanical', title: 'Handdrawn Botanical', category: 'Organic / Craft Identity', preview: <svg className="w-16 h-16 text-primary mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><path d="M50 85C50 85 20 60 20 40C20 20 35 15 50 35C65 15 80 20 80 40C80 60 50 85 50 85Z" stroke="currentColor" strokeWidth="2" /><path d="M50 35v45" stroke="currentColor" strokeWidth="1.5" /><path d="M50 50c5-5 15-5 15-5" stroke="currentColor" strokeWidth="1.5" /><path d="M50 62c-5-5-15-5-15-5" stroke="currentColor" strokeWidth="1.5" /></svg> },
  { id: 't-geo', title: 'Symmetrical Wireframe', category: 'Modern SaaS / Fintech', preview: <svg className="w-16 h-16 text-charcoal mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><polygon points="50,15 80,35 80,68 50,88 20,68 20,35" stroke="currentColor" strokeWidth="2" /><polygon points="50,25 72,40 72,62 50,78 28,62 28,40" stroke="currentColor" strokeWidth="1.5" /><line x1="50" y1="15" x2="50" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" /></svg> }
];

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

export default function CanvaIntegration() {
  const { addOrder } = useOrders();
  const [status, setStatus] = useState({ connected: false, connecting: false, submitted: false, error: '' });
  const [form, setForm] = useState({ name: '', email: '', brandGoal: '', colors: 'Warm Earth tones' });
  const [assets, setAssets] = useState<{ template: CanvaTemplate | null, file: DesignFile | null }>({ template: null, file: null });

  const updateStatus = (updates: Partial<typeof status>) => setStatus(s => ({ ...s, ...updates }));
  const updateForm = (updates: Partial<typeof form>) => setForm(f => ({ ...f, ...updates }));

  const handleConnect = () => {
    updateStatus({ connecting: true });
    setTimeout(() => updateStatus({ connecting: false, connected: true }), 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) return updateStatus({ error: 'File exceeds 25MB standard budget limit.' });
    
    updateStatus({ error: '' });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAssets(a => ({ 
        ...a, 
        file: { 
          name: file.name, 
          size: Math.round(file.size / 1024), 
          type: file.type, 
          previewUrl: URL.createObjectURL(file),
          base64: reader.result as string
        } 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return updateStatus({ error: 'Please provide your name and email.' });
    
    addOrder({
      type: 'Branding',
      customerName: form.name,
      customerEmail: form.email,
      details: {
        goal: form.brandGoal,
        palette: form.colors,
        template: assets.template?.title,
        fileName: assets.file?.name,
        fileData: assets.file?.base64
      }
    });

    updateStatus({ error: '', submitted: true });
  };

  const handleReset = () => {
    setStatus({ connected: status.connected, connecting: false, submitted: false, error: '' });
    setForm({ name: '', email: '', brandGoal: '', colors: 'Warm Earth tones' });
    setAssets({ template: null, file: null });
  };

  return (
    <motion.div 
      id="canva-integration-sub" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="bg-primary/5 border border-charcoal/5 rounded-[2.5rem] shadow-xl p-8 sm:p-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row gap-16 relative z-10">
        
        {/* Left Side: Canva Connector Widget */}
        <motion.div variants={fadeInUp} className="w-full lg:w-1/2 space-y-10">
          <div className="flex items-center space-x-5">
            <span className="p-4 bg-white border border-charcoal/5 rounded-[1.5rem] shadow-sm">
              <Share2 className="w-10 h-10 text-primary" />
            </span>
            <div>
              <span className="font-sans font-bold text-xs text-primary block tracking-[0.2em] uppercase mb-1">Connected Workspace</span>
              <h4 className="font-display text-3xl font-extrabold text-charcoal leading-none">Canva Studio</h4>
            </div>
          </div>

          <p className="font-sans text-base text-charcoal/60 leading-relaxed max-w-lg">
            Link your Canva master folder seamlessly. Our designers can inspect your current design drafts 
            and brand outlines directly from the platform.
          </p>

          <AnimatePresence mode="wait">
            {!status.connected ? (
              <motion.div 
                key="canva-auth"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur-md border border-charcoal/5 p-10 rounded-[2rem] text-center space-y-8 shadow-xl shadow-charcoal/5"
              >
                <div className="w-20 h-20 bg-primary/5 border-2 border-dashed border-primary/20 rounded-full mx-auto flex items-center justify-center">
                  <Layout className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h5 className="font-display font-bold text-charcoal text-xl">Authorize Integration</h5>
                  <p className="font-sans text-sm text-charcoal/40 max-w-xs mx-auto font-medium leading-relaxed">
                    Authorize the secure Cuva Tech App callback to associate your draft assets.
                  </p>
                </div>

                <button 
                  id="connect-canva-btn" 
                  onClick={handleConnect} 
                  disabled={status.connecting} 
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-3 mx-auto disabled:opacity-50"
                >
                  {status.connecting ? (
                    <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Authenticating...</span></>
                  ) : (
                    <><Layout className="w-5 h-5" /><span>Authorize Canva</span></>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="canva-connected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                id="canva-connected-view" 
                className="bg-white/90 backdrop-blur-md border border-charcoal/5 p-8 rounded-[2rem] space-y-8 shadow-xl shadow-charcoal/5"
              >
                <div className="flex items-center justify-between border-b border-charcoal/5 pb-5">
                  <div className="flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-sans text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">Live Connection</span>
                  </div>
                  <button onClick={() => updateStatus({ connected: false })} className="font-sans text-[10px] text-primary hover:underline font-bold uppercase tracking-wider cursor-pointer">Disconnect</button>
                </div>

                <div className="space-y-4">
                  <span className="font-sans text-[10px] text-charcoal/20 block font-bold uppercase tracking-[0.2em]">Select Canva Draft:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                    {TEMPLATES.map((item) => (
                      <motion.button
                        key={item.id} id={`canva-tpl-${item.id}`}
                        onClick={() => setAssets(a => ({ ...a, template: item }))}
                        whileHover={{ y: -5 }}
                        className={`text-left p-6 rounded-2xl border transition-all flex flex-col justify-between h-44 cursor-pointer shadow-sm ${
                          assets.template?.id === item.id ? 'border-primary bg-primary/5 text-primary' : 'border-charcoal/5 hover:border-primary/20 bg-white text-charcoal'
                        }`}
                      >
                        <div className="flex-1 flex items-center justify-center">{item.preview}</div>
                        <div className="border-t border-charcoal/5 pt-4 mt-3">
                          <span className="font-bold block truncate text-xs">{item.title}</span>
                          <span className="text-[9px] text-charcoal/40 block truncate font-bold uppercase tracking-widest mt-1">{item.category}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Side: Design Parameters & Quote Form */}
        <motion.div variants={fadeInUp} className="w-full lg:w-1/2 bg-white border border-charcoal/5 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-charcoal/5 self-start lg:sticky lg:top-32">
          <div className="border-b border-charcoal/5 pb-8 mb-10">
            <h5 className="font-display text-3xl font-extrabold text-charcoal leading-none">Brief Specifications</h5>
            <span className="font-hand font-bold text-primary text-xl block mt-2 opacity-80 rotate-[-1deg]">Let us synthesize your brand coordinates</span>
          </div>

          {!status.submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <AnimatePresence>
                {assets.template && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    id="imported-tag" 
                    className="bg-primary/5 border border-primary/10 p-5 rounded-2xl flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-full text-primary shadow-sm"><Check className="w-4 h-4" /></div>
                      <span className="font-sans text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Linked: <span className="text-primary italic font-extrabold ml-1">{assets.template.title}</span></span>
                    </div>
                    <button type="button" onClick={() => setAssets(a => ({ ...a, template: null }))} className="font-bold font-sans text-[10px] text-charcoal/20 hover:text-primary transition-colors cursor-pointer tracking-widest uppercase">Clear</button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['Name', 'Email'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">{field}</label>
                    <input
                      id={`canva-form-${field.toLowerCase()}`} type={field === 'Email' ? 'email' : 'text'} required
                      value={form[field.toLowerCase() as keyof typeof form]}
                      onChange={(e) => updateForm({ [field.toLowerCase()]: e.target.value })}
                      placeholder={field === 'Email' ? "brand@scribe.co" : "Jane Doe"}
                      className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Brand goal & target audience</label>
                <textarea
                  id="canva-form-goal" rows={3} value={form.brandGoal}
                  onChange={(e) => updateForm({ brandGoal: e.target.value })}
                  placeholder="E.g. High-end eco-friendly apparel line targeting millennial designers."
                  className="w-full bg-bg border-none px-6 py-5 rounded-[1.5rem] text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Preferred Palette Vibe</label>
                <select id="canva-form-palette" value={form.colors} onChange={(e) => updateForm({ colors: e.target.value })} className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer font-bold text-charcoal appearance-none">
                  {['Warm Earth tones', 'Minimal Noir', 'Solar Brights', 'Boreal Greens'].map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-charcoal/5 border-dashed p-8 rounded-[2rem] bg-bg/50 relative group hover:bg-bg transition-all text-center">
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-[1.25rem] border border-charcoal/5 shadow-sm group-hover:scale-110 transition-transform inline-block">
                    <UploadCloud className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-charcoal block text-sm">Manual artwork fallback</span>
                    <span className="font-sans text-[10px] text-charcoal/30 block font-bold uppercase mt-1 tracking-widest">PNG, SVG, PDF up to 25MB</span>
                  </div>
                </div>
                <input id="canva-fallback-upload" type="file" onChange={handleFileUpload} accept=".png,.svg,.pdf,.ai,.jpg" className="absolute inset-0 opacity-0 cursor-pointer" />
                {assets.file && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white p-4 border border-charcoal/5 rounded-2xl text-[10px] flex items-center justify-between shadow-xl shadow-charcoal/5">
                    <span className="font-mono text-charcoal/40 font-bold truncate pr-4">{assets.file.name}</span>
                    <span className="text-primary font-bold font-sans tracking-widest uppercase">Ready</span>
                  </motion.div>
                )}
              </div>

              {status.error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-primary/5 text-primary text-xs p-5 rounded-2xl flex items-center space-x-3 border border-primary/10">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-bold">{status.error}</span>
                </motion.div>
              )}

              <button id="submit-logo-brief" type="submit" className="bg-primary text-white w-full py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 cursor-pointer">
                <span>Submit Briefing</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-10">
              <div className="p-8 bg-primary/10 border border-primary/20 rounded-full inline-block text-primary animate-bounce shadow-inner">
                <CheckCircle className="w-16 h-16" />
              </div>
              <div className="space-y-4">
                <h6 className="font-display text-3xl font-extrabold text-charcoal leading-none">Parameters Lodged!</h6>
                <p className="font-sans text-base text-charcoal/50 leading-relaxed max-w-sm mx-auto font-medium">
                  Excellent work {form.name}, we are putting together structural suggestions now.
                </p>
              </div>
              
              <button id="reset-brief-btn" onClick={handleReset} className="bg-bg border border-charcoal/10 text-charcoal px-10 py-5 rounded-2xl font-bold text-sm hover:bg-white transition-all shadow-sm cursor-pointer">
                Log another brief
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
