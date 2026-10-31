import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide product ID, rating, and comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update product ratings average and numReviews
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    product.ratings = Number(avgRating.toFixed(1));
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review,
      productRating: product.ratings,
      numReviews: product.numReviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
      .populate('user', 'name profileImage');

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

