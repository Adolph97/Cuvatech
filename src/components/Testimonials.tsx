import React, { useState } from 'react';
import { TESTIMONIALS, TRUSTPILOT_DATA } from '../data';
import { Testimonial } from '../types';
import { Star, MessageSquarePlus, Filter, CheckCircle, Quote, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ScribbleStar, ScribbleCircle } from './NotionIllustrations';

export default function Testimonials() {
  const [filter, setFilter] = useState<'ALL' | 'IT' | 'Branding' | 'Digital Marketing'>('ALL');
  const [reviewsList, setReviewsList] = useState<Testimonial[]>(TESTIMONIALS);
  
  // Submit new review form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    company: '',
    sector: '',
    role: '',
    review: '',
    rating: 5,
    serviceType: 'IT' as 'IT' | 'Branding' | 'Digital Marketing'
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredReviews = filter === 'ALL' 
    ? reviewsList 
    : reviewsList.filter((item) => item.serviceType === filter);

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
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-charcoal/20'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="testimonials" className="py-20 bg-beige border-b-2 border-charcoal relative">
      <div className="absolute inset-0 bg-[#eef5ed]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Trustpilot Scoreboard Header */}
        <div className="bg-cream border-2 border-charcoal p-8 rounded-xl sketch-shadow mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-5">
            {/* Trustpilot custom visual design */}
            <div className="bg-[#00b67a] p-4 border-2 border-charcoal rounded-lg sketch-shadow-sm flex flex-col items-center justify-center shrink-0">
              <span className="text-white text-3xl font-black tracking-tighter leading-none select-none">Trustpilot</span>
              <div className="flex space-x-0.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="bg-white p-0.5 rounded-sm">
                    <svg className="w-3 h-3 text-[#00b67a] fill-current" viewBox="0 0 24 24">
                      <polygon points="12,1.5 15.4,8.4 23,9.5 17.5,14.8 18.8,22.3 12,18.8 5.2,22.3 6.5,14.8 1,9.5 8.6,8.4" />
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-3xl font-black text-charcoal">{TRUSTPILOT_DATA.rating}</span>
                <span className="text-charcoal/50 text-sm">out of 5.0</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mt-0.5">
                {TRUSTPILOT_DATA.count} Verified Client Stories
              </h3>
              <p className="font-sans text-xs text-charcoal/60 leading-normal">
                Based on enterprise IT frameworks, branding publications, and local SEO campaign records.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              id="submit-review-trigger"
              onClick={() => setIsFormOpen(true)}
              className="bg-cream hover:bg-sand/30 text-charcoal w-full sm:w-auto px-5 py-3 border-2 border-charcoal text-xs font-bold rounded-md sketch-shadow-sm active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5"
            >
              <MessageSquarePlus className="w-4 h-4 text-clay" />
              <span>Write a Testimonial</span>
            </button>
            <a
              id="external-trustpilot-link"
              href="https://www.trustpilot.com"
              target="_blank"
              rel="noreferrer noopener"
              className="bg-charcoal hover:bg-charcoal/90 text-cream w-full sm:w-auto px-5 py-3 border-2 border-charcoal text-xs text-center font-bold rounded-md sketch-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              See all reviews
            </a>
          </div>
        </div>

        {/* Filters and Section Intro */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-charcoal/10 relative">
          <div>
            <span className="font-hand font-bold text-lg text-clay flex items-center space-x-1">
              <span>Client Ledger</span>
              <ScribbleStar className="w-4 h-4 text-moss animate-pulse" />
            </span>
            <h4 className="font-serif text-3xl sm:text-4xl font-black text-charcoal leading-tight mt-0.5">
              Trusted by{' '}
              <span className="relative inline-block px-1">
                <span className="relative z-10">Creative Publishers</span>
                <span className="absolute inset-0 w-full h-[120%] text-clay opacity-85 -translate-y-1 block pointer-events-none">
                  <ScribbleCircle />
                </span>
              </span>{' '}
              & Innovators
            </h4>
          </div>

          {/* Filtering */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs font-bold text-charcoal/50 flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1" /> Filter segments:
            </span>
            {(['ALL', 'IT', 'Branding', 'Digital Marketing'] as const).map((type) => (
              <button
                id={`filter-${type}`}
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 text-xs font-bold border-2 rounded transition-all ${
                  filter === type
                    ? 'bg-clay text-cream border-charcoal'
                    : 'bg-white hover:bg-cream text-charcoal/80 border-charcoal/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonial Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReviews.map((review) => (
            <motion.div
              id={`rev-box-${review.id}`}
              key={review.id}
              whileHover={{ y: -5, scale: 1.01, boxShadow: '6px 6px 0px 0px rgba(30,27,24,1)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className="bg-cream border-2 border-charcoal p-8 rounded-lg sketch-shadow flex flex-col justify-between relative overflow-hidden group hover:bg-[#faf9f3] transition-all cursor-default"
            >
              {/* Hand-drawn quoting asset overlay */}
              <Quote className="w-16 h-16 text-charcoal/[0.03] absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform duration-300" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {renderStars(review.rating)}
                  <span className="font-mono text-[9px] font-bold px-2 py-0.5 border border-charcoal/15 bg-beige text-clay bg-opacity-70 rounded uppercase font-semibold">
                    {review.serviceType}
                  </span>
                </div>

                <p className="font-sans text-sm sm:text-base text-charcoal/90 leading-relaxed italic">
                  “{review.review}”
                </p>
              </div>

              <div className="pt-6 border-t border-charcoal/10 mt-6 flex items-center justify-between">
                <div>
                  <span className="font-serif font-black text-charcoal text-base block leading-none">
                    {review.name}
                  </span>
                  <span className="font-sans text-xxs text-charcoal/60 mt-1 block">
                    {review.role} • <strong className="text-charcoal">{review.company}</strong> ({review.sector})
                  </span>
                </div>
                <span className="font-hand font-bold text-xs text-clay/80">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* SUBMIT REVIEW WRITING DIALOG - MODAL */}
      {isFormOpen && (
        <div id="submit-review-overlay" className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream border-2 border-charcoal w-full max-w-md rounded-xl sketch-shadow-lg overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-sand border-b-2 border-charcoal p-5 flex items-center justify-between">
              <div>
                <span className="font-hand font-bold text-sm text-clay">Tell us your experience</span>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-charcoal leading-none">
                  Write a Testimonial
                </h3>
              </div>
              <button
                id="close-review-modal"
                onClick={() => setIsFormOpen(false)}
                className="sketch-border p-2 bg-beige hover:bg-sand text-charcoal rounded hover:scale-105 active:scale-95 transition-all font-mono font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-4 animate-scale-in">
                <div className="inline-block p-3 bg-green-50 border-2 border-charcoal rounded-full text-moss animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-xl font-bold text-charcoal">Testimonial Published!</h4>
                <p className="font-sans text-xs text-charcoal/70 leading-normal max-w-xs mx-auto">
                  Thank you for writing. Your rating has been logged securely and added instantly to the community ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Your Name</label>
                    <input
                      id="rev-input-name"
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Role / Job Title</label>
                    <input
                      id="rev-input-role"
                      type="text"
                      value={newReview.role}
                      onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                      placeholder="Agency Principal"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Company</label>
                    <input
                      id="rev-input-company"
                      type="text"
                      required
                      value={newReview.company}
                      onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                      placeholder="Acme Inc."
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Sector / Niche</label>
                    <input
                      id="rev-input-sector"
                      type="text"
                      value={newReview.sector}
                      onChange={(e) => setNewReview({ ...newReview, sector: e.target.value })}
                      placeholder="e.g. Design Studio"
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Rating Selector */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Rating Score</label>
                    <select
                      id="rev-input-rating"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-xs focus:outline-none font-bold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                      <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                      <option value="3">⭐⭐⭐ (3 / 5)</option>
                    </select>
                  </div>

                  {/* Core Service Pillar */}
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-charcoal mb-1">Service Type</label>
                    <select
                      id="rev-input-service"
                      value={newReview.serviceType}
                      onChange={(e) => setNewReview({ ...newReview, serviceType: e.target.value as any })}
                      className="bg-beige border-2 border-charcoal p-2.5 rounded text-xs focus:outline-none"
                    >
                      <option value="IT">IT Solutions</option>
                      <option value="Branding">Branding & Printing</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="font-sans text-xs font-bold text-charcoal mb-1">Your review notes (max 120 words)</label>
                  <textarea
                    id="rev-input-review"
                    required
                    rows={3}
                    value={newReview.review}
                    onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                    placeholder="We loved our experience working with Cuva Tech. They understood our analog printing specs..."
                    className="bg-beige border-2 border-charcoal p-2.5 rounded text-xs focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                <button
                  id="submit-testimonial-btn"
                  type="submit"
                  className="bg-clay hover:bg-clay/90 text-cream w-full py-3 text-xs font-bold rounded border-2 border-charcoal sketch-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center"
                >
                  Publish Verified Testimonial
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
