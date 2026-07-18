import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { PortfolioItem } from '../types';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function PrintingJobsGallery() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then((data: PortfolioItem[]) => setItems(data))
      .catch(err => console.error("Error fetching portfolio:", err));
  }, []);

  const sortedItems = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <motion.section
      id="printing-jobs"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="py-24 bg-bg relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs font-bold text-primary uppercase tracking-[0.2em] block mb-2">
            Portfolio Showcase
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-charcoal">
            Recent Printing Jobs
          </h2>
          <p className="font-sans text-lg text-charcoal/60 mt-4 max-w-2xl mx-auto">
            A selection of our latest bespoke printing projects, showcasing precision craftsmanship across materials and formats.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInScale}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {sortedItems.map((item, idx) => {
              const cardContent = (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="overflow-hidden rounded-xl border border-charcoal/5 shadow-sm group bg-bg flex flex-col"
                >
                  <div className="aspect-square overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="font-display text-charcoal/30 text-sm font-bold px-2 text-center">
                          {item.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-sm font-bold text-charcoal">{item.title}</h3>
                    {item.description && (
                      <p className="font-sans text-xs text-charcoal/60 leading-relaxed mt-1">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              );

              return item.link ? (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="contents"
                >
                  {cardContent}
                </a>
              ) : (
                <div key={item.id} className="contents">
                  {cardContent}
                </div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {items.length === 0 && (
          <motion.div
            variants={fadeInUp}
            className="text-center py-20 bg-white border border-charcoal/5 rounded-3xl"
          >
            <p className="font-sans text-charcoal/60 text-lg">
              Gallery images are being curated. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
