import mongoose, { Schema, Document } from 'mongoose';
import { Booking as IBooking, BookingStatus, BookingService, BookingLocation, BookingSchedule, BookingPricing, BookingPayment, BookingReview } from '@localkart/shared-types';

export interface IBookingDocument extends IBooking, Document {}

const BookingServiceSchema = new Schema<BookingService>({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  estimatedDuration: { type: Number, required: true, min: 0.5, max: 24 }
}, { _id: false });

const BookingLocationSchema = new Schema<BookingLocation>({
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

const BookingScheduleSchema = new Schema<BookingSchedule>({
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

const BookingPricingSchema = new Schema<BookingPricing>({
  basePrice: { type: Number, required: true, min: 0 },
  additionalCharges: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' }
}, { _id: false });

const BookingPaymentSchema = new Schema<BookingPayment>({
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

const BookingReviewSchema = new Schema<BookingReview>({
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
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as BookingStatus[], 
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