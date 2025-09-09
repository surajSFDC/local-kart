export interface ProviderServiceItem {
  category: string;
  subcategory: string;
  basePrice: number;
  unit: 'hour' | 'service' | 'square_feet';
}

export interface ProviderServiceArea {
  city: string;
  pincodes: string[];
  radius: number; // km
}

export interface ProviderAvailabilitySlot {
  start: string; // '09:00'
  end: string;   // '18:00'
}

export interface ProviderAvailability {
  days: string[]; // ['monday', ...]
  timeSlots: ProviderAvailabilitySlot[];
}

export interface ProviderRating {
  average: number;
  count: number;
}

export interface ProviderPortfolioItem {
  images: string[];
  descriptions: string[];
}

export interface ProviderDocumentItem {
  type: 'license' | 'certificate' | 'insurance';
  url: string;
  verified: boolean;
}

export interface AIGeneratedProfile {
  summary: string;
  skills: string[];
  experience: string;
  specialties: string[];
}

export interface Provider {
  _id: string; // ObjectId
  userId: string; // ObjectId
  businessName: string;
  description: string;
  aiGeneratedProfile: AIGeneratedProfile;
  services: ProviderServiceItem[];
  serviceAreas: ProviderServiceArea[];
  availability: ProviderAvailability;
  rating: ProviderRating;
  portfolio: ProviderPortfolioItem[];
  documents: ProviderDocumentItem[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface ProviderServiceItem {
  category: string;
  subcategory: string;
  basePrice: number;
  unit: hour | service | square_feet;
}

export interface ProviderServiceArea {
  city: string;
  pincodes: string[];
  radius: number; // km
}

export interface ProviderAvailabilitySlot {
  start: string; // 09:00
  end: string;   // 18:00
}

export interface ProviderAvailability {
  days: string[]; // [monday, ...]
  timeSlots: ProviderAvailabilitySlot[];
}

export interface ProviderRating {
  average: number;
  count: number;
}

export interface ProviderPortfolioItem {
  images: string[];
  descriptions: string[];
}

export interface ProviderDocumentItem {
  type: license | certificate | insurance;
  url: string;
  verified: boolean;
}

export interface AIGeneratedProfile {
  summary: string;
  skills: string[];
  experience: string;
  specialties: string[];
}

export interface Provider {
  _id: string; // ObjectId
  userId: string; // ObjectId
  businessName: string;
  description: string;
  aiGeneratedProfile: AIGeneratedProfile;
  services: ProviderServiceItem[];
  serviceAreas: ProviderServiceArea[];
  availability: ProviderAvailability;
  rating: ProviderRating;
  portfolio: ProviderPortfolioItem[];
  documents: ProviderDocumentItem[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
