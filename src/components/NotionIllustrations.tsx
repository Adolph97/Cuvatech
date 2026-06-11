import React from 'react';

/**
 * Notion-style clean, hand-drawn vector illustrations
 * Complete with integrated CSS micro-animations for floating, pulsing, and sketchy outlines.
 */

// Custom animation styles to be injected
export const AnimationStyles = () => (
  <style>{`
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes float-reverse {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(6px) rotate(-1.5deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-subtle {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.08); }
    }
    @keyframes pencil-write {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(-3px, -2px) rotate(-2deg); }
    }
    @keyframes paper-drift {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(5px, -5px) rotate(3deg); }
    }
    .anim-float {
      animation: float 5s ease-in-out infinite;
    }
    .anim-float-delayed {
      animation: float-reverse 6s ease-in-out infinite;
      animation-delay: 1.5s;
    }
    .anim-spin-slow {
      animation: spin-slow 15s linear infinite;
      transform-origin: center;
    }
    .anim-pulse-subtle {
      animation: pulse-subtle 3s ease-in-out infinite;
    }
    .anim-pencil {
      animation: pencil-write 2.5s ease-in-out infinite;
      transform-origin: 30% 70%;
    }
    .anim-paper {
      animation: paper-drift 4s ease-in-out infinite;
      transform-origin: bottom center;
    }
  `}</style>
);

/**
 * 1. Systems & Cloud Migration Human Illustration (Notion-style)
 */
