import mongoose, { Schema, Document } from 'mongoose';
import { Provider as IProvider, ProviderServiceItem, ProviderServiceArea, ProviderAvailability, ProviderRating, ProviderPortfolioItem, ProviderDocumentItem, AIGeneratedProfile } from '@localkart/shared-types';

export interface IProviderDocument extends Omit<IProvider, '_id'>, Document {}

const ProviderServiceItemSchema = new Schema<ProviderServiceItem>({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 },
  unit: { type: String, enum: ['hour', 'service', 'square_feet'], required: true }
}, { _id: false });

const ProviderServiceAreaSchema = new Schema<ProviderServiceArea>({
  city: { type: String, required: true },
  pincodes: [{ type: String, required: true }],
  radius: { type: Number, required: true, min: 1, max: 50 }
}, { _id: false });

const ProviderAvailabilitySlotSchema = new Schema({
  start: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  end: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
}, { _id: false });

const ProviderAvailabilitySchema = new Schema<ProviderAvailability>({
  days: [{ 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true 
  }],
  timeSlots: [ProviderAvailabilitySlotSchema]
}, { _id: false });

const ProviderRatingSchema = new Schema<ProviderRating>({
  average: { type: Number, default: 0, min: 0, max: 5 },
  count: { type: Number, default: 0, min: 0 }
}, { _id: false });

const ProviderPortfolioItemSchema = new Schema<ProviderPortfolioItem>({
  images: [{ type: String, required: true }],
  descriptions: [{ type: String, required: true }]
}, { _id: false });

const ProviderDocumentItemSchema = new Schema<ProviderDocumentItem>({
  type: { type: String, enum: ['license', 'certificate', 'insurance'], required: true },
  url: { type: String, required: true },
  verified: { type: Boolean, default: false }
}, { _id: false });

const AIGeneratedProfileSchema = new Schema<AIGeneratedProfile>({
  summary: { type: String, required: true },
  skills: [{ type: String, required: true }],
  experience: { type: String, required: true },
  specialties: [{ type: String, required: true }]
}, { _id: false });

const ProviderSchema = new Schema<IProviderDocument>({
  userId: { 
    type: Schema.Types.ObjectId as any, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  businessName: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  aiGeneratedProfile: { type: AIGeneratedProfileSchema, required: true },
  services: [ProviderServiceItemSchema],
  serviceAreas: [ProviderServiceAreaSchema],
  availability: { type: ProviderAvailabilitySchema, required: true },
  rating: { type: ProviderRatingSchema, default: { average: 0, count: 0 } },
  portfolio: [ProviderPortfolioItemSchema],
  documents: [ProviderDocumentItemSchema],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
ProviderSchema.index({ userId: 1 }, { unique: true });
ProviderSchema.index({ 'serviceAreas.city': 1 });
ProviderSchema.index({ 'services.category': 1 });
ProviderSchema.index({ 'serviceAreas.city': 1, 'services.category': 1 });
ProviderSchema.index({ rating: -1, isActive: 1 });
ProviderSchema.index({ isVerified: 1, isActive: 1 });

// Text search index for business name and description
ProviderSchema.index({ 
  businessName: 'text', 
  description: 'text',
  'aiGeneratedProfile.summary': 'text',
  'aiGeneratedProfile.skills': 'text'
});

export const Provider = mongoose.model<IProviderDocument>('Provider', ProviderSchema);