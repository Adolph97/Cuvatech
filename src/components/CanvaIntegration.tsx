import React, { useState } from 'react';
import { Layout, Share2, UploadCloud, AlertCircle, CheckCircle, ArrowRight, Check } from 'lucide-react';
import { DesignFile } from '../types';

interface CanvaTemplate {
  id: string; title: string; category: string; preview: React.ReactNode;
}

const TEMPLATES: CanvaTemplate[] = [
  { id: 't-retro', title: 'Retro Organic Seal', category: 'Branding / Vintage Accent', preview: <svg className="w-16 h-16 text-primary mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" /><polygon points="50,22 58,40 76,40 62,52 68,70 50,58 32,70 38,52 24,40 42,40" stroke="currentColor" strokeWidth="2.5" /><path d="M28 50h44" stroke="currentColor" strokeWidth="1.5" /></svg> },
  { id: 't-nordic', title: 'Nordic Grid Lettermark', category: 'Minimal Editorial', preview: <svg className="w-16 h-16 text-charcoal mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="2" /><path d="M25 50h50M50 25v50M25 25l50 50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" /><text x="50" y="55" fontFamily="Georgia, serif" fontSize="24" fontWeight="bold" textAnchor="middle" fill="currentColor">C</text></svg> },
  { id: 't-botanical', title: 'Handdrawn Botanical', category: 'Organic / Craft Identity', preview: <svg className="w-16 h-16 text-primary mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><path d="M50 85C50 85 20 60 20 40C20 20 35 15 50 35C65 15 80 20 80 40C80 60 50 85 50 85Z" stroke="currentColor" strokeWidth="2" /><path d="M50 35v45" stroke="currentColor" strokeWidth="1.5" /><path d="M50 50c5-5 15-5 15-5" stroke="currentColor" strokeWidth="1.5" /><path d="M50 62c-5-5-15-5-15-5" stroke="currentColor" strokeWidth="1.5" /></svg> },
  { id: 't-geo', title: 'Symmetrical Wireframe', category: 'Modern SaaS / Fintech', preview: <svg className="w-16 h-16 text-charcoal mx-auto stroke-[1.2]" viewBox="0 0 100 100" fill="none"><polygon points="50,15 80,35 80,68 50,88 20,68 20,35" stroke="currentColor" strokeWidth="2" /><polygon points="50,25 72,40 72,62 50,78 28,62 28,40" stroke="currentColor" strokeWidth="1.5" /><line x1="50" y1="15" x2="50" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" /></svg> }
];

export default function CanvaIntegration() {
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
    setAssets(a => ({ ...a, file: { name: file.name, size: Math.round(file.size / 1024), type: file.type, previewUrl: URL.createObjectURL(file) } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return updateStatus({ error: 'Please provide your name and email.' });
    updateStatus({ error: '', submitted: true });
  };

  const handleReset = () => {
    setStatus({ connected: status.connected, connecting: false, submitted: false, error: '' });
    setForm({ name: '', email: '', brandGoal: '', colors: 'Warm Earth tones' });
    setAssets({ template: null, file: null });
  };

  return (
    <div id="canva-integration-sub" className="bg-primary/5 border border-charcoal/5 rounded-3xl shadow-lg p-6 sm:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row gap-12 relative z-10">
        
        {/* Left Side: Canva Connector Widget */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="flex items-center space-x-4">
            <span className="p-3 bg-white border border-charcoal/5 rounded-2xl shadow-sm">
              <Share2 className="w-8 h-8 text-primary" />
            </span>
            <div>
              <span className="font-hand font-bold text-sm text-primary block">Connected Creator Workspace</span>
              <h4 className="font-display text-2xl font-bold text-charcoal">Canva Integration Studio</h4>
            </div>
          </div>

          <p className="font-sans text-sm sm:text-base text-charcoal/60 leading-relaxed max-w-lg">
            Link your Canva master folder seamlessly. Our designers can inspect your current design drafts 
            and brand outlines directly from the platform. No more messy email attachment strings.
          </p>

          {!status.connected ? (
            <div className="bg-white/80 backdrop-blur-sm border border-charcoal/5 p-8 rounded-2xl text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 bg-primary/5 border-2 border-dashed border-primary/30 rounded-full mx-auto flex items-center justify-center animate-pulse">
                <Layout className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h5 className="font-sans font-bold text-charcoal text-base">Authorize Canva integration</h5>
                <p className="font-sans text-xs text-charcoal/40 mt-1 max-w-sm mx-auto font-medium">
                  Clicking authorizes the secure Cuva Tech Developer App callback to associate draft assets.
                </p>
              </div>

              <button id="connect-canva-btn" onClick={handleConnect} disabled={status.connecting} className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 mx-auto">
                {status.connecting ? (
                  <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Authenticating...</span></>
                ) : (
                  <><Layout className="w-4 h-4 mr-1" /><span>Authorize & Connect Canva</span></>
                )}
              </button>
            </div>
          ) : (
            <div id="canva-connected-view" className="bg-white/80 backdrop-blur-sm border border-charcoal/5 p-6 rounded-2xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-charcoal/5 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span className="font-mono text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">Canva App Connected [Live]</span>
                </div>
                <button onClick={() => updateStatus({ connected: false })} className="font-sans text-[10px] text-primary hover:underline font-bold uppercase tracking-wider cursor-pointer">Disconnect</button>
              </div>

              <span className="font-sans text-[10px] text-charcoal/30 block font-bold uppercase tracking-widest">Tap to Import Canva Draft:</span>
              <div className="flex gap-4 lg:grid lg:grid-cols-2 overflow-x-auto lg:overflow-visible pb-2">
                {TEMPLATES.map((item) => (
                  <button
                    key={item.id} id={`canva-tpl-${item.id}`}
                    onClick={() => setAssets(a => ({ ...a, template: item }))}
                    className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-40 min-w-[180px] cursor-pointer shadow-sm ${
                      assets.template?.id === item.id ? 'border-primary bg-primary/5 text-primary' : 'border-charcoal/5 hover:border-primary/30 bg-white text-charcoal'
                    }`}
                  >
                    <div className="flex-1 flex items-center justify-center opacity-80 group-hover:opacity-100">{item.preview}</div>
                    <div className="border-t border-charcoal/5 pt-3 mt-2">
                      <span className="font-bold block truncate text-xs">{item.title}</span>
                      <span className="text-[9px] text-charcoal/40 block truncate font-bold uppercase tracking-tighter mt-0.5">{item.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Design Parameters & Quote Form */}
        <div className="w-full lg:w-1/2 bg-white border border-charcoal/5 p-8 sm:p-10 rounded-2xl shadow-md self-start lg:sticky lg:top-20">
          <div className="border-b border-charcoal/5 pb-6 mb-8">
            <h5 className="font-display text-2xl font-bold text-charcoal">Design Brief Specifications</h5>
            <span className="font-hand font-bold text-primary text-base block mt-1">Let us synthesize your brand coordinates</span>
          </div>

          {!status.submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {assets.template && (
                <div id="imported-tag" className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center justify-between animate-scale-in">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="font-mono text-[10px] font-bold text-charcoal/60 uppercase">Linked: <span className="text-primary italic">{assets.template.title}</span></span>
                  </div>
                  <button type="button" onClick={() => setAssets(a => ({ ...a, template: null }))} className="font-bold font-mono text-[10px] text-charcoal/30 hover:text-primary transition-colors cursor-pointer">CLEAR</button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['Name', 'Email'].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1">Your {field}</label>
                    <input
                      id={`canva-form-${field.toLowerCase()}`} type={field === 'Email' ? 'email' : 'text'} required
                      value={form[field.toLowerCase() as keyof typeof form]}
                      onChange={(e) => updateForm({ [field.toLowerCase()]: e.target.value })}
                      placeholder={field === 'Email' ? "brand@efe_designs.com" : "Efe Cuva"}
                      className="bg-bg border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1">Brand goal & target audience</label>
                <textarea
                  id="canva-form-goal" rows={3} value={form.brandGoal}
                  onChange={(e) => updateForm({ brandGoal: e.target.value })}
                  placeholder="E.g. High-end eco-friendly apparel line targeting millennial designers."
                  className="bg-bg border border-charcoal/10 p-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm resize-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-sans text-xs font-bold text-charcoal mb-2 ml-1">Preferred Palette Vibe</label>
                <select id="canva-form-palette" value={form.colors} onChange={(e) => updateForm({ colors: e.target.value })} className="bg-bg border border-charcoal/10 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm cursor-pointer font-bold text-charcoal">
                  {['Warm Earth tones', 'Minimal Noir', 'Solar Brights', 'Boreal Greens'].map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div className="border border-charcoal/10 border-dashed p-6 rounded-2xl bg-bg/50 relative group hover:bg-bg transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-xl border border-charcoal/5 shadow-sm group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold text-charcoal block">Manual artwork upload fallback</span>
                    <span className="font-sans text-[10px] text-charcoal/40 block font-bold uppercase mt-0.5 tracking-tighter">PNG, SVG, PDF up to 25MB</span>
                  </div>
                </div>
                <input id="canva-fallback-upload" type="file" onChange={handleFileUpload} accept=".png,.svg,.pdf,.ai,.jpg" className="absolute inset-0 opacity-0 cursor-pointer" />
                {assets.file && (
                  <div id="fallback-upload-success" className="mt-4 bg-white p-3 border border-charcoal/5 rounded-xl text-[10px] flex items-center justify-between shadow-sm animate-scale-in">
                    <span className="font-mono text-charcoal/60 font-bold truncate pr-4">{assets.file.name} ({assets.file.size} KB)</span>
                    <span className="text-primary font-bold font-mono tracking-widest uppercase">READY</span>
                  </div>
                )}
              </div>

              {status.error && (
                <div className="bg-primary/5 text-primary text-xs p-3.5 rounded-xl flex items-center space-x-3 border border-primary/10 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-bold">{status.error}</span>
                </div>
              )}

              <button id="submit-logo-brief" type="submit" className="btn-primary w-full py-4 text-sm flex items-center justify-center space-x-3 shadow-xl shadow-primary/10">
                <span>Submit Design Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div id="brief-success" className="text-center py-10 space-y-8 animate-scale-in">
              <div className="p-6 bg-primary/10 border border-primary/20 rounded-full inline-block text-primary animate-bounce shadow-sm">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h6 className="font-display text-2xl font-bold text-charcoal">Brief parameters lodged!</h6>
                <p className="font-sans text-sm text-charcoal/50 leading-relaxed max-w-sm mx-auto font-medium">
                  Excellent work {form.name}, Sarah is putting together structural logo suggestions. 
                  Your brief has been compiled under ticket <span className="font-mono font-bold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 mx-1 text-primary">CUVA-{Math.floor(100+Math.random()*900)}</span>.
                </p>
              </div>
              
              {assets.template && (
                <div className="bg-bg border border-charcoal/5 p-5 rounded-2xl text-left text-xs max-w-xs mx-auto shadow-sm">
                  <span className="font-mono text-[10px] font-bold text-primary/60 block uppercase tracking-widest">IMPORTED LINK</span>
                  <p className="font-bold text-charcoal mt-2 leading-relaxed">Canva Project template <span className="text-primary italic">"{assets.template.title}"</span> was successfully attached!</p>
                </div>
              )}

              <button id="reset-brief-btn" onClick={handleReset} className="btn-secondary w-full max-w-xs">
                Log another design brief
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
