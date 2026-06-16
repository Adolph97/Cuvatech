import React from 'react';
import { TESTIMONIALS, TRUSTPILOT_DATA } from '../data';
import { Testimonial } from '../types';
import { Star, MessageSquarePlus, Filter, CheckCircle, Quote, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScribbleStar, ScribbleCircle } from './NotionIllustrations';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Testimonials() {
  const [filter, setFilter] = React.useState<'ALL' | 'IT' | 'Branding' | 'Digital Marketing'>('ALL');
  const [reviewsList, setReviewsList] = React.useState<Testimonial[]>(TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Submit new review form state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [newReview, setNewReview] = React.useState({
    name: '',
    company: '',
    sector: '',
    role: '',
    review: '',
    rating: 5,
    serviceType: 'IT' as 'IT' | 'Branding' | 'Digital Marketing'
  });
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const filteredReviews = filter === 'ALL'
    ? reviewsList
    : reviewsList.filter((item) => item.serviceType === filter);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < filteredReviews.length - 1;

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentIndex(currentIndex + 1);
  };

  // Handle Review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.review.trim() || !newReview.company.trim()) {
      alert('Please fill out all the rating coordinates.');
      return;
    }

    const reviewObject: Testimonial = {
      id: `t-added-${Date.now()}`,
      name: newReview.name.trim(),
      company: newReview.company.trim(),
      sector: newReview.sector.trim() || 'Tech Partner',
      role: newReview.role.trim() || 'Stakeholder',
      review: newReview.review.trim(),
      rating: newReview.rating,
      serviceType: newReview.serviceType,
      date: 'Just Now'
    };

    setReviewsList([reviewObject, ...reviewsList]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsFormOpen(false);
      // Reset form
      setNewReview({
        name: '',
        company: '',
        sector: '',
        role: '',
        review: '',
        rating: 5,
        serviceType: 'IT'
      });
    }, 2000);
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(count)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-charcoal/10'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.section
      id="testimonials"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-20 bg-bg border-b border-charcoal/5 relative"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Trustpilot Scoreboard Header */}
        <motion.div variants={fadeInUp} className="bg-white border border-charcoal/5 p-6 sm:p-8 rounded-3xl shadow-lg mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
            {/* Trustpilot custom visual design */}
            <div className="bg-[#00b67a] p-4 sm:p-6 rounded-2xl shadow-md flex flex-col items-center justify-center shrink-0">
              <span className="text-white text-2xl sm:text-3xl font-bold tracking-tighter leading-none select-none font-display">Trustpilot</span>
              <div className="flex space-x-1 mt-2.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="bg-white p-1 rounded-sm">
                    <svg className="w-3 h-3 text-[#00b67a] fill-current" viewBox="0 0 24 24">
                      <polygon points="12,1.5 15.4,8.4 23,9.5 17.5,14.8 18.8,22.3 12,18.8 5.2,22.3 6.5,14.8 1,9.5 8.6,8.4" />
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-4xl font-bold text-charcoal">{TRUSTPILOT_DATA.rating}</span>
                <span className="text-charcoal/40 text-sm font-bold uppercase tracking-wider">/ 5.0</span>
              </div>
              <h3 className="font-display text-xl font-bold text-charcoal mt-1">
                {TRUSTPILOT_DATA.count} Verified Client Stories
              </h3>
              <p className="font-sans text-xs text-charcoal/50 leading-normal font-medium">
                Based on enterprise IT frameworks, branding publications, and local SEO campaign records.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              id="submit-review-trigger"
              onClick={() => setIsFormOpen(true)}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <MessageSquarePlus className="w-4 h-4 text-primary" />
              <span>Write a Testimonial</span>
            </button>
            <a
              id="external-trustpilot-link"
              href="https://www.trustpilot.com"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-primary w-full sm:w-auto text-center"
            >
              See all reviews
            </a>
          </div>
        </motion.div>

        {/* Filters and Section Intro */}
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-8 border-b border-charcoal/5 relative">
          <div>
            <span className="font-hand font-bold text-lg text-primary flex items-center space-x-1">
              <span>Client Ledger</span>
              <ScribbleStar className="w-4 h-4 text-primary opacity-50 animate-pulse" />
            </span>
            <h4 className="font-display text-3xl sm:text-4xl font-bold text-charcoal leading-tight mt-1">
              Trusted by{' '}
              <span className="relative inline-block px-1">
                <span className="relative z-10">Creative Publishers</span>
                <span className="absolute inset-0 w-full h-[120%] text-primary opacity-20 -translate-y-1 block pointer-events-none">
                  <ScribbleCircle />
                </span>
              </span>{' '}
              & Innovators
            </h4>
          </div>

          {/* Filtering */}
          <div className="flex flex-wrap items-center gap-2 bg-white/50 p-1.5 rounded-full border border-charcoal/5">
            <span className="font-sans text-[10px] font-bold text-charcoal/40 uppercase tracking-widest px-3 flex items-center">
              <Filter className="w-3 h-3 mr-1.5" /> Filter
            </span>
            {(['ALL', 'IT', 'Branding', 'Digital Marketing'] as const).map((type) => (
              <button
                id={`filter-${type}`}
                key={type}
                onClick={() => { setFilter(type); setCurrentIndex(0); }}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  filter === type
                    ? 'bg-charcoal text-white shadow-md'
                    : 'text-charcoal/60 hover:text-charcoal hover:bg-white transition-colors'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Horizontal Testimonial Slider */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {filteredReviews.length > 0 && (
              <motion.div
                key={`${currentIndex}-${filteredReviews[currentIndex].id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="soft-card p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Hand-drawn quoting asset overlay */}
                <Quote className="w-16 h-16 text-primary/[0.05] absolute -right-2 -top-2" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    {renderStars(filteredReviews[currentIndex].rating)}
                    <span className="font-mono text-[9px] font-bold px-2.5 py-1 border border-primary/10 bg-primary/5 text-primary rounded-full uppercase tracking-widest">
                      {filteredReviews[currentIndex].serviceType}
                    </span>
                  </div>

                  <p className="font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed italic relative z-10">
                    "{filteredReviews[currentIndex].review}"
                  </p>
                </div>

                <div className="pt-6 border-t border-charcoal/5 mt-8 flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-charcoal text-xl block leading-none">
                      {filteredReviews[currentIndex].name}
                    </span>
                    <span className="font-sans text-[10px] font-bold text-charcoal/40 mt-2 block uppercase tracking-wider">
                      {filteredReviews[currentIndex].role} • <span className="text-primary">{filteredReviews[currentIndex].company}</span>
                    </span>
                  </div>
                  <span className="font-hand font-bold text-sm text-primary/60">{filteredReviews[currentIndex].date}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Arrows */}
          {filteredReviews.length > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`w-12 h-12 rounded-full border border-charcoal/5 flex items-center justify-center transition-all ${
                  canGoPrev
                    ? 'bg-white text-charcoal hover:bg-primary hover:text-white cursor-pointer'
                    : 'bg-charcoal/5 text-charcoal/20 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Dots indicator */}
              <div className="flex space-x-2">
                {filteredReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'bg-primary w-8' : 'bg-charcoal/20 hover:bg-charcoal/40'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                disabled={!canGoNext}
                className={`w-12 h-12 rounded-full border border-charcoal/5 flex items-center justify-center transition-all ${
                  canGoNext
                    ? 'bg-white text-charcoal hover:bg-primary hover:text-white cursor-pointer'
                    : 'bg-charcoal/5 text-charcoal/20 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

      </div>

      {/* SUBMIT REVIEW WRITING DIALOG - MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div id="submit-review-overlay" className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-bg border border-charcoal/10 w-full max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-primary/10 border-b border-charcoal/5 p-6 flex items-center justify-between">
                <div>
                  <span className="font-hand font-bold text-sm text-primary">Tell us your experience</span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal leading-none">
                    Write a Testimonial
                  </h3>
                </div>
                <button
                  id="close-review-modal"
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-white/50 text-charcoal rounded-full transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-10 text-center space-y-6 animate-scale-in">
                  <div className="inline-block p-4 bg-primary/10 border border-primary/20 rounded-full text-primary animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-2xl font-bold text-charcoal">Testimonial Published!</h4>
                    <p className="font-sans text-sm text-charcoal/60 leading-relaxed max-w-xs mx-auto">
                      Thank you for writing. Your rating has been logged securely and added instantly to the community ledger.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5 ml-1">Your Name</label>
                      <input
                        id="rev-input-name"
                        type="text"
                        required
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5 ml-1">Role / Job Title</label>
                      <input
                        id="rev-input-role"
                        type="text"
                        value={newReview.role}
                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                        placeholder="Agency Principal"
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5 ml-1">Company</label>
                      <input
                        id="rev-input-company"
                        type="text"
                        required
                        value={newReview.company}
                        onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                        placeholder="Acme Inc."
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5 ml-1">Sector / Niche</label>
                      <input
                        id="rev-input-sector"
                        type="text"
                        value={newReview.sector}
                        onChange={(e) => setNewReview({ ...newReview, sector: e.target.value })}
                        placeholder="e.g. Design Studio"
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Rating Selector */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5 ml-1">Rating Score</label>
                      <select
                        id="rev-input-rating"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-bold cursor-pointer"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                        <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                        <option value="3">⭐⭐⭐ (3 / 5)</option>
                      </select>
                    </div>

                    {/* Core Service Pillar */}
                    <div className="flex flex-col">
                      <label className="font-sans text-xs font-bold text-charcoal mb-1.5 ml-1">Service Type</label>
                      <select
                        id="rev-input-service"
                        value={newReview.serviceType}
                        onChange={(e) => setNewReview({ ...newReview, serviceType: e.target.value as any })}
                        className="bg-white border border-charcoal/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm cursor-pointer font-bold"
                      >
                        <option value="IT">IT Solutions</option>
                        <option value="Branding">Branding & Printing</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1.5 ml-1">Your review notes (max 120 words)</label>
                    <textarea
                      id="rev-input-review"
                      required
                      rows={3}
                      value={newReview.review}
                      onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                      placeholder="We loved our experience working with Cuva Tech. They understood our analog printing specs..."
                      className="bg-white border border-charcoal/10 p-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm resize-none"
                    />
                  </div>

                  <button
                    id="submit-testimonial-btn"
                    type="submit"
                    className="btn-primary w-full py-4 text-sm"
                  >
                    Publish Verified Testimonial
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}