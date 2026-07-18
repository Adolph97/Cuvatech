export interface ITService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
}

export type PrintingProductCategory =
  | 't-shirts'
  | 'caps'
  | 'notebooks'
  | 'receipts'
  | 'banners'
  | 'stickers'
  | 'mugs'
  | 'menus'
  | 'souvenirs'
  | 'pens'
  | 'custom';

export interface PrintingProduct {
  id: string;
  label: string;
  description: string;
  basePrice: number;
  unitLabel: string;
  minOrderWeightKg: number;
  weightPerUnitKg?: number;
  imageUrl?: string;
}

export interface DesignFile {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  base64?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  sector?: string;
  role: string;
  review: string;
  rating: number;
  serviceType: 'IT' | 'Branding' | 'Digital Marketing';
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  signature?: string;
}

export interface QuoteRequest {
  serviceType: string;
  formData: Record<string, string>;
}

export interface DeliveryInfo {
  standardFee: number;
  premiumFee: number;
  premiumClients: string[];
  deliveryNotes: {
    general: string;
    premium: string;
  };
}

export interface DeliverySettings {
  deliveryFee: number;
  premiumDeliveryFee: number;
  premiumClients: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  link?: string;
  category?: string;
  order?: number;
  createdAt?: string;
}

export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string | null;
  author?: string;
  tags?: string[];
  status: BlogStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteInfoSocials {
  x: string;
  tiktok: string;
  instagram: string;
  linkedin: string;
}

export interface SiteInfo {
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  closingHours: string;
  socials: SiteInfoSocials;
  brandTagline: string;
}
