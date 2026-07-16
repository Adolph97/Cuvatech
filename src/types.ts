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
  id: PrintingProductCategory;
  label: string;
  description: string;
  basePrice: number;
  unitLabel: string;
  minQty: number;
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
  minOrderWeightKg: number;
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
  minOrderWeightKg: number;
  premiumClients: string[];
}
