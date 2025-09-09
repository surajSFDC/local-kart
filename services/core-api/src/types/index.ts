// Local types for the API service
export interface GeoLocation {
  address: string;
  coordinates: [number, number]; // [lng, lat]
  city: string;
  state: string;
  pincode: string;
}

export type UserRole = 'customer' | 'provider' | 'admin';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  language: string;
  location: GeoLocation;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderServiceItem {
  category: string;
  subcategory: string;
  basePrice: number;
  unit: 'hour' | 'service' | 'square_feet';
}

export interface ProviderServiceArea {
  city: string;
  pincodes: string[];
  radius: number;
}

export interface ProviderAvailabilitySlot {
  start: string;
  end: string;
}

export interface ProviderAvailability {
  days: string[];
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
  _id: string;
  userId: string;
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
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingService {
  category: string;
  subcategory: string;
  description: string;
  estimatedDuration: number;
}

export interface BookingLocation {
  address: string;
  coordinates: [number, number];
  instructions?: string;
}

export interface BookingSchedule {
  preferredDate: string;
  preferredTime: string;
  confirmedDate?: string;
  confirmedTime?: string;
}

export interface BookingPricing {
  basePrice: number;
  additionalCharges: number;
  totalAmount: number;
  currency: string;
}

export interface BookingPayment {
  method: 'online' | 'cash' | 'wallet';
  status: 'pending' | 'paid' | 'refunded';
  transactionId?: string;
}

export interface BookingReview {
  rating: number;
  comment: string;
  images?: string[];
}

export interface Booking {
  _id: string;
  customerId: string;
  providerId: string;
  service: BookingService;
  location: BookingLocation;
  schedule: BookingSchedule;
  pricing: BookingPricing;
  status: BookingStatus;
  payment: BookingPayment;
  review?: BookingReview;
  createdAt: string;
  updatedAt: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'location';

export interface MessageAttachment {
  url: string;
  filename: string;
  size: number;
}

export interface Message {
  _id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  isRead: boolean;
  createdAt: string;
}