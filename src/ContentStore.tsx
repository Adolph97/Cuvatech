import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContentContextType {
  content: any;
  setContent: (content: any) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const DEFAULT_CONTENT: Record<string, any> = {
  homepage: {
    heroTitle: "Optimizing Businesses.",
    heroSubtitle: "Cuva Tech is your full-service crew for IT solutions, branding & printing, and digital marketing. Growing businesses get one calm partner instead of five vendors.",
    heroCtaPrimary: "Start a project",
    heroCtaSecondary: "See what we do",
    stats: [
      { value: "120+", label: "projects" },
      { value: "98%", label: "retention" },
      { value: "24/7", label: "support" }
    ],
    coreOverview: {
      eyebrow: "Core Ecosystem",
      title: "Three Unified Creative Practices",
      cards: [
        { title: "IT Solutions", description: "Onsite servers migrated seamlessly to AWS & GCP cloud meshes, configured with multi-region backup structures." },
        { title: "Branding & Print", description: "Logo design, Print Shop (T-shirts, Caps, Menus, etc.), and Free Consultations for your brand identity." },
        { title: "Digital Marketing", description: "On-page SEO diagnostics, semantic keyword maps, Meta & Google Ad sandbox campaigns focused on CPA." }
      ]
    },
    brandingSection: { title: "Branding, Logos & Print", subtitle: "We design lasting brandmarks and print them on premium, eco-friendly assets. Choose between linking your Canva projects directly or using our custom product configurators." },
    itSection: { title: "IT Solutions & Systems", subtitle: "Quiet, bulletproof infrastructure built for creative minds. We draft setups using paper-based clarity before engineering cloud architectures that withstand massive traffic peaks." },
    marketingSection: {
      title: "Digital Marketing and Business Insights",
      subtitle: "Quiet, human-intent marketing campaigns designed to convert high-value leads. No flashing triggers, just clean visibility that speaks clearly to decision makers in tech and design.",
      seo: {
        eyebrow: "Organic Traffic Engine [SEO]",
        headline: "SEO audits with",
        headlineAccent: "high-intent precision.",
        description: "We don\u2019t chase vanity metrics or write robotic AI paragraphs. We design deep technical crawls, semantic HTML guidelines, structural schema mapping, and coordinate hand-researched industry backlinks.",
        bullets: ["On-page performance audit & loading speed acceleration", "Strategic key-phrase mapping targeting zero-volume vanity overrides", "Semantic schemas for deep snippet categorization", "Bespoke link curation in high-authority tech/design logs"]
      },
      ads: {
        eyebrow: "Targeted Ad Networks [Paid Campaigns]",
        headline: "Direct conversions,",
        headlineAccent: "minimal expenditure waste.",
        description: "We deploy targeted Google Search, Meta Social, and LinkedIn B2B structures. We structure precise audiences with high buyers intent, craft high-editorial design hooks, and report performance with absolute clarity.",
        didYouKnow: "Google Ads targeting exact high-intent schemas see a 42% decrease in cost-per-click compared to wide AI auto-matching structures."
      },
      social: {
        eyebrow: "Platform Presence [Social Media]",
        headline: "Authentic storytelling,",
        headlineAccent: "beautifully typeset.",
        description: "We formulate custom content schedules across LinkedIn, Instagram, and X/Twitter. We curate thought-provoking threads, designs, and case histories that engage peers."
      },
      analytics: {
        eyebrow: "Data & Retention [Analytics & Email]",
        headline: "Actionable insights,",
        headlineAccent: "tailored messaging.",
        description: "We bridge the gap between raw data and creative strategy. From deep GA4 audits to highly-personalized email automation, we ensure every touchpoint is measured and meaningful.",
        bullets: ["Advanced GA4 / GTM implementation and event tracking", "Custom performance dashboards and conversion path analysis", "Drip-campaign architecture and high-editorial email design", "A/B testing protocols for landing pages and subject lines"]
      }
    }
  },
  navbar: [
    { id: "hero", label: "Home" },
    { id: "it-services", label: "IT Services" },
    { id: "branding-printing", label: "Branding & Printing" },
    { id: "digital-marketing", label: "Marketing" },
    { id: "printing-jobs", label: "Printing Jobs" },
    { id: "blog", label: "Journal" },
    { id: "testimonials", label: "Reviews" },
    { id: "contact", label: "Say Hello" }
  ],
  footer: {
    tagline: "We use technology to improve performance and productivity making sure there is alignment in the business goals and technology requirements for every business",
    newsletterEyebrow: "STUDIO DISPATCH",
    newsletterTitle: "Subscribe to local brand logs",
    newsletterSubtitle: "Thoughtful paragraphs about server configurations, print inks, and layout theories.",
    columns: [
      { title: "Sections", links: [{ label: "Homepage", target: "hero" }, { label: "IT Cloud Systems", target: "it-services" }, { label: "Printing Configs", target: "branding-printing" }, { label: "Digital Marketing", target: "digital-marketing" }] },
      { title: "Company", links: [{ label: "Our Story", target: "about-us" }, { label: "Client Reviews", target: "testimonials" }, { label: "Contact Studio", target: "contact" }, { label: "Admin Portal", target: "admin" }] }
    ],
    copyright: "\u00a9 2026 Cuva Tech."
  },
  about: {
    eyebrow: "Our Story & Values",
    title: "Everything starts with",
    titleAccent: "craftsmanship.",
    subtitle: "We are a multi-service technology and creative synthesis studio. We believe that technology should feel less like cold aluminum servers, and more like beautiful, warm physical stationery.",
    storyButton: "Read Our Full Story",
    modalEyebrow: "Cuva Origins",
    modalTitle: "Our Story & Mission",
    story: {
      heading: "Bridging the gap between heavy cloud infrastructure and manual typography.",
      paragraphs: [
        "Founded in Dublin in 2024, Cuva Tech emerged from a simple question: Why must high-performance IT solutions feel so sterile? Our founder, Efe Cuva, spent years wiring remote database nodes across heavy financial networks, yet spent weekends collecting manual handpressed journals and studying print ink absorption rules.",
        "We realized that the best brands aren\u2019t built with off-the-shelf automated scripts or template blocks. They require bespoke physical presence combined with weightless, secure cloud engines."
      ],
      principles: [
        { eyebrow: "Symmetry", title: "Symmetrical Synthesis", text: "Your website layout, search keywords, and actual printed invoicing books are custom engineered in tandem." },
        { eyebrow: "Quality", title: "Uncompromising", text: "No cookie-cutter AI automation codes. Everything is adjusted, compiled, and hand-sketched by lead designers." }
      ],
      missionLabel: "OUR MISSION",
      mission: "To humanize the digital workspace by engineering bulletproof cloud systems and elegant material craft that commands respect, builds trust, and endures.",
      visionLabel: "OUR VISION",
      vision: "We envision a technological landscape where digital interfaces preserve personal craftsmanship, where infrastructure represents high design, and where client relations are cultivated through quiet competence and tea."
    },
    teamEyebrow: "The Architects",
    teamTitle: "Our Leading Craftsmen"
  },
  services: {
    it: [
      { id: "hardware-software-setup", title: "Hardware/Software Setup", tagline: "Precision installs for seamless operations.", description: "Expert physical and virtual setups to get your office running at peak efficiency.", bullets: ["Printer & peripheral installation", "POS (Point of Sale) system integration", "Desktop & workstation deployment", "CRM & enterprise software integration"] },
      { id: "it-infrastructure", title: "IT Infrastructure Support & Management", tagline: "Quiet, bulletproof systems for creative minds.", description: "Ongoing management and support to ensure your technology never stands in the way of your growth.", bullets: ["AI integration & workflow automation", "Remote technical support & monitoring", "Secure network architecture & maintenance", "Cloud solutions & virtualization"] },
      { id: "web-development", title: "Web Development", tagline: "High-performance digital experiences.", description: "Custom web solutions designed for speed, security, and exceptional user experience.", bullets: ["Responsive frontend architecture", "Scalable backend systems", "E-commerce & custom web apps", "Ongoing maintenance & performance optimization"] },
      { id: "cloud-solutions", title: "Cloud Solutions", tagline: "Elastic, secure, and always accessible.", description: "Modernize your workflow with cloud-native architectures that scale with your business.", bullets: ["AWS, GCP & Azure migrations", "Cloud-based backup & disaster recovery", "Serverless computing & microservices", "Cost-optimized cloud footprints"] },
      { id: "software-development", title: "Software Development", tagline: "Bespoke tools for complex challenges.", description: "Engineered software solutions tailored precisely to your internal business processes.", bullets: ["Custom business logic & internal tools", "API development & integration", "Mobile-first software solutions", "Legacy system modernization"] }
    ],
    itBanner: { title: "Unsure about legacy database frameworks?", text: "We offer free, zero-commitment physical tech audits. Let our principal systems architect sit down with you (via video call or hot tea) to map out your architecture securely.", cta: "Schedule System Audit" }
  },
  testimonials: [
    { id: "t1", name: "Efe Jastel", company: "Jastel Water", sector: "Beverage Distribution", role: "Operations Manager", review: "Cuva Tech transformed our bottled water branding and packaging. Their custom label printing and delivery service ensured our products reached every corner of the city. The 10kg minimum order was perfect for our distribution needs.", rating: 5, serviceType: "Branding", date: "May 2026" },
    { id: "t2", name: "Dr. Sarah Ngu", company: "Surjen Healthcare", sector: "Healthcare Supplies", role: "Procurement Director", review: "Our medical facility required high-quality printed materials with specific delivery requirements. Cuva Tech delivered branded health brochures and safety signage with their premium handling service. Outstanding attention to detail for healthcare protocols.", rating: 5, serviceType: "Branding", date: "June 2026" },
    { id: "t3", name: "Amina Hassan", company: "Nubien Spa", sector: "Wellness & Spa", role: "Spa Director", review: "The custom branded amenity kits and menu cards elevated our spa experience. Cuva Tech understood our luxury positioning and delivered materials that matched our premium service standards.", rating: 5, serviceType: "Branding", date: "April 2026" },
    { id: "t4", name: "Marcus Johnson", company: "Five Toes Plus", sector: "Retail & Fashion", role: "Store Owner", review: "Our retail chain needed consistent branding across 15 locations. Cuva Tech handled our tote bags, signage, and shopping bags with impeccable quality and on-time delivery.", rating: 5, serviceType: "Branding", date: "May 2026" },
    { id: "t5", name: "James Halibiz", company: "Halibiz Industries", sector: "Manufacturing", role: "Plant Manager", review: "We required industrial safety signage and equipment labeling in bulk quantities. Cuva Tech met our 10kg minimum order requirement and delivered weather-resistant materials that exceeded expectations.", rating: 4.8, serviceType: "Branding", date: "March 2026" },
    { id: "t6", name: "David Bodyfit", company: "Body Solutions Garage", sector: "Fitness & Wellness", role: "Founder", review: "Custom workout programs printed in beautiful softcover notebooks for our clients. Cuva Tech understood the fitness industry aesthetic and delivered materials that motivate our members.", rating: 5, serviceType: "Branding", date: "June 2026" },
    { id: "t7", name: "Rev. Samuel Okonkwo", company: "The Leprosy Mission Abuja", sector: "Nonprofit", role: "Communications Director", review: "As a nonprofit, we needed professional printed materials for our outreach programs. Cuva Tech provided exceptional service at reasonable rates, helping us communicate our mission with dignity and clarity.", rating: 5, serviceType: "Branding", date: "January 2026" },
    { id: "t8", name: "Richard Sherman", company: "Sherman Pour Co Illinois", sector: "Industrial Manufacturing", role: "Production Manager", review: "Our chemical pouring equipment manuals and safety documentation needed precise printing. Cuva Tech handled technical specifications with accuracy and their delivery service ensured timely arrival at our Illinois facility.", rating: 4.9, serviceType: "IT", date: "April 2026" },
    { id: "t9", name: "David Scott", company: "David Scott Fashion", sector: "Fashion & Apparel", role: "Creative Director", review: "The custom printed lookbooks and fabric tags elevated our fashion showcase. Cuva Tech understood luxury fashion branding and delivered materials that complemented our seasonal collection perfectly.", rating: 5, serviceType: "Branding", date: "February 2026" },
    { id: "t10", name: "Coach Michael Springfield", company: "Springfield Intl Soccer Club", sector: "Sports & Athletics", role: "Team Manager", review: "Team jerseys, program booklets, and branded merchandise for our international matches. Cuva Tech delivered on their 10kg minimum order promise and helped our club look professional on the field.", rating: 5, serviceType: "Branding", date: "May 2026" }
  ]
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<any>(DEFAULT_CONTENT);

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setContent(data && typeof data === 'object' ? data : DEFAULT_CONTENT))
      .catch(err => console.error('Error fetching site content:', err));
  }, []);

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
