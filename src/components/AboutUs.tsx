import { TEAM_MEMBERS } from '../data';
import { ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { ScribbleStar, ScribbleUnderline } from './NotionIllustrations';

export default function AboutUs() {
  return (
    <section id="about-us" className="py-20 bg-cream border-b-2 border-charcoal relative">
      {/* Structural grids accents */}
      <div className="absolute inset-x-0 h-[1.5px] bg-charcoal/10 top-1/4" />
      <div className="absolute inset-y-0 w-[1.5px] bg-charcoal/10 left-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-hand font-bold text-lg text-clay tracking-wider uppercase block mb-1">
            04 / Intellectual Layer
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-charcoal leading-tight mb-4">
            Our Story & Values
          </h2>
          <div className="w-24 h-1 bg-charcoal mx-auto mb-6 rounded-full" />
          <p className="font-sans text-lg text-charcoal/80 leading-relaxed">
            We are a multi-service technology and creative synthesis studio. We believe that technology 
            should feel less like cold aluminum servers, and more like beautiful, warm physical stationery.
          </p>
        </div>

        {/* Founding and story segments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-charcoal leading-tight">
              Bridging the gap between heavy cloud infrastructure and manual typography.
            </h3>
            
            <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed">
              Founded in Dublin in 2024, Cuva Tech emerged from a simple question: <em>Why must high-performance IT 
              solutions feel so sterile?</em> Our founder, Efe Cuva, spent years wiring remote database nodes across 
              heavy financial networks, yet spent weekends collecting manual handpressed journals and studying print ink 
              absorption rules.
            </p>

            <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed">
              We realized that the best brands aren’t built with off-the-shelf automated scripts or template blocks. 
              They require bespoke physical presence combined with weightless, secure cloud engines. Cuva Tech brings 
              these two worlds into harmony under one roof: offering enterprise-grade Cloud Architecture, 
              handbound silk-screen print production, and high-fidelity growth marketing.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-6">
              <div className="flex-1 bg-beige border-2 border-charcoal p-5 rounded-lg sketch-shadow-sm">
                <span className="font-hand font-bold text-xs text-clay">Differentiator [I]</span>
                <h5 className="font-serif text-lg font-bold text-charcoal mt-1">Symmetrical Synthesis</h5>
                <p className="font-sans text-xs text-charcoal/70 mt-1 lines-clamp-3">
                  Your website layout, search keywords, and actual printed invoicing books are custom engineered in tandem.
                </p>
              </div>

              <div className="flex-1 bg-beige border-2 border-charcoal p-5 rounded-lg sketch-shadow-sm">
                <span className="font-hand font-bold text-xs text-clay">Differentiator [II]</span>
                <h5 className="font-serif text-lg font-bold text-charcoal mt-1 font-bold">Uncompromising Quality</h5>
                <p className="font-sans text-xs text-charcoal/70 mt-1 lines-clamp-3">
                  No cookie-cutter AI automation codes. Everything is adjusted, compiled, and hand-sketched by lead designers.
                </p>
              </div>
            </div>
          </div>

          {/* Mission and Vision statements */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mission Statement */}
            <div className="bg-sand border-2 border-charcoal p-6 sm:p-8 rounded-xl sketch-shadow relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-10">
                <BookOpen className="w-16 h-16 text-charcoal" />
              </div>
              <span className="font-mono text-xxs font-bold text-clay uppercase tracking-widest block mb-1">
                OUR MISSION STATEMENT //
              </span>
              <p className="font-serif text-xl sm:text-2xl font-bold italic text-charcoal leading-relaxed">
                “To humanize the digital workspace by engineering bulletproof cloud systems and elegant material 
                craft that commands respect, builds trust, and endures.”
              </p>
            </div>

            {/* Vision Statement */}
            <div className="bg-cream border-2 border-charcoal p-6 sm:p-8 rounded-xl sketch-shadow-lg relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-10">
                <Sparkles className="w-16 h-16 text-clay" />
              </div>
              <span className="font-mono text-xxs font-bold text-moss uppercase tracking-widest block mb-1">
                OUR VISION STATEMENT //
              </span>
              <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed font-medium italic">
                “We envision a technological landscape where digital interfaces preserve personal craftsmanship, where 
                infrastructure represents high design, and where client relations are cultivated through quiet competence and tea.”
              </p>
            </div>
          </div>
        </div>

        {/* TEAM MEMEBERS */}
        <div className="relative">
          <div className="text-center mb-12 relative max-w-sm mx-auto sm:max-w-md">
            {/* Playful float star next to team heading */}
            <div className="absolute top-[-25px] right-[10px] text-terracotta anim-float pointer-events-none">
              <ScribbleStar className="w-7 h-7 transform rotate-12" />
            </div>
            
            <span className="font-hand font-bold text-lg text-clay">The Craftsmen</span>
            <h4 className="font-serif text-3xl sm:text-4xl font-black text-charcoal mt-1 relative inline-block px-2">
              Assemble with the Architects
              <ScribbleUnderline className="absolute left-0 bottom-[-5px] w-full text-clay h-2 opacity-80" />
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                id={`team-${member.id}`}
                key={member.id}
                whileHover={{ y: -6, boxShadow: '8px 8px 0px 0px rgba(30,27,24,1)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="bg-beige border-2 border-charcoal rounded-xl overflow-hidden flex flex-col cursor-default bg-cream shadow-sm"
              >
                {/* Profile Image container secured with referrerPolicy */}
                <div className="h-72 w-full overflow-hidden border-b-2 border-charcoal bg-sand flex items-center justify-center relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-cream border border-charcoal px-2.5 py-1 text-xxs font-mono font-bold uppercase rounded">
                    {member.role.split(' ')[0]}
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-cream">
                  <div className="space-y-1">
                    <h5 className="font-serif text-2xl font-bold text-charcoal leading-none">
                      {member.name}
                    </h5>
                    <span className="font-hand font-bold text-sm text-clay">{member.role}</span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-charcoal/70 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="pt-3 border-t border-charcoal/10 flex items-center justify-between text-xxs font-mono text-charcoal/40 font-bold uppercase">
                    <span>CUVA-TEAM-{member.id}</span>
                    <span className="text-clay">Active Spec</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
