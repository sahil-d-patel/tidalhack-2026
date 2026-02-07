import mongoose, { Schema, Document } from 'mongoose';

interface ICachedResponse extends Document {
  key: string;
  type: 'scout' | 'hover';
  data: any;
  createdAt: Date;
}

const cachedResponseSchema = new Schema<ICachedResponse>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['scout', 'hover']
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours in seconds
  }
});

export const CachedResponse = mongoose.model<ICachedResponse>(
  'CachedResponse',
  cachedResponseSchema
);