export function ITIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`}>
      <AnimationStyles />
      <svg
        viewBox="0 0 450 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full stroke-charcoal stroke-[2] line-cap-round"
      >
        {/* Soft handdrawn-looking ground shadow */}
        <ellipse cx="225" cy="325" rx="160" ry="8" fill="#1e1b18" fillOpacity="0.05" stroke="none" />
        
        {/* Cloud Backdrop Grid (Notion styled dots) */}
        <g className="anim-pulse-subtle text-charcoal/20">
          <circle cx="80" cy="80" r="1.5" fill="currentColor" />
          <circle cx="100" cy="80" r="1.5" fill="currentColor" />
          <circle cx="120" cy="80" r="1.5" fill="currentColor" />
          <circle cx="80" cy="100" r="1.5" fill="currentColor" />
          <circle cx="100" cy="100" r="1.5" fill="currentColor" />
          <circle cx="120" cy="100" r="1.5" fill="currentColor" />
        </g>

        {/* Cloud Shape - Cloud Architecture representation */}
        <g className="anim-float" style={{ transformOrigin: '280px 100px' }}>
          {/* Cloud Outline */}
          <path
            d="M 230,120 A 25,25 0 0,1 270,100 A 35,35 0 0,1 330,110 A 25,25 0 0,1 350,135 A 20,20 0 0,1 340,165 L 240,165 A 20,20 0 0,1 230,120 Z"
            fill="#FAF8F3"
            stroke="#1e1b18"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Hand-drawn parallel lines inside cloud */}
          <path d="M260 135 h60 M275 145 h40" stroke="#1e1b18" strokeWidth="1.5" strokeOpacity="0.3" />
        </g>

        {/* Server Block / Database with strong neo-brutalist shadow */}
        <g className="anim-float-delayed" style={{ transformOrigin: '120px 180px' }}>
          {/* Box Shadow */}
          <rect x="74" y="154" width="70" height="90" rx="4" fill="#1e1b18" stroke="none" />
          {/* Box Main */}
          <rect x="70" y="150" width="70" height="90" rx="4" fill="#FAF8F3" stroke="#1e1b18" strokeWidth="2.5" />
          {/* Server lines & slots */}
          <rect x="80" y="165" width="50" height="12" rx="2" fill="#EAE6DB" stroke="#1e1b18" strokeWidth="2" />
          <circle cx="90" cy="171" r="2.5" fill="#1e1b18" stroke="none" />
          
          <rect x="80" y="190" width="50" height="12" rx="2" fill="#EAE6DB" stroke="#1e1b18" strokeWidth="2" />
          <circle cx="90" cy="196" r="2.5" fill="#1e1b18" stroke="none" />
          <circle cx="102" cy="196" r="2.5" fill="#8C5D3A" stroke="none" /> {/* Accent dot */}

          <rect x="80" y="215" width="50" height="12" rx="2" fill="#EAE6DB" stroke="#1e1b18" strokeWidth="2" />
          {/* Cable coming out of server towards person */}
          <path d="M130 196 Q170 230 195 210 T240 250" stroke="#1e1b18" strokeWidth="2" fill="none" strokeDasharray="3 3" />
        </g>

        {/* human doing the synthesis - Notion Style (Bold outlines, simple hair and profile, loose hand strokes) */}
        <g id="human-developer">
          {/* Desk surface line */}
          <path d="M60 295 L390 295" stroke="#1e1b18" strokeWidth="3" strokeLinecap="round" />
          <path d="M120 295 L120 325 M330 295 L330 325" stroke="#1e1b18" strokeWidth="2" />

          {/* Chair back */}
          <path d="M165 315 L180 255 L210 255" stroke="#1e1b18" strokeWidth="2" fill="none" />

          {/* Human Body / Torso */}
          <path
            d="M 190,325 L 205,270 Q 215,225 240,225 L 265,225 Q 290,225 300,270 L 315,325"
            fill="#FAF8F3"
            stroke="#1e1b18"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Sweater collars */}
          <path d="M241 225 Q252 238 264 225" stroke="#1e1b18" strokeWidth="2" fill="none" />

          {/* Human Face / Head */}
          {/* Neck */}
          <path d="M246 225 V212 M259 225 V211" stroke="#1e1b18" strokeWidth="2" />
          {/* Face profile tilted down looking at laptop */}
          <path
            d="M 235,178 Q 235,160 250,160 Q 268,160 268,178 Q 268,198 250,198 Q 235,198 235,178 Z"
            fill="#FAF8F3"
            stroke="#1e1b18"
            strokeWidth="2.5"
          />
          {/* Cute minimalist eye glasses and smile */}
          <circle cx="245" cy="178" r="4" stroke="#1e1b18" strokeWidth="2" fill="none" />
          <path d="M241 178 h-4 M249 178 Q254 178 256 182" stroke="#1e1b18" strokeWidth="2" fill="none" />
          <path d="M244 190 Q248 193 252 190" stroke="#1e1b18" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Clean Hair (Notion character blocky ink hair style) */}
          <path
            d="M 232,176 Q 230,154 250,152 Q 272,150 271,170 Q 273,158 262,156 Q 250,154 240,166 Z"
            fill="#1e1b18"
            stroke="#1e1b18"
            strokeWidth="1.5"
          />

          {/* Hand/Arm extended to laptop */}
          {/* Left Arm */}
          <path
            d="M 210,248 Q 240,248 264,260"
            fill="none"
            stroke="#1e1b18"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Right Arm */}
          <path
            d="M 285,248 Q 278,255 258,264"
            fill="none"
            stroke="#1e1b18"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Laptop on desk with strong neo-brutalist shadow offset */}
          <g>
            {/* laptop block base shadow */}
            <path d="M246 290 H316 L331 290" stroke="#1e1b18" strokeWidth="4" strokeLinecap="round" />
            {/* Screen */}
            <polygon points="275,240 315,240 310,285 270,285" fill="#FAF8F3" stroke="#1e1b18" strokeWidth="2.5" />
            {/* Code lines on laptop screen */}
            <path d="M280 250 h20 M280 258 h25 M280 266 h15 M280 274 h10" stroke="#1e1b18" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            {/* Light glowing rays from screen */}
            <g className="anim-pulse-subtle text-clay">
              <line x1="265" y1="230" x2="270" y2="235" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="320" y1="230" x2="315" y2="235" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * 2. Printing, Journal Binding & Material Layer Human Illustration (Notion-style)
 */
export function PrintIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`}>
      <AnimationStyles />
      <svg
        viewBox="0 0 450 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full stroke-charcoal stroke-[2]"
      >
        {/* Desk/Bench ground shadow */}
        <ellipse cx="225" cy="325" rx="160" ry="8" fill="#1e1b18" fillOpacity="0.05" stroke="none" />
        
        {/* Flying paper sheets representing bespoke stationery and booklets */}
        <g className="anim-paper" style={{ transformOrigin: '100px 100px' }}>
          <rect x="80" y="70" width="45" height="60" rx="3" fill="#FAF8F3" stroke="#1e1b18" strokeWidth="2.5" />
          <path d="M90 85 h25 M90 95 h25 M90 105 h15" stroke="#1e1b18" strokeWidth="1.5" strokeOpacity="0.3" />
        </g>
        <g className="anim-float-delayed" style={{ transformOrigin: '360px 140px' }}>
          <rect x="340" y="110" width="40" height="50" rx="2" fill="#FAF8F3" stroke="#1e1b18" strokeWidth="2" transform="rotate(15 360 135)" />
        </g>

        {/* Studio workbench surface */}
        <path d="M50 295 L400 295" stroke="#1e1b18" strokeWidth="3" />
        <path d="M100 295v30 M350 295v30" stroke="#1e1b18" strokeWidth="2" />

        {/* Handheld screen-printing press tool or ruler */}
        <g className="anim-pencil" style={{ transformOrigin: '280px 220px' }}>
          {/* T-ruler layout tool */}
          <path d="M260 215 L320 250 M250 220 L275 205" stroke="#1e1b18" strokeWidth="2.5" strokeLinecap="round" />
          {/* Small draft stars */}
          <span className="anim-pulse-subtle text-clay">
            <path d="M300 195 l2 4 h4 l-3 2 l1 4 l-4-3 l-4 3 l1-4 l-3-2 h4 z" fill="currentColor" stroke="none" />
          </span>
        </g>

        {/* Human Crafter - Custom notebook binder human (Notion Style) */}
        <g id="human-binder">
          {/* Torso/Body */}
          <path
            d="M 180,325 L 195,260 Q 205,215 235,215 L 265,215 Q 295,215 305,260 L 320,325"
            fill="#FAF8F3"
            stroke="#1e1b18"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Apron strap representing manual crafting */}
          <path d="M211 230 L220 295 M289 230 L280 295 M210 295 H290" stroke="#1e1b18" opacity="0.8" strokeWidth="2" />

          {/* Face / Head */}
          <path d="M245 215 V202 M255 215 V202" stroke="#1e1b18" strokeWidth="2" />
          <path
            d="M 233,168 Q 233,150 250,150 Q 267,150 267,168 Q 267,186 250,186 Q 233,186 233,168 Z"
            fill="#FAF8F3"
            stroke="#1e1b18"
            strokeWidth="2.5"
          />
          {/* Face features (eyes, nose, focused eyebrow) */}
          <path d="M242 166 h2 M252 165 h2 M246 172 Q248 174 246 178 M244 180 Q247 182 250 180" stroke="#1e1b18" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Beautiful artist hair */}
          <path
            d="M 230,165 Q 220,135 245,140 Q 270,145 268,162 Q 275,152 260,146 Q 245,140 235,150 Z"
            fill="#1e1b18"
            stroke="#1e1b18"
            strokeWidth="1.5"
          />

          {/* Arms holding custom bound booklet */}
          <path d="M195 265 Q230 250 242 270" stroke="#1e1b18" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M305 265 Q270 250 256 270" stroke="#1e1b18" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Book on workbench being bound - custom styled with C-logo watermark! */}
          <g>
            {/* Hardcover Notebook layout */}
            <rect x="220" y="270" width="60" height="25" rx="3" fill="#EAE6DB" stroke="#1e1b18" strokeWidth="2.5" />
            <path d="M250 270 L250 295" stroke="#1e1b18" strokeWidth="2" strokeDasharray="2 1" /> {/* spine thread representation */}
            
            {/* Branded Cuva C logo mark engraved on the notebook */}
            <circle cx="236" cy="282" r="5" fill="#1e1b18" stroke="none" />
            <rect x="235" y="281" width="6" height="2" fill="#FAF8F3" stroke="none" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * 3. Marketing & SEO Growth Human Illustration (Notion-style)
 */
