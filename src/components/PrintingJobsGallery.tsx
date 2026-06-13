import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Vite-compatible image import - correct path to gallery folder
const imageModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', { eager: true });
const images: string[] = Object.values(imageModules).map((mod: any) => mod.default || mod);

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function PrintingJobsGallery() {
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
            {images.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="overflow-hidden rounded-xl border border-charcoal/5 shadow-sm aspect-square group"
              >
                <img
                  src={src}
                  alt={`Printing job ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {images.length === 0 && (
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
