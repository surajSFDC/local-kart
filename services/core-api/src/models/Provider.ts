import mongoose, { Schema, Document } from 'mongoose';

export interface IProviderDocument extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  description: string;
  aiGeneratedProfile: {
    summary: string;
    skills: string[];
    experience: string;
    specialties: string[];
  };
  services: Array<{
    category: string;
    subcategory: string;
    basePrice: number;
    unit: 'hour' | 'service' | 'square_feet';
  }>;
  serviceAreas: Array<{
    city: string;
    pincodes: string[];
    radius: number;
  }>;
  availability: {
    days: string[];
    timeSlots: Array<{
      start: string;
      end: string;
    }>;
  };
  rating: {
    average: number;
    count: number;
  };
  portfolio: Array<{
    images: string[];
    descriptions: string[];
  }>;
  documents: Array<{
    type: 'license' | 'certificate' | 'insurance';
    url: string;
    verified: boolean;
  }>;
  isVerified: boolean;
  isActive: boolean;
}

const ProviderServiceItemSchema = new Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 },
  unit: { type: String, enum: ['hour', 'service', 'square_feet'], required: true }
}, { _id: false });

const ProviderServiceAreaSchema = new Schema({
  city: { type: String, required: true },
  pincodes: [{ type: String, required: true }],
  radius: { type: Number, required: true, min: 1, max: 50 }
}, { _id: false });

const ProviderAvailabilitySlotSchema = new Schema({
  start: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  end: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
}, { _id: false });

const ProviderAvailabilitySchema = new Schema({
  days: [{ 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true 
  }],
  timeSlots: [ProviderAvailabilitySlotSchema]
}, { _id: false });

const ProviderRatingSchema = new Schema({
  average: { type: Number, default: 0, min: 0, max: 5 },
  count: { type: Number, default: 0, min: 0 }
}, { _id: false });

const ProviderPortfolioItemSchema = new Schema({
  images: [{ type: String, required: true }],
  descriptions: [{ type: String, required: true }]
}, { _id: false });

const ProviderDocumentItemSchema = new Schema({
  type: { type: String, enum: ['license', 'certificate', 'insurance'], required: true },
  url: { type: String, required: true },
  verified: { type: Boolean, default: false }
}, { _id: false });

const AIGeneratedProfileSchema = new Schema({
  summary: { type: String, required: true },
  skills: [{ type: String, required: true }],
  experience: { type: String, required: true },
  specialties: [{ type: String, required: true }]
}, { _id: false });

const ProviderSchema = new Schema<IProviderDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
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