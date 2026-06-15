import React, { useState } from 'react';
import { Search, Megaphone, Calendar, Check, Play, Eye, Sparkles, Sliders, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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

export default function DigitalMarketing() {
  const [activeTab, setActiveTab] = useState<'seo' | 'ads' | 'social'>('seo');

  // Interactive state for SEO checker
  const [keywordInput, setKeywordInput] = useState('');
  const [checkingKeyword, setCheckingKeyword] = useState(false);
  const [keywordResult, setKeywordResult] = useState<{
    keyword: string;
    volume: number;
    difficulty: 'Easy' | 'Medium' | 'Challenging';
    score: number;
    actions: string[];
  } | null>(null);

  // Interactive state for Ad Sandbox
  const [adHeadline, setAdHeadline] = useState('Cuva Tech | Handcrafted Cloud Solutions');
  const [adDescription, setAdDescription] = useState('Bespoke cloud network architectures engineered on raw paper first. Discover our personal touch.');
  const [adChannel, setAdChannel] = useState<'google' | 'meta'>('google');

  // Interactive state for Social planner
  const [socialFilter, setSocialFilter] = useState<'feed' | 'stories'>('feed');

  const handleCheckKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;
    setCheckingKeyword(true);
    setKeywordResult(null);

    setTimeout(() => {
      setCheckingKeyword(false);
      const kw = keywordInput.trim();
      // Heuristics for demo keyword results
      const lengthScore = Math.max(30, 100 - kw.length * 4);
      const difficulty = lengthScore > 75 ? 'Easy' : lengthScore > 50 ? 'Medium' : 'Challenging';
      setKeywordResult({
        keyword: kw,
        volume: Math.floor(250 + Math.random() * 8500),
        difficulty: difficulty,
        score: Math.min(98, Math.round(lengthScore + Math.random() * 10)),
        actions: [
          `Integrate the term "${kw}" inside header <H1> tags`,
          `Write a 500-word case history specifically structured for local authority lookups`,
          `Include 2 graphic schema drawings referencing vector maps`
        ]
      });
    }, 1200);
  };

  return (
    <motion.section 
      id="digital-marketing" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-24 bg-bg relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-sans font-bold text-xs text-primary tracking-widest uppercase block mb-3">
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-charcoal leading-tight mb-6 text-center">
            Digital Marketing and Business Insights
          </h2>
          <p className="font-sans text-lg text-charcoal/60 leading-relaxed text-center max-w-2xl mx-auto">
            Quiet, human-intent marketing campaigns designed to convert high-value leads. No flashing triggers, 
            just clean visibility that speaks clearly to decision makers in tech and design.
          </p>
        </motion.div>

        {/* Tab Selection */}
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16 select-none">
          {[
            { id: 'seo', label: 'SEO Engine', icon: <Search className="w-4 h-4" /> },
            { id: 'ads', label: 'ADS (Google/SM)', icon: <Megaphone className="w-4 h-4" /> },
            { id: 'social', label: 'Social Strategy', icon: <Calendar className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics & Email', icon: <BarChart className="w-4 h-4" /> }
          ].map((tab) => (
            <motion.button
              id={`marketing-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-8 py-4 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-charcoal text-white shadow-xl shadow-charcoal/20'
                  : 'bg-white text-charcoal border border-charcoal/5 hover:border-primary/20'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>
...
            {/* ANALYTICS & EMAIL SECTION */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                id="tab-analytics-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
              <div className="space-y-8">
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-[0.2em] block">
                  Data & Retention [Analytics & Email]
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                  Actionable insights, <br /><span className="text-primary italic">tailored messaging.</span>
                </h3>
                
                <p className="font-sans text-base text-charcoal/60 leading-relaxed">
                  We bridge the gap between raw data and creative strategy. From deep GA4 audits to 
                  highly-personalized email automation, we ensure every touchpoint is measured and meaningful.
                </p>

                <ul className="space-y-4">
                  {[
                    'Advanced GA4 / GTM implementation and event tracking',
                    'Custom performance dashboards and conversion path analysis',
                    'Drip-campaign architecture and high-editorial email design',
                    'A/B testing protocols for landing pages and subject lines'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-charcoal/70 text-sm">
                      <span className="p-1 bg-primary/10 rounded-full mr-3 mt-0.5 text-primary shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Email Preview */}
              <div className="bg-bg border border-charcoal/5 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="border-b border-charcoal/5 pb-4">
                  <h4 className="font-display text-xl font-bold text-charcoal">
                    Email Newsletter Mockup
                  </h4>
                  <p className="font-sans text-xs text-charcoal/40 mt-1">
                    Preview how your human-intent campaigns land in inboxes.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl border border-charcoal/5 overflow-hidden shadow-xl shadow-charcoal/5">
                  <div className="bg-primary/5 p-4 border-b border-charcoal/5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] font-mono text-charcoal/30 font-bold uppercase tracking-widest">Inbound_Transmission</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-charcoal/20 uppercase tracking-widest block">Subject:</span>
                      <p className="text-xs font-bold text-charcoal">The calm logic of your next cloud migration.</p>
                    </div>
                    <div className="w-full h-32 bg-primary/5 rounded-xl border border-charcoal/5 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-charcoal/5 rounded-full" />
                      <div className="h-2 w-full bg-charcoal/5 rounded-full" />
                      <div className="h-2 w-5/6 bg-charcoal/5 rounded-full" />
                    </div>
                    <div className="pt-2">
                      <div className="h-8 w-24 bg-charcoal rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>
            )}

        {/* Tab Canvas Content */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white border border-charcoal/5 rounded-[3rem] shadow-2xl shadow-charcoal/5 p-8 sm:p-12 min-h-[500px] overflow-hidden relative"
        >
          
          <AnimatePresence mode="wait">
            {/* SEO SECTION */}
            {activeTab === 'seo' && (
              <motion.div
                key="seo-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                id="tab-seo-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
              <div className="space-y-8">
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-[0.2em] block">
                  Organic Traffic Engine [SEO]
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                  SEO audits with <br /><span className="text-primary italic">high-intent precision.</span>
                </h3>
                
                <p className="font-sans text-base text-charcoal/60 leading-relaxed">
                  We don’t chase vanity metrics or write robotic AI paragraphs. We design deep technical 
                  crawls, semantic HTML guidelines, structural schema mapping, and coordinate hand-researched 
                  industry backlinks.
                </p>

                <ul className="space-y-4">
                  {[
                    'On-page performance audit & loading speed acceleration',
                    'Strategic key-phrase mapping targeting zero-volume vanity overrides',
                    'Semantic schemas for deep snippet categorization',
                    'Bespoke link curation in high-authority tech/design logs'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-charcoal/70 text-sm">
                      <span className="p-1 bg-primary/10 rounded-full mr-3 mt-0.5 text-primary shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive SEO tool */}
              <div className="bg-bg border border-charcoal/5 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="border-b border-charcoal/5 pb-4">
                  <h4 className="font-display text-xl font-bold text-charcoal flex items-center space-x-2">
                    <span className="p-1 px-3 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">LIVE</span>
                    <span>Cuva Keyword Rank Analyzer</span>
                  </h4>
                  <p className="font-sans text-xs text-charcoal/40 mt-1">
                    Analyze the organic difficulty of any industry term live.
                  </p>
                </div>

                <form onSubmit={handleCheckKeyword} className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="seo-keyword-input"
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="E.g. branding agency Dublin"
                    className="flex-1 bg-white border border-charcoal/5 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  />
                  <button
                    id="submit-seo-kw-check"
                    type="submit"
                    className="bg-charcoal text-white px-8 py-4 rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-charcoal/10"
                  >
                    {checkingKeyword ? 'Analyzing...' : 'Check Rank'}
                  </button>
                </form>

                {checkingKeyword && (
                  <div className="py-12 text-center space-y-4">
                    <Search className="w-10 h-10 text-primary animate-spin mx-auto opacity-50" />
                    <span className="font-sans text-[10px] text-charcoal/30 uppercase tracking-[0.2em] block font-bold">Searching directories & indexing search values...</span>
                  </div>
                )}

                {keywordResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="seo-analyzed-results" 
                    className="space-y-6 pt-6 border-t border-charcoal/5"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white border border-charcoal/5 p-4 rounded-2xl shadow-sm">
                        <span className="font-sans text-[9px] text-charcoal/30 uppercase block font-bold tracking-widest mb-1">Volume</span>
                        <span className="font-display font-extrabold text-charcoal text-lg">
                          {keywordResult.volume.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="bg-white border border-charcoal/5 p-4 rounded-2xl shadow-sm">
                        <span className="font-sans text-[9px] text-charcoal/30 uppercase block font-bold tracking-widest mb-1">Difficulty</span>
                        <span className={`font-sans font-bold text-sm block mt-1 ${
                          keywordResult.difficulty === 'Easy' ? 'text-green-500' : keywordResult.difficulty === 'Medium' ? 'text-amber-500' : 'text-primary'
                        }`}>
                          {keywordResult.difficulty}
                        </span>
                      </div>

                      <div className="bg-white border border-charcoal/5 p-4 rounded-2xl shadow-sm">
                        <span className="font-sans text-[9px] text-charcoal/30 uppercase block font-bold tracking-widest mb-1">Score</span>
                        <span className="font-display font-extrabold text-primary text-lg">
                          {keywordResult.score}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] block">Recommended Roadmap:</span>
                      <ul className="space-y-2.5 text-xs font-sans text-charcoal/60">
                        {keywordResult.actions.map((act, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary font-bold mr-2 shrink-0">•</span>
                            <span>{act}.</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
              </motion.div>
            )}

            {/* PAID ADS CREATOR */}
            {activeTab === 'ads' && (
              <motion.div
                key="ads-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                id="tab-ads-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
              <div className="space-y-8">
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-[0.2em] block">
                  Targeted Ad Networks [Paid Campaigns]
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                  Direct conversions, <br /><span className="text-primary italic">minimal expenditure waste.</span>
                </h3>
                
                <p className="font-sans text-base text-charcoal/60 leading-relaxed">
                  We deploy targeted Google Search, Meta Social, and LinkedIn B2B structures. We structure 
                  precise audiences with high buyers intent, craft high-editorial design hooks, and report 
                  performance with absolute clarity.
                </p>

                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-sm text-charcoal/60 leading-relaxed italic">
                  <strong>Did you know?</strong> Google Ads targeting exact high-intent schemas see a 42% decrease 
                  in cost-per-click compared to wide AI auto-matching structures.
                </div>
              </div>

              {/* Interactive Ad Previewer */}
              <div className="bg-bg border border-charcoal/5 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-charcoal/5 pb-4">
                  <h4 className="font-display text-xl font-bold text-charcoal">
                    Sandbox Preview
                  </h4>
                  
                  {/* Toggle channel */}
                  <div className="flex bg-white border border-charcoal/5 rounded-full p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setAdChannel('google')}
                      className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${adChannel === 'google' ? 'bg-charcoal text-white shadow-lg' : 'text-charcoal/30 hover:bg-bg'}`}
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdChannel('meta')}
                      className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${adChannel === 'meta' ? 'bg-charcoal text-white shadow-lg' : 'text-charcoal/30 hover:bg-bg'}`}
                    >
                      Meta
                    </button>
                  </div>
                </div>

                {/* Sandbox Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Headline</span>
                    <input
                      id="meta-headline-input"
                      type="text"
                      value={adHeadline}
                      onChange={(e) => setAdHeadline(e.target.value)}
                      className="w-full bg-white border border-charcoal/5 px-4 py-3.5 rounded-2xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Body Copy</span>
                    <textarea
                      id="meta-body-copy"
                      rows={2}
                      value={adDescription}
                      onChange={(e) => setAdDescription(e.target.value)}
                      className="w-full bg-white border border-charcoal/5 px-4 py-3.5 rounded-2xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm resize-none"
                    />
                  </div>
                </div>

                {/* Live Output */}
                <div className="bg-white/50 border border-charcoal/5 rounded-2xl p-6 space-y-4">
                  <span className="font-sans text-[10px] text-charcoal/20 uppercase block font-bold tracking-[0.3em]">Render Outcome</span>
                  
                  {adChannel === 'google' ? (
                    <div className="space-y-2 bg-white p-6 border border-charcoal/5 rounded-2xl shadow-xl shadow-charcoal/5">
                      <span className="text-[11px] text-charcoal/40 block truncate">https://www.cuvatech.com/it-migration</span>
                      <h5 className="text-blue-500 font-sans text-base font-bold hover:underline cursor-pointer truncate">
                        {adHeadline}
                      </h5>
                      <p className="text-[11px] text-charcoal/60 leading-relaxed">
                        {adDescription}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 bg-white p-6 border border-charcoal/5 rounded-2xl shadow-xl shadow-charcoal/5 font-sans">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-xs text-primary shadow-inner">C</div>
                        <div>
                          <span className="text-sm font-bold text-charcoal block leading-none">Cuva Tech</span>
                          <span className="text-[10px] text-charcoal/30 font-bold uppercase tracking-widest mt-0.5 block">Sponsored</span>
                        </div>
                      </div>
                      <p className="text-xs text-charcoal/70 leading-relaxed">
                        {adDescription}
                      </p>
                      <div className="bg-bg border border-charcoal/5 overflow-hidden rounded-2xl">
                        <div className="h-28 bg-primary/5 border-b border-charcoal/5 flex items-center justify-center text-charcoal/10 text-[10px] font-bold uppercase tracking-[0.3em]">Asset Preview</div>
                        <div className="p-4 flex justify-between items-center bg-white">
                          <div className="max-w-[140px]">
                            <span className="text-[9px] text-charcoal/30 uppercase block font-bold tracking-widest">WWW.CUVA.TECH</span>
                            <span className="text-xs font-bold text-charcoal truncate block mt-0.5">{adHeadline}</span>
                          </div>
                          <span className="bg-bg border border-charcoal/5 text-[10px] px-5 py-2 rounded-full font-bold cursor-pointer hover:bg-white transition-all shadow-sm">Learn More</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </motion.div>
            )}

            {/* SOCIAL PLANNER */}
            {activeTab === 'social' && (
              <motion.div
                key="social-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                id="tab-social-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
              <div className="space-y-8">
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-[0.2em] block">
                  Platform Presence [Social Media]
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                  Authentic storytelling, <br /><span className="text-primary italic">beautifully typeset.</span>
                </h3>
                
                <p className="font-sans text-base text-charcoal/60 leading-relaxed">
                  We formulate custom content schedules across LinkedIn, Instagram, and X/Twitter. We curate 
                  thought-provoking threads, designs, and case histories that engage peers.
                </p>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSocialFilter('feed')}
                    className={`px-6 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      socialFilter === 'feed' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-charcoal/5 hover:border-primary/20'
                    }`}
                  >
                    Feed Posts
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialFilter('stories')}
                    className={`px-6 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      socialFilter === 'stories' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-charcoal/5 hover:border-primary/20'
                    }`}
                  >
                    Live Mockups
                  </button>
                </div>
              </div>

              {/* Interactive content map */}
              <div className="bg-bg border border-charcoal/5 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="border-b border-charcoal/5 pb-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-display text-xl font-bold text-charcoal">
                      Strategy Grid
                    </h4>
                    <p className="font-sans text-xs text-charcoal/40 mt-1">Draft agenda logs, ready to ship.</p>
                  </div>
                </div>

                {socialFilter === 'feed' ? (
                  <div className="space-y-4 text-xs font-sans">
                    {[
                      { channel: 'LinkedIn', text: 'Why we mock-up server systems on standard drawing paper before setting cloud instances.', status: 'READY' },
                      { channel: 'Instagram', text: 'Behind the scenes at OOT Studio: setting physical letterplates for Scribe Publishing client sets.', status: 'DRAFT' },
                      { channel: 'X/Twitter', text: 'A server pipeline has no visual character of its own. Here is how we draw them to avoid server clutter.', status: 'READY' }
                    ].map((post, idx) => (
                      <div key={idx} className="p-5 bg-white border border-charcoal/5 rounded-2xl flex justify-between gap-4 shadow-sm group hover:shadow-xl hover:shadow-charcoal/5 transition-all">
                        <div className="space-y-2">
                          <span className="font-sans text-[9px] font-bold text-primary uppercase tracking-widest">{post.channel}</span>
                          <p className="font-medium text-charcoal/70 leading-relaxed">{post.text}</p>
                        </div>
                        <span className={`px-3 py-1 h-fit border font-sans text-[8px] rounded-full shrink-0 font-bold uppercase tracking-widest mt-1 ${post.status === 'READY' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-6">
                    {/* Simulated mobile story phone */}
                    <div className="w-56 border border-charcoal/5 rounded-[3rem] overflow-hidden shadow-2xl bg-white p-2.5">
                      <div className="border border-charcoal/5 rounded-[2.5rem] overflow-hidden bg-bg relative">
                        <div className="h-6 border-b border-charcoal/5 bg-white/60 flex items-center justify-center">
                          <span className="w-10 h-1 rounded-full bg-charcoal/10" />
                        </div>
                        <div className="p-6 h-72 flex flex-col justify-between text-center relative bg-gradient-to-b from-primary/10 to-white">
                          <span className="font-display font-bold text-2xl text-charcoal tracking-tight">Cuva <br />Studio Logs</span>
                          
                          <div className="bg-white/95 backdrop-blur-md border border-charcoal/5 p-5 rounded-[1.5rem] text-left shadow-xl shadow-charcoal/5">
                            <span className="text-[9px] font-sans font-bold block text-primary uppercase tracking-widest">IT MIGRATION STEP</span>
                            <span className="text-xs font-sans font-bold leading-tight block text-charcoal mt-1.5 italic">"Zero database loss during editorial migration"</span>
                          </div>
                          
                          <span className="text-[9px] font-sans font-bold text-charcoal/20 uppercase tracking-widest block">Request layout specs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </motion.section>
  );
}
