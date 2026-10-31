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
  }
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;

