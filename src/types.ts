export interface ITService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
}

export type PrintingProductCategory =
  | 't-shirts'
  | 'notebooks'
  | 'receipts'
  | 'banners'
  | 'stickers'
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
}

export interface DesignFile {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
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
