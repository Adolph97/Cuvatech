import React, { useState } from 'react';
import { Search, Megaphone, Calendar, Check, Play, Eye, Sparkles, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <section id="digital-marketing" className="py-20 bg-cream border-b-2 border-charcoal relative">
      <div className="absolute inset-0 bg-[#fbfbf9]/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-hand font-bold text-lg text-clay tracking-wider uppercase block mb-1">
            03 / Growth Layer
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-charcoal leading-tight mb-4 text-center">
            Digital Marketing Studio
          </h2>
          <div className="w-24 h-1 bg-charcoal mx-auto mb-6 rounded-full" />
          <p className="font-sans text-lg text-charcoal/80 leading-relaxed text-center">
            Quiet, human-intent marketing campaigns designed to convert high-value leads. No flashing triggers, 
            just clean visibility that speaks clearly to decision makers in tech and design.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 select-none">
          {[
            { id: 'seo', label: 'Search Optimization (SEO)', icon: <Search className="w-4 h-4" /> },
            { id: 'ads', label: 'Paid Ads Creator (Google/Meta)', icon: <Megaphone className="w-4 h-4" /> },
            { id: 'social', label: 'Content Planner (Social)', icon: <Calendar className="w-4 h-4" /> }
          ].map((tab) => (
            <motion.button
              id={`marketing-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-2 rounded transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-charcoal text-cream border-charcoal sketch-shadow'
                  : 'bg-beige text-charcoal border-charcoal/10 hover:border-charcoal/35'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Canvas Content */}
        <div className="bg-beige border-2 border-charcoal rounded-xl sketch-shadow p-6 sm:p-10 min-h-[460px] overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            {/* SEO SECTION */}
            {activeTab === 'seo' && (
              <motion.div
                key="seo-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                id="tab-seo-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              >
              <div className="space-y-6">
                <span className="font-mono text-xxs font-bold text-clay uppercase tracking-widest block">
                  Organic Traffic Engine [SEO]
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-charcoal">
                  SEO audits with high-intent precision.
                </h3>
                
                <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed">
                  We don’t chase vanity metrics or write robotic AI paragraphs. We design deep technical 
                  crawls, semantic HTML guidelines, structural schema mapping, and coordinate hand-researched 
                  industry backlinks that position you as a thought leader.
                </p>

                <ul className="space-y-3.5 text-sm">
                  {[
                    'On-page performance audit & loading speed acceleration',
                    'Strategic key-phrase mapping targeting zero-volume vanity overrides',
                    'Semantic schemas for deep snippet categorization',
                    'Bespoke link curation in high-authority tech/design logs'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-charcoal/80">
                      <span className="p-0.5 bg-cream border border-charcoal rounded-full mr-2.5 mt-1 text-moss shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive SEO tool */}
              <div className="bg-white border-2 border-charcoal rounded-xl p-5 sm:p-6 sketch-shadow-sm space-y-4">
                <div className="border-b border-charcoal/10 pb-3">
                  <h4 className="font-serif text-lg font-bold text-charcoal flex items-center space-x-2">
                    <span className="p-1 px-2 border-2 border-charcoal rounded bg-yellow-100 text-xs font-mono">LIVE</span>
                    <span>Cuva Keyword Rank Analyzer</span>
                  </h4>
                  <p className="font-sans text-xxs text-charcoal/50 mt-1">
                    Analyze the organic difficulty of any industry term live.
                  </p>
                </div>

                <form onSubmit={handleCheckKeyword} className="flex gap-2">
                  <input
                    id="seo-keyword-input"
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="E.g. branding agency Dublin"
                    className="flex-1 bg-beige border-2 border-charcoal p-2.5 rounded text-xs sm:text-sm focus:outline-none focus:bg-white"
                  />
                  <button
                    id="submit-seo-kw-check"
                    type="submit"
                    className="bg-clay hover:bg-clay/90 text-cream px-4 text-xs font-bold border-2 border-charcoal rounded-md hover:scale-103 active:scale-97 transition-all shrink-0"
                  >
                    {checkingKeyword ? 'Analyzing...' : 'Crawler Check'}
                  </button>
                </form>

                {checkingKeyword && (
                  <div className="py-8 text-center space-y-3 animate-pulse">
                    <Search className="w-8 h-8 text-charcoal/40 animate-spin mx-auto" />
                    <span className="font-mono text-xxs text-charcoal/60 block">Searching directories & indexing search values...</span>
                  </div>
                )}

                {keywordResult && (
                  <div id="seo-analyzed-results" className="space-y-4 pt-2 border-t border-charcoal/10 animate-scale-in">
                    <div className="grid grid-cols-3 gap-3.5 text-center">
                      <div className="bg-beige border border-charcoal/20 p-2.5 rounded">
                        <span className="font-sans text-[10px] text-charcoal/50 uppercase block">Monthly Volume</span>
                        <span className="font-serif font-black text-charcoal text-base">
                          {keywordResult.volume.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="bg-beige border border-charcoal/20 p-2.5 rounded">
                        <span className="font-sans text-[10px] text-charcoal/50 uppercase block">Rank Difficulty</span>
                        <span className={`font-sans font-bold text-sm block ${
                          keywordResult.difficulty === 'Easy' ? 'text-green-700' : keywordResult.difficulty === 'Medium' ? 'text-amber-700' : 'text-red-700'
                        }`}>
                          {keywordResult.difficulty}
                        </span>
                      </div>

                      <div className="bg-beige border border-charcoal/20 p-2.5 rounded flex flex-col justify-center">
                        <span className="font-sans text-[10px] text-charcoal/50 uppercase block">Optimization Score</span>
                        <span className="font-serif font-black text-clay text-base">
                          {keywordResult.score}/100
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-sans text-xs font-bold text-charcoal block">Interactive Roadmap:</span>
                      <ul className="space-y-1.5 text-xxs font-sans text-charcoal/80">
                        {keywordResult.actions.map((act, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-clay font-bold mr-1.5 shrink-0">•</span>
                            <span>{act}.</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              </motion.div>
            )}

            {/* PAID ADS CREATOR */}
            {activeTab === 'ads' && (
              <motion.div
                key="ads-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                id="tab-ads-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              >
              <div className="space-y-6">
                <span className="font-mono text-xxs font-bold text-moss uppercase tracking-widest block">
                  Targeted Ad Networks [Paid Campaigns]
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-charcoal">
                  Direct conversions, minimal expenditure waste.
                </h3>
                
                <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed">
                  We deploy targeted Google Search, Meta Social, and LinkedIn B2B structures. We structure 
                  precise audiences with high buyers intent, craft high-editorial design hooks, and report 
                  performance with absolute clarity – no vanity impressions, only CPA (cost-per-acquisition) reality.
                </p>

                <div className="bg-white/40 p-4 rounded-lg border border-charcoal/15 text-xs text-charcoal/70 leading-relaxed">
                  <strong>Did you know?</strong> Google Ads targeting exact high-intent schemas see a 42% decrease 
                  in cost-per-click compared to wide AI auto-matching structures. We manage variables by hand.
                </div>
              </div>

              {/* Interactive Ad Previewer */}
              <div className="bg-white border-2 border-charcoal rounded-xl p-5 sm:p-6 sketch-shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
                  <h4 className="font-serif text-base font-bold text-charcoal">
                    Cuva Live Ad Preview Sandbox
                  </h4>
                  
                  {/* Toggle channel */}
                  <div className="flex border border-charcoal rounded overflow-hidden text-xxs font-bold">
                    <button
                      type="button"
                      onClick={() => setAdChannel('google')}
                      className={`px-2.5 py-1 ${adChannel === 'google' ? 'bg-charcoal text-cream' : 'bg-beige text-charcoal'}`}
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdChannel('meta')}
                      className={`px-2.5 py-1 ${adChannel === 'meta' ? 'bg-charcoal text-cream' : 'bg-beige text-charcoal'}`}
                    >
                      Meta
                    </button>
                  </div>
                </div>

                {/* Sandbox Inputs */}
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="font-sans text-[10px] font-bold text-charcoal mb-0.5">Ad Headline</span>
                    <input
                      id="meta-headline-input"
                      type="text"
                      value={adHeadline}
                      onChange={(e) => setAdHeadline(e.target.value)}
                      className="bg-beige border border-charcoal/25 p-2 rounded text-xxs font-sans focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[10px] font-bold text-charcoal mb-0.5">Ad Body Copy</span>
                    <textarea
                      id="meta-body-copy"
                      rows={2}
                      value={adDescription}
                      onChange={(e) => setAdDescription(e.target.value)}
                      className="bg-beige border border-charcoal/25 p-2 rounded text-xxs font-sans focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Live Output */}
                <div className="border border-charcoal/20 rounded p-4 bg-beige/10 space-y-2">
                  <span className="font-mono text-xxs text-charcoal/40 uppercase block">Render Outcome:</span>
                  
                  {adChannel === 'google' ? (
                    <div className="space-y-1 bg-white p-3 border border-charcoal/10 rounded">
                      <span className="text-xxs text-charcoal/60 block truncate">https://www.cuvatech.com/it-migration</span>
                      <h5 className="text-blue-800 font-sans text-sm font-semibold hover:underline cursor-pointer truncate">
                        {adHeadline}
                      </h5>
                      <p className="text-xxs text-charcoal/80 leading-snug">
                        {adDescription}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 bg-[#f0f2f5] p-3 border border-charcoal/10 rounded font-sans">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 border-2 border-charcoal bg-sand rounded-full flex items-center justify-center font-bold text-[10px]">C</div>
                        <div>
                          <span className="text-xxs font-bold text-charcoal block leading-none">Cuva Tech</span>
                          <span className="text-[8px] text-charcoal/50">Sponsored • Organic Reach</span>
                        </div>
                      </div>
                      <p className="text-xxs text-charcoal leading-snug">
                        {adDescription}
                      </p>
                      <div className="bg-white border border-charcoal/10 overflow-hidden rounded">
                        <div className="h-16 bg-sand border-b border-charcoal/10 flex items-center justify-center text-charcoal/30 text-xxs font-bold">[Image Asset placeholder]</div>
                        <div className="p-2 flex justify-between items-center bg-white">
                          <div>
                            <span className="text-[8px] text-charcoal/50 uppercase block">WWW.CUVA.TECH</span>
                            <span className="text-[10px] font-bold text-charcoal truncate block">{adHeadline}</span>
                          </div>
                          <span className="bg-beige border border-charcoal/30 text-[9px] px-2 py-1 rounded font-bold cursor-pointer">Learn More</span>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                id="tab-social-view"
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              >
              <div className="space-y-6">
                <span className="font-mono text-xxs font-bold text-terracotta uppercase tracking-widest block">
                  Platform Presence [Social Media]
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-charcoal">
                  Authentic storytelling, beautifully typeset.
                </h3>
                
                <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed">
                  We formulate custom content schedules across LinkedIn, Instagram, and X/Twitter. We curate 
                  thought-provoking threads, designs, and case histories that engage peers, avoiding empty 
                  engagement hashtags and automated spam scripts.
                </p>

                <div className="flex items-center space-x-2 border-t border-charcoal/15 pt-4">
                  <button
                    type="button"
                    onClick={() => setSocialFilter('feed')}
                    className={`px-3 py-1.5 text-xs font-bold border rounded transition-colors ${
                      socialFilter === 'feed' ? 'bg-clay text-cream' : 'bg-white hover:bg-beige'
                    }`}
                  >
                    Feed Posts
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialFilter('stories')}
                    className={`px-3 py-1.5 text-xs font-bold border rounded transition-colors ${
                      socialFilter === 'stories' ? 'bg-clay text-cream' : 'bg-white hover:bg-beige'
                    }`}
                  >
                    Live Story Mockups
                  </button>
                </div>
              </div>

              {/* Interactive content map */}
              <div className="bg-white border-2 border-charcoal rounded-xl p-5 sm:p-6 sketch-shadow-sm space-y-4">
                <div className="border-b border-charcoal/10 pb-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif text-base font-bold text-charcoal">
                      June Content Strategy Grid
                    </h4>
                    <p className="font-sans text-xxs text-charcoal/50">Draft agenda logs, ready to compile and ship.</p>
                  </div>
                </div>

                {socialFilter === 'feed' ? (
                  <div className="space-y-3 text-xs font-sans">
                    <div className="p-3 bg-beige/40 border border-charcoal/10 rounded flex justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] font-bold text-moss">[Post #1 - LinkedIn]</span>
                        <p className="font-medium text-charcoal leading-snug">"Why we mock-up server systems on standard drawing paper before setting cloud instances."</p>
                      </div>
                      <span className="p-1 px-1.5 bg-green-50 text-emerald-800 border border-emerald-300 font-mono text-[8px] rounded h-5 inline-block shrink-0">READY</span>
                    </div>

                    <div className="p-3 bg-beige/40 border border-charcoal/10 rounded flex justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] font-bold text-clay">[Post #2 - Instagram]</span>
                        <p className="font-medium text-charcoal leading-snug">"Behind the scenes at OOT Studio: setting physical letterplates for Scribe Publishing client sets."</p>
                      </div>
                      <span className="p-1 px-1.5 bg-yellow-50 text-yellow-800 border border-yellow-300 font-mono text-[8px] rounded h-5 inline-block shrink-0 font-bold">DRAFT</span>
                    </div>

                    <div className="p-3 bg-beige/40 border border-charcoal/10 rounded flex justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] font-bold text-terracotta">[Post #3 - Twitter]</span>
                        <p className="font-medium text-charcoal leading-snug">"A server pipeline has no visual character of its own. Here is how we draw them to avoid server clutter."</p>
                      </div>
                      <span className="p-1 px-1.5 bg-green-50 text-emerald-800 border border-emerald-300 font-mono text-[8px] rounded h-5 inline-block shrink-0">READY</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center py-4">
                    {/* Simulated mobile story phone */}
                    <div className="w-48 border-2 border-charcoal rounded-xl overflow-hidden sketch-shadow-sm bg-sand">
                      <div className="h-4 border-b border-charcoal/15 bg-white/60 flex items-center justify-around px-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-charcoal/20" />
                        <span className="text-[7px] text-charcoal/40 font-mono">Cuva Stories</span>
                      </div>
                      <div className="p-4 h-56 bg-gradient-to-b from-beige to-sand flex flex-col justify-between text-center relative">
                        <span className="font-hand font-extrabold text-base text-clay tracking-wide">Cuva Studio Logs</span>
                        
                        <div className="border border-charcoal/10 bg-white/80 p-2.5 rounded text-left">
                          <span className="text-[8px] font-mono font-bold block text-moss">IT MIGRATION STEP</span>
                          <span className="text-[10px] font-sans font-bold leading-tight block text-charcoal mt-0.5">"Zero database loss during editorial migration"</span>
                        </div>
                        
                        <span className="text-[7px] font-mono text-charcoal/40 block">Tap to request layout specs</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
