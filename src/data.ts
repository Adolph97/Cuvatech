import { ITService, PrintingProduct, Testimonial, TeamMember } from './types';
import AchilikeVictor from './assets/images/Achilike Victor.jpeg';
import ObinnaIhekona from './assets/images/Obinna Ihekona.png';

export const IT_SERVICES: ITService[] = [
  {
    id: 'cloud-migration',
    title: 'Onsite to Cloud Migration',
    tagline: 'Your digital foundation, made weightless.',
    description: 'We carefully migrate your dusty closet server rigs into warm, elastic cloud architecture without dropping a single packet.',
    bullets: [
      'Complete pre-flight hardware and software audits',
      'Zero-downtime database and client state synchronization',
      'Secure legacy decryption and post-migration validation tests',
      'Interactive team onboarding and network routing handover'
    ]
  },
  {
    id: 'cloud-architecture',
    title: 'Cloud / Solutions Architecture',
    tagline: 'Blueprints hand-sketched, built sandbox-tough.',
    description: 'Custom backends engineered on paper first. We model resilient setups tailored precisely to your actual usage, preventing costly bill spikes.',
    bullets: [
      'Multi-region failover and automatic load partitioning',
      'Secure, containerized API gateways and data micro-layers',
      'Detailed, cost-optimized monthly footprint pre-calculations',
      'DDoS shield integration and strict IAM user configuration'
    ]
  },
  {
    id: 'infrastructure-management',
    title: 'IT Infrastructure Management',
    tagline: 'Constant vigilance, with an artisanal touch.',
    description: 'Continuous monitoring of your pipelines and servers. When an alert rings, we respond individually with bespoke remedies, not generic scripts.',
    bullets: [
      'Live server performance monitoring and active logging',
      'Proactive hotfix deployments and security rule patches',
      'Daily encryptions, backups, and off-site cloud vault storage',
      '24/7 dedicated lead architect on-call support tier'
    ]
  },
  {
    id: 'hardware-software-install',
    title: 'Hardware & Software Setup',
    tagline: 'Plugs, wires, and silicon, cleanly aligned.',
    description: 'From physical office enterprise network configurations to high-speed workspace server cabinets, we plug every cable with aesthetic neatness.',
    bullets: [
      'High-performance on-premise networking (Wi-Fi 7 / Fiber setup)',
      'Secure workstation local backups and hardware firewall links',
      'Licensed enterprise operational suite configuration',
      'Neat, minimalist cable management and diagnostic label maps'
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
    id: 'notebooks',
    label: 'Jotters & Notebooks',
    description: 'Hardcover hand-bound grid notebooks with durable canvas spines and recycled cream stock.',
    basePrice: 6.00,
    unitLabel: 'Notebooks',
    minQty: 25
  },
  {
    id: 'receipts',
    label: 'Receipt & Invoice Booklets',
    description: 'Carbonless duplicate pads meticulously typed and bound with heavy cardboard backing.',
    basePrice: 8.50,
    unitLabel: 'Booklets',
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
    id: 'souvenirs',
    label: 'Souvenirs & Merchandise',
    description: 'Handcrafted ceramic mugs, organic tote bags, or heavy brass enamel keyrings.',
    basePrice: 3.50,
    unitLabel: 'Items',
    minQty: 30
  },
  {
    id: 'pens',
    label: 'Pens & Fine Writing Tools',
    description: 'Sleek matte metal-barrel ballpoint pens laser-engraved with your typography.',
    basePrice: 1.10,
    unitLabel: 'Pens',
    minQty: 50
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
