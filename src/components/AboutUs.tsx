import React from 'react';
import { TEAM_MEMBERS } from '../data';
import { ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { ScribbleStar, ScribbleUnderline } from './NotionIllustrations';
import Modal from './Modal';

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

// Our Story content component to be reused in modal
function OurStoryContent() {
  return (
    <div className="space-y-8">
      {/* Founding and story segments */}
      <div className="space-y-6">
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal leading-tight">
          Bridging the gap between heavy cloud infrastructure and manual typography.
        </h3>

        <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed">
          Founded in Dublin in 2024, Cuva Tech emerged from a simple question: <em>Why must high-performance IT
          solutions feel so sterile?</em> Our founder, Efe Cuva, spent years wiring remote database nodes across
          heavy financial networks, yet spent weekends collecting manual handpressed journals and studying print ink
          absorption rules.
        </p>

        <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed">
          We realized that the best brands aren't built with off-the-shelf automated scripts or template blocks.
          They require bespoke physical presence combined with weightless, secure cloud engines.
        </p>
      </div>

      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-white border border-charcoal/5 p-5 sm:p-6 rounded-2xl shadow-sm">
          <span className="font-sans font-bold text-xs text-primary uppercase tracking-wider">Symmetry</span>
          <h5 className="font-display text-lg sm:text-xl font-bold text-charcoal mt-2">Symmetrical Synthesis</h5>
          <p className="font-sans text-xs sm:text-sm text-charcoal/50 mt-2">
            Your website layout, search keywords, and actual printed invoicing books are custom engineered in tandem.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white border border-charcoal/5 p-5 sm:p-6 rounded-2xl shadow-sm">
          <span className="font-sans font-bold text-xs text-primary uppercase tracking-wider">Quality</span>
          <h5 className="font-display text-lg sm:text-xl font-bold text-charcoal mt-2">Uncompromising</h5>
          <p className="font-sans text-xs sm:text-sm text-charcoal/50 mt-2">
            No cookie-cutter AI automation codes. Everything is adjusted, compiled, and hand-sketched by lead designers.
          </p>
        </motion.div>
      </div>

      {/* Mission and Vision statements */}
      <div className="space-y-6 sm:space-y-8">
        {/* Mission Statement */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-primary/5 border border-primary/10 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden">
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3 opacity-10">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
          </div>
          <span className="font-sans text-xs font-bold text-primary uppercase tracking-widest block mb-3 sm:mb-4">
            OUR MISSION
          </span>
          <p className="font-display text-lg sm:text-xl md:text-2xl font-bold italic text-charcoal leading-relaxed">
            "To humanize the digital workspace by engineering bulletproof cloud systems and elegant material
            craft that commands respect, builds trust, and endures."
          </p>
        </motion.div>

        {/* Vision Statement */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white border border-charcoal/5 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg shadow-charcoal/5 relative overflow-hidden">
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3 opacity-10">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
          </div>
          <span className="font-sans text-xs font-bold text-charcoal/40 uppercase tracking-widest block mb-3 sm:mb-4">
            OUR VISION
          </span>
          <p className="font-sans text-sm sm:text-base text-charcoal/60 leading-relaxed italic">
            "We envision a technological landscape where digital interfaces preserve personal craftsmanship, where
            infrastructure represents high design, and where client relations are cultivated through quiet competence and tea."
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AboutUs() {
  const [isStoryModalOpen, setStoryModalOpen] = React.useState(false);

  return (
    <motion.section
      id="about-us"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-24 bg-bg relative overflow-hidden"
    >
      {/* Structural grids accents */}
      <div className="absolute inset-x-0 h-[1px] bg-charcoal/5 top-1/4" />
      <div className="absolute inset-y-0 w-[1px] bg-charcoal/5 left-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-sans font-bold text-xs text-primary tracking-widest uppercase block mb-2">
            Our Story & Values
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-charcoal leading-tight mb-6">
            Everything starts with <br />
            <span className="text-primary italic">craftsmanship.</span>
          </h2>
          <p className="font-sans text-lg text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
            We are a multi-service technology and creative synthesis studio. We believe that technology
            should feel less like cold aluminum servers, and more like beautiful, warm physical stationery.
          </p>
        </motion.div>

        {/* Our Story Button - triggers modal */}
        <motion.div
          variants={fadeInUp}
          className="flex justify-center mb-16"
        >
          <motion.button
            id="our-story-trigger"
            onClick={() => setStoryModalOpen(true)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 flex items-center space-x-3 cursor-pointer transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Our Full Story</span>
          </motion.button>
        </motion.div>

        {/* TEAM MEMBERS */}
        <motion.div variants={staggerContainer} className="relative">
          <motion.div variants={fadeInUp} className="text-center mb-16 relative max-w-sm mx-auto sm:max-w-md">
            {/* Playful float star next to team heading */}
            <div className="absolute top-[-25px] right-[10px] text-primary anim-float pointer-events-none">
              <ScribbleStar className="w-7 h-7 transform rotate-12" />
            </div>

            <span className="font-sans font-bold text-xs text-primary tracking-widest uppercase block mb-2">The Architects</span>
            <h4 className="font-display text-4xl font-extrabold text-charcoal mt-1 relative inline-block px-2">
              Our Leading Craftsmen
            </h4>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                id={`team-${member.id}`}
                key={member.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white border border-charcoal/5 rounded-[2.5rem] overflow-hidden flex flex-col cursor-default shadow-2xl shadow-charcoal/5 transition-all"
              >
                {/* Profile Image container */}
                <div className="h-96 w-full overflow-hidden border-b border-charcoal/5 bg-bg flex items-center justify-center relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md border border-charcoal/5 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                    {member.role.split(' ')[0]}
                  </div>
                </div>

                <div className="p-10 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h5 className="font-display text-3xl font-bold text-charcoal leading-none">
                      {member.name}
                    </h5>
                    <span className="font-sans font-bold text-sm text-primary uppercase tracking-widest">{member.role}</span>
                  </div>

                  <p className="font-sans text-base text-charcoal/50 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="pt-6 border-t border-charcoal/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-charcoal/20">CUVA-TEAM-{member.id}</span>
                    <span className="text-primary/40">Active Spec</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Our Story Modal - Enhanced layout */}
      <Modal isOpen={isStoryModalOpen} onClose={() => setStoryModalOpen(false)}>
        <div className="p-4 sm:p-6 md:p-8 max-w-3xl">
          {/* Modal Header with visual flair */}
          <div className="bg-primary/5 border-b border-charcoal/5 p-5 sm:p-6 md:p-8 mb-6">
            <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-[0.2em] block mb-2">
              Cuva Origins
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal leading-tight">
              Our Story & Mission
            </h3>
          </div>

          {/* Modal Content with better padding on mobile */}
          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            <OurStoryContent />
          </div>
        </div>
      </Modal>
    </motion.section>
  );
}