export function MarketingIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`}>
      <AnimationStyles />
      <svg
        viewBox="0 0 450 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full stroke-charcoal stroke-[2]"
      >
        {/* Soft ground shadow */}
        <ellipse cx="225" cy="325" rx="160" ry="8" fill="#1e1b18" fillOpacity="0.05" stroke="none" />
        
        {/* Upward growing search trends curves & abstract search tags floating */}
        <g className="anim-float">
          {/* Trend arrow */}
          <path d="M60 210 Q140 180 200 130 T340 70" stroke="#8C5D3A" strokeWidth="2.5" strokeDasharray="4 3" fill="none" />
          <path d="M330 70 h10 v10" stroke="#8C5D3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          
          {/* Floating keyword capsule tag [SEO] */}
          <g transform="translate(110, 110)">
            <rect x="0" y="0" width="55" height="22" rx="11" fill="#FAF8F3" stroke="#1e1b18" strokeWidth="1.8" />
            <text x="27.5" y="14" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#1e1b18" stroke="none">SEO</text>
          </g>

          {/* Floating star for Google ranking position 1 */}
          <g transform="translate(350, 60)" className="anim-pulse-subtle">
            <polygon points="10,0 13,7 20,7 15,12 17,20 10,15 3,20 5,12 0,7 7,7" fill="#1e1b18" stroke="none" />
          </g>
        </g>

        {/* Desk line */}
        <path d="M50 295 L400 295" stroke="#1e1b18" strokeWidth="3" />
        <path d="M90 295v30 M360 295v30" stroke="#1e1b18" strokeWidth="2" />

        {/* Megaphone / Analytics Board representing digital campaigns */}
        <g className="anim-float-delayed" style={{ transformOrigin: '90px 170px' }}>
          {/* Analytics bar chart standing on table */}
          {/* Shadow bars */}
          <rect x="80" y="184" width="16" height="50" rx="2" fill="#1e1b18" />
          <rect x="100" y="154" width="16" height="80" rx="2" fill="#1e1b18" />
          {/* Main bars */}
          <rect x="76" y="180" width="16" height="50" rx="2" fill="#FAF8F3" stroke="#1e1b18" strokeWidth="2" />
          <rect x="96" y="150" width="16" height="80" rx="2" fill="#EAE6DB" stroke="#1e1b18" strokeWidth="2" />
          <rect x="116" y="110" width="16" height="120" rx="2" fill="#FAF8F3" stroke="#1e1b18" strokeWidth="2" />
        </g>

        {/* Notion-style analytical human (seeing growth details through spyglass/magnifier) */}
        <g id="human-marketer">
          {/* Body */}
          <path
            d="M 190,325 L 205,260 Q 215,215 245,215 L 275,215 Q 305,215 315,260 L 330,325"
            fill="#FAF8F3"
            stroke="#1e1b18"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Neck */}
          <path d="M255 215 V202 M265 215 V202" stroke="#1e1b18" strokeWidth="2" />
          
          {/* Head & face tilted up, looking at the keyword star */}
          <path
            d="M 243,168 Q 243,150 260,150 Q 277,150 277,168 Q 277,186 260,186 Q 243,186 243,168 Z"
            fill="#FAF8F3"
            stroke="#1e1b18"
            strokeWidth="2.5"
          />
          {/* eye glasses & smiley expression */}
          <circle cx="264" cy="168" r="4.5" stroke="#1e1b18" strokeWidth="2" fill="none" />
          <path d="M260 168 h-4 M268.5 168 Q272 168 274 172" stroke="#1e1b18" strokeWidth="1.8" fill="none" />
          <path d="M256 179 Q259 181 262 179" stroke="#1e1b18" strokeWidth="1.5" fill="none" />

          {/* Block hair with Notion flow */}
          <path
            d="M 241,165 Q 235,138 258,138 Q 281,138 278,162 Q 282,150 270,145 Q 255,140 245,152 Z"
            fill="#1e1b18"
            stroke="#1e1b18"
            strokeWidth="1.5"
          />

          {/* Hand holding a magnifying glass tool */}
          <path d="M210 265 Q235 245 250 252" stroke="#1e1b18" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          
          {/* Magnifier Glass tool */}
          <g transform="translate(245, 230) rotate(-20)">
            <circle cx="15" cy="15" r="10" stroke="#1e1b18" strokeWidth="2.5" fill="#FAF8F3" fillOpacity="0.2" />
            <line x1="22" y1="22" x2="32" y2="32" stroke="#1e1b18" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Scribble Star - Cozy handdrawn ranking starburst / sparkle
 */
export function ScribbleStar({ className = 'w-6 h-6 text-clay' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={`inline-block select-none ${className}`}>
      <path
        d="M 50,10 Q 52,48 90,50 Q 52,52 50,90 Q 48,52 10,50 Q 48,48 50,10 Z"
        fill="currentColor"
        stroke="#1e1b18"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Scribble Underline - Handmaded organic highlight line
 */
export function ScribbleUnderline({ className = 'w-full h-3 text-clay' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 20" fill="none" reserveAspectRatio="none" className={`block select-none ${className}`}>
      {/* Dynamic dual organic squiggle paths */}
      <path
        d="M 10 10 Q 80 18, 150 11 T 290 8"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 18 15 Q 90 19, 160 14 T 282 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}

/**
 * Handdrawn Arrow - Curved sketchy connector arrow
 */
export function HanddrawnArrow({ className = 'w-16 h-16 text-charcoal' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={`select-none ${className}`}>
      <path
        d="M 15 15 Q 55 10 75 45 T 70 80"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 58 70 L 72 82 L 82 66"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Scribble Circle - Organic, imperfect surrounding loops
 */
export function ScribbleCircle({ className = 'w-full h-full text-clay' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={`select-none ${className}`}>
      <path
        d="M 110,32 Q 115,10 65,8 Q 5,10 8,30 Q 12,50 67,52 Q 116,48 108,22 Q 102,12 85,15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

