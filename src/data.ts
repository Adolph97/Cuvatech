import { ITService, PrintingProduct, Testimonial, TeamMember } from './types';
import AchilikeVictor from './assets/images/Achilike Victor.jpeg';
import ObinnaIhekona from './assets/images/Obinna Ihekona.png';

export const IT_SERVICES: ITService[] = [
  {
    id: 'hardware-software-setup',
    title: 'Hardware/Software Setup',
    tagline: 'Precision installs for seamless operations.',
    description: 'Expert physical and virtual setups to get your office running at peak efficiency.',
    bullets: [
      'Printer & peripheral installation',
      'POS (Point of Sale) system integration',
      'Desktop & workstation deployment',
      'CRM & enterprise software integration'
    ]
  },
  {
    id: 'it-infrastructure',
    title: 'IT Infrastructure Support & Management',
    tagline: 'Quiet, bulletproof systems for creative minds.',
    description: 'Ongoing management and support to ensure your technology never stands in the way of your growth.',
    bullets: [
      'AI integration & workflow automation',
      'Remote technical support & monitoring',
      'Secure network architecture & maintenance',
      'Cloud solutions & virtualization'
    ]
  },
  {
    id: 'web-development',
    title: 'Web Development',
    tagline: 'High-performance digital experiences.',
    description: 'Custom web solutions designed for speed, security, and exceptional user experience.',
    bullets: [
      'Responsive frontend architecture',
      'Scalable backend systems',
      'E-commerce & custom web apps',
      'Ongoing maintenance & performance optimization'
    ]
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    tagline: 'Elastic, secure, and always accessible.',
    description: 'Modernize your workflow with cloud-native architectures that scale with your business.',
    bullets: [
      'AWS, GCP & Azure migrations',
      'Cloud-based backup & disaster recovery',
      'Serverless computing & microservices',
      'Cost-optimized cloud footprints'
    ]
  },
  {
    id: 'software-development',
    title: 'Software Development',
    tagline: 'Bespoke tools for complex challenges.',
    description: 'Engineered software solutions tailored precisely to your internal business processes.',
    bullets: [
      'Custom business logic & internal tools',
      'API development & integration',
      'Mobile-first software solutions',
      'Legacy system modernization'
    ]
  }
];

