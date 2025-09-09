import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingDocument extends Document {
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  service: {
    category: string;
    subcategory: string;
    description: string;
    estimatedDuration: number;
  };
  location: {
    address: string;
    coordinates: [number, number];
    instructions?: string;
  };
  schedule: {
    preferredDate: string;
    preferredTime: string;
    confirmedDate?: string;
    confirmedTime?: string;
  };
  pricing: {
    basePrice: number;
    additionalCharges: number;
    totalAmount: number;
    currency: string;
  };
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment: {
    method: 'online' | 'cash' | 'wallet';
    status: 'pending' | 'paid' | 'refunded';
    transactionId?: string;
  };
  review?: {
    rating: number;
    comment: string;
    images?: string[];
  };
}

const BookingServiceSchema = new Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  estimatedDuration: { type: Number, required: true, min: 0.5, max: 24 }
}, { _id: false });

const BookingLocationSchema = new Schema({
  address: { type: String, required: true },
  coordinates: { 
    type: [Number], 
    required: true,
    validate: {
      validator: function(coords: number[]) {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 && 
               coords[1] >= -90 && coords[1] <= 90;
      },
      message: 'Invalid coordinates format'
    }
  },
  instructions: { type: String, maxlength: 200 }
}, { _id: false });

const BookingScheduleSchema = new Schema({
  preferredDate: { type: String, required: true },
  preferredTime: { 
    type: String, 
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  confirmedDate: { type: String },
  confirmedTime: { 
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
}, { _id: false });

const BookingPricingSchema = new Schema({
  basePrice: { type: Number, required: true, min: 0 },
  additionalCharges: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' }
}, { _id: false });

const BookingPaymentSchema = new Schema({
  method: { 
    type: String, 
    enum: ['online', 'cash', 'wallet'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'], 
    default: 'pending' 
  },
  transactionId: { type: String }
}, { _id: false });

const BookingReviewSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  images: [{ type: String }]
}, { _id: false });

const BookingSchema = new Schema<IBookingDocument>({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  providerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true 
  },
  service: { type: BookingServiceSchema, required: true },
  location: { type: BookingLocationSchema, required: true },
  schedule: { type: BookingScheduleSchema, required: true },
  pricing: { type: BookingPricingSchema, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  payment: { type: BookingPaymentSchema, required: true },
  review: { type: BookingReviewSchema }
}, {
  timestamps: true
});

// Indexes
BookingSchema.index({ customerId: 1, createdAt: -1 });
BookingSchema.index({ providerId: 1, createdAt: -1 });
BookingSchema.index({ status: 1, 'schedule.confirmedDate': 1 });
BookingSchema.index({ 'location.coordinates': '2dsphere' });
BookingSchema.index({ 'service.category': 1, status: 1 });

export const Booking = mongoose.model<IBookingDocument>('Booking', BookingSchema);