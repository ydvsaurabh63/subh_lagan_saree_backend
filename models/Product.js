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
    required: [true, 'Please specify fabric (e.g. Pure Silk, Banarasi Silk, Georgette, Organza)'],
    trim: true,
  },
  color: {
    type: String,
    required: [true, 'Please specify color (e.g. Royal Maroon, Rani Pink, Mustard Gold, Emerald Green)'],
    trim: true,
  },
  sareeLength: {
    type: String,
    default: '5.5 Meters',
  },
  blouseDetails: {
    type: String,
    default: '0.8 Meters Unstitched Matching Blouse Piece Included',
  },
  occasion: {
    type: String,
    required: [true, 'Please specify occasion (e.g. Bridal, Wedding, Festive, Party Wear, Traditional)'],
    trim: true,
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
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;

