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
  createdAt: string; // ISO
}

export type MessageType = text | image | file | location;

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
  createdAt: string; // ISO
}
