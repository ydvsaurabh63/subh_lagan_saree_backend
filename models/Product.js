import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'Please provide product SKU'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category'],
  },
  images: [{
    type: String,
    required: true,
  }],
  price: {
    type: Number,
    required: [true, 'Please provide product regular price'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    min: 0,
    default: null,
  },
  fabric: {
    type: String,
    default: '',
    trim: true,
  },
  color: {
    type: String,
    default: '',
    trim: true,
  },
  sareeLength: {
    type: String,
    default: '',
  },
  blouseDetails: {
    type: String,
    default: '',
  },
  occasion: {
    type: String,
    default: 'General',
    trim: true,
  },
  storeType: {
    type: String,
    enum: ['saree', 'jewellery', 'hair', 'general'],
    default: 'saree',
  },
  material: {
    type: String,
    default: '',
    trim: true,
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 10,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isBridal: {
    type: Boolean,
    default: false,
  },
  ratings: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  storeSlug: {
    type: String,
    default: 'subh-lagan',
    trim: true,
    lowercase: true,
    index: true,
  },
  storeName: {
    type: String,
    default: 'Subh Lagan Sarees',
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;

