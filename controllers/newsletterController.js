import Newsletter from '../models/Newsletter.js';

// @desc    Subscribe to email newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to Subh Lagan Sarees newsletters!',
      });
    }

    await Newsletter.create({
      email: email.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! You will receive our latest royal collections and exclusive offers.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all newsletter subscribers (Admin)
// @route   GET /api/newsletter/admin/all
// @access  Private/Admin
export const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    next(error);
  }
};


