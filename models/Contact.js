import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide your enquiry message'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new',
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
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;

