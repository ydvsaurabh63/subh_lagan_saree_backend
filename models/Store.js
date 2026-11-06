import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide store name'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide store slug'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      default: 'Authentic Banarasi & Handloom Silk Sarees',
      trim: true,
    },
    ownerName: {
      type: String,
      default: '',
      trim: true,
    },
    ownerEmail: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
      trim: true,
    },
    whatsapp: {
      type: String,
      default: '+91 81475 40362',
      trim: true,
    },
    address: {
      type: String,
      default: 'Varanasi, Uttar Pradesh, India',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: 'Verified Boutique Partner',
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);
