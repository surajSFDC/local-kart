export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingService {
  category: string;
  subcategory: string;
  description: string;
  estimatedDuration: number; // hours
}

export interface BookingLocation {
  address: string;
  coordinates: [number, number];
  instructions?: string;
}

export interface BookingSchedule {
  preferredDate: string; // ISO
  preferredTime: string; // 'HH:mm'
  confirmedDate?: string; // ISO
  confirmedTime?: string; // 'HH:mm'
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
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type BookingStatus = pending | confirmed | in_progress | completed | cancelled;

export interface BookingService {
  category: string;
  subcategory: string;
  description: string;
  estimatedDuration: number; // hours
}

export interface BookingLocation {
  address: string;
  coordinates: [number, number];
  instructions?: string;
}

export interface BookingSchedule {
  preferredDate: string; // ISO
  preferredTime: string; // HH:mm
  confirmedDate?: string; // ISO
  confirmedTime?: string; // HH:mm
}

export interface BookingPricing {
  basePrice: number;
  additionalCharges: number;
  totalAmount: number;
  currency: string;
}

export interface BookingPayment {
  method: online | cash | wallet;
  status: pending | paid | refunded;
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
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
