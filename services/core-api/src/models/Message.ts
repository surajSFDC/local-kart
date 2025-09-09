import mongoose, { Schema, Document } from 'mongoose';
import { Message as IMessage, MessageType, MessageAttachment } from '@localkart/shared-types';

export interface IMessageDocument extends IMessage, Document {}

const MessageAttachmentSchema = new Schema<MessageAttachment>({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  size: { type: Number, required: true, min: 0 }
}, { _id: false });

const MessageSchema = new Schema<IMessageDocument>({
  bookingId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  senderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true, maxlength: 1000 },
  type: { 
    type: String, 
    enum: ['text', 'image', 'file', 'location'] as MessageType[], 
    default: 'text' 
  },
  attachments: [MessageAttachmentSchema],
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
MessageSchema.index({ bookingId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ isRead: 1, receiverId: 1 });

export const Message = mongoose.model<IMessageDocument>('Message', MessageSchema);