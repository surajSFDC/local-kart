import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as IUser, UserRole, GeoLocation } from '@localkart/shared-types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const GeoLocationSchema = new Schema<GeoLocation>({
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
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
}, { _id: false });

const UserSchema = new Schema<IUserDocument>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  role: { 
    type: String, 
    enum: ['customer', 'provider', 'admin'] as UserRole[], 
    default: 'customer' 
  },
  profile: {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    phone: { 
      type: String, 
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    avatar: { type: String },
    language: { type: String, default: 'en' },
    location: { type: GeoLocationSchema, required: true }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      const { password, ...userWithoutPassword } = ret;
      return userWithoutPassword;
    }
  }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ 'profile.location.coordinates': '2dsphere' });
UserSchema.index({ role: 1, isActive: 1 });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);