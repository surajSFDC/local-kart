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
  _id: string; // MongoDB ObjectId as string
  email: string;
  password: string; // hashed
  role: UserRole;
  profile: UserProfile;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
