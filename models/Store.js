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
    storeType: {
      type: String,
      enum: ['saree', 'jewellery', 'hair', 'general'],
      default: 'saree',
    },
    customDomain: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    primaryColor: {
      type: String,
      default: '#681B2C',
      trim: true,
    },
    secondaryColor: {
      type: String,
      default: '#D4AF37',
      trim: true,
    },
    accentColor: {
      type: String,
      default: '#8B0000',
      trim: true,
    },
    fontFamily: {
      type: String,
      enum: ['serif', 'sans', 'luxury'],
      default: 'serif',
    },
    themePreset: {
      type: String,
      enum: ['heritage', 'modern', 'boutique'],
      default: 'heritage',
    },
    heroBannerUrl: {
      type: String,
      default: '',
    },
    heroHeading: {
      type: String,
      default: '',
    },
    heroSubheading: {
      type: String,
      default: '',
    },
    promoCode: {
      type: String,
      default: '',
      trim: true,
    },
    promoDiscount: {
      type: String,
      default: '',
      trim: true,
    },
    trustBadge: {
      type: String,
      default: '',
      trim: true,
    },
    instagramHandle: {
      type: String,
      default: '',
      trim: true,
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

