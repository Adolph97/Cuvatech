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
    name: 'Eleanor Vance',
    company: 'Scribe Editorial Co.',
    sector: 'Creative Publishing',
    role: 'Editorial Director',
    review: 'Cuva Tech feels like what happens when a warm, independent bookstore manages your server stacks. They took our old on-prem storage cloudwards in a single weekend. Absolute artisans.',
    rating: 5,
    serviceType: 'IT',
    date: 'April 2026'
  },
  {
    id: 't2',
    name: 'Kofi Larsson',
    company: 'Niche Brew Labs',
    sector: 'Hospitality & Retail',
    role: 'Brand Lead',
    review: 'Our custom-printed tote bags and invoice sets are exquisite. They feel like true physical stationery, complete with beautiful organic textures. The Canva connection was seamless.',
    rating: 5,
    serviceType: 'Branding',
    date: 'May 2026'
  },
  {
    id: 't3',
    name: 'Mira Thorne',
    company: 'Stoke & Ember',
    sector: 'Sustainable Architecture',
    role: 'Managing Partner',
    review: 'Their digital marketing approach is pure calm. No spammy popups, just clean, high-intent architectural search ranking and beautiful, thoughtful newsletters that clients actually read.',
    rating: 5,
    serviceType: 'Digital Marketing',
    date: 'June 2026'
  },
  {
    id: 't4',
    name: 'Julian Vance',
    company: 'Drawn & Bound',
    sector: 'Digital Art Collective',
    role: 'Product Lead',
    review: 'We had a complex web framework that needed secure deployment and continuous health rules. Cuva Tech mapped the architecture as a gorgeous ink illustration. Extremely helpful team!',
    rating: 4.8,
    serviceType: 'IT',
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