export const PRINTING_PRODUCTS: PrintingProduct[] = [
  {
    id: 't-shirts',
    label: 'T-shirts / Branded Apparel',
    description: 'Ultra-soft organic cotton garments silkscreened with water-based eco-inks.',
    basePrice: 16.50,
    unitLabel: 'Garments',
    minQty: 10
  },
  {
    id: 'caps',
    label: 'Custom Branded Caps',
    description: 'High-quality headwear featuring custom embroidery or precision prints.',
    basePrice: 12.00,
    unitLabel: 'Caps',
    minQty: 15
  },
  {
    id: 'banners',
    label: 'Banners (Roll-up, Pull-up)',
    description: 'Durable weather-proof canvas banners fitted with polished silver bamboo or aluminum constructs.',
    basePrice: 48.00,
    unitLabel: 'Banners',
    minQty: 1
  },
  {
    id: 'stickers',
    label: 'Stickers & Die-Cut Labels',
    description: 'Premium vinyl labels with a smooth, glare-free matte varnish suitable for packaging.',
    basePrice: 0.22,
    unitLabel: 'Labels',
    minQty: 100
  },
  {
    id: 'mugs',
    label: 'Branded Mugs & Drinkware',
    description: 'Handcrafted ceramic mugs or insulated travel containers with vibrant, lasting prints.',
    basePrice: 5.50,
    unitLabel: 'Mugs',
    minQty: 20
  },
  {
    id: 'notebooks',
    label: 'Notebooks & Note pads',
    description: 'Hardcover hand-bound grid notebooks or soft-cover branded pads with recycled stock.',
    basePrice: 6.00,
    unitLabel: 'Notebooks',
    minQty: 25
  },
  {
    id: 'menus',
    label: 'Menus & Restaurant Stationery',
    description: 'Water-resistant, beautifully typeset menu cards and table talkers for hospitality.',
    basePrice: 4.50,
    unitLabel: 'Menus',
    minQty: 10
  },
  {
    id: 'custom',
    label: 'Other Custom Printing (Bespoke)',
    description: 'Got an unusual canvas, card, or box? Describe your dimension and material dreams below.',
    basePrice: 15.00,
    unitLabel: 'Pieces',
    minQty: 5
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Efe Jastel',
    company: 'Jastel Water',
    sector: 'Beverage Distribution',
    role: 'Operations Manager',
    review: 'Cuva Tech transformed our bottled water branding and packaging. Their custom label printing and delivery service ensured our products reached every corner of the city. The 10kg minimum order was perfect for our distribution needs.',
    rating: 5,
    serviceType: 'Branding',
    date: 'May 2026'
  },
  {
    id: 't2',
    name: 'Dr. Sarah Ngu',
    company: 'Surjen Healthcare',
    sector: 'Healthcare Supplies',
    role: 'Procurement Director',
    review: 'Our medical facility required high-quality printed materials with specific delivery requirements. Cuva Tech delivered branded health brochures and safety signage with their premium handling service. Outstanding attention to detail for healthcare protocols.',
    rating: 5,
    serviceType: 'Branding',
    date: 'June 2026'
  },
  {
    id: 't3',
    name: 'Amina Hassan',
    company: 'Nubien Spa',
    sector: 'Wellness & Spa',
    role: 'Spa Director',
    review: 'The custom branded amenity kits and menu cards elevated our spa experience. Cuva Tech understood our luxury positioning and delivered materials that matched our premium service standards.',
    rating: 5,
    serviceType: 'Branding',
    date: 'April 2026'
  },
  {
    id: 't4',
    name: 'Marcus Johnson',
    company: 'Five Toes Plus',
    sector: 'Retail & Fashion',
    role: 'Store Owner',
    review: 'Our retail chain needed consistent branding across 15 locations. Cuva Tech handled our tote bags, signage, and shopping bags with impeccable quality and on-time delivery.',
    rating: 5,
    serviceType: 'Branding',
    date: 'May 2026'
  },
  {
    id: 't5',
    name: 'James Halibiz',
    company: 'Halibiz Industries',
    sector: 'Manufacturing',
    role: 'Plant Manager',
    review: 'We required industrial safety signage and equipment labeling in bulk quantities. Cuva Tech met our 10kg minimum order requirement and delivered weather-resistant materials that exceeded expectations.',
    rating: 4.8,
    serviceType: 'Branding',
    date: 'March 2026'
  },
  {
    id: 't6',
    name: 'David Bodyfit',
    company: 'Body Solutions Garage',
    sector: 'Fitness & Wellness',
    role: 'Founder',
    review: 'Custom workout programs printed in beautiful softcover notebooks for our clients. Cuva Tech understood the fitness industry aesthetic and delivered materials that motivate our members.',
    rating: 5,
    serviceType: 'Branding',
    date: 'June 2026'
  },
  {
    id: 't7',
    name: 'Rev. Samuel Okonkwo',
    company: 'The Leprosy Mission Abuja',
    sector: 'Nonprofit',
    role: 'Communications Director',
    review: 'As a nonprofit, we needed professional printed materials for our outreach programs. Cuva Tech provided exceptional service at reasonable rates, helping us communicate our mission with dignity and clarity.',
    rating: 5,
    serviceType: 'Branding',
    date: 'January 2026'
  },
  {
    id: 't8',
    name: 'Richard Sherman',
    company: 'Sherman Pour Co Illinois',
    sector: 'Industrial Manufacturing',
    role: 'Production Manager',
    review: 'Our chemical pouring equipment manuals and safety documentation needed precise printing. Cuva Tech handled technical specifications with accuracy and their delivery service ensured timely arrival at our Illinois facility.',
    rating: 4.9,
    serviceType: 'IT',
    date: 'April 2026'
  },
  {
    id: 't9',
    name: 'David Scott',
    company: 'David Scott Fashion',
    sector: 'Fashion & Apparel',
    role: 'Creative Director',
    review: 'The custom printed lookbooks and fabric tags elevated our fashion showcase. Cuva Tech understood luxury fashion branding and delivered materials that complemented our seasonal collection perfectly.',
    rating: 5,
    serviceType: 'Branding',
    date: 'February 2026'
  },
  {
    id: 't10',
    name: 'Coach Michael Springfield',
    company: 'Springfield Intl Soccer Club',
    sector: 'Sports & Athletics',
    role: 'Team Manager',
    review: 'Team jerseys, program booklets, and branded merchandise for our international matches. Cuva Tech delivered on their 10kg minimum order promise and helped our club look professional on the field.',
    rating: 5,
    serviceType: 'Branding',
    date: 'May 2026'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'Achilike Victor',
    role: 'Founder & Infrastructure Lead',
    bio: 'Believes in clean hardware wires, beautiful paper weights, and server instances that write quiet diaries instead of chaotic telemetry. Crafted over 200 cloud configurations.',
    image: AchilikeVictor,
  },
  
  {
    id: 'm2',
    name: 'Obinna Ihekona',
    role: 'Development & Design Lead',
    bio: 'A full-stack artisan who hand-codes every line of CSS and JavaScript. He has a background in fine arts and software engineering, blending aesthetics with functionality in every project.',
    image: ObinnaIhekona
  }
];

export const TRUSTPILOT_DATA = {
  rating: 4.9,
  count: 148,
  reviews: [
    {
      author: 'Alistair G.',
      text: 'Genuinely personal service. High-end design details coupled with sound server tech.',
      stars: 5,
      time: '2 days ago'
    },
    {
      author: 'Clara S.',
      text: 'Cuva Tech feels like a craft workshop for tech. Super responsive printing configurator too.',
      stars: 5,
      time: '1 week ago'
    }
  ]
};

// Delivery fee configuration (default values - can be overridden via admin settings API)
export const DELIVERY_FEES = {
  standard: 35,
  standardFee: 35,
  premiumClients: ['Jastel Water', 'Surjen Healthcare'],
  premiumFee: 45,
  minOrderWeightKg: 10,
  deliveryNotes: {
    general: 'Delivery within 5-7 business days after proof approval. All orders must meet minimum 10kg requirement.',
    premium: 'Priority delivery for premium clients. Orders over 20kg qualify for free delivery on subsequent orders.'
  }
};

// Function to merge API delivery settings with defaults (kept for reference)
export const updateDeliveryFees = (apiSettings: {
  deliveryFee?: number;
  premiumDeliveryFee?: number;
  minOrderWeightKg?: number;
  premiumClients?: string[];
}) => {
  if (apiSettings.deliveryFee !== undefined) {
    DELIVERY_FEES.standard = apiSettings.deliveryFee;
    DELIVERY_FEES.standardFee = apiSettings.deliveryFee;
  }
  if (apiSettings.premiumDeliveryFee !== undefined) {
    DELIVERY_FEES.premiumFee = apiSettings.premiumDeliveryFee;
  }
  if (apiSettings.minOrderWeightKg !== undefined) {
    DELIVERY_FEES.minOrderWeightKg = apiSettings.minOrderWeightKg;
  }
  if (apiSettings.premiumClients !== undefined) {
    DELIVERY_FEES.premiumClients = apiSettings.premiumClients;
  }
};
