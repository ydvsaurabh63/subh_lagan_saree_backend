import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name slug price discountPrice images fabric color stock occasion isBridal isBestSeller ratings'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      wishlist: wishlist.products.filter(p => p != null),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist (Add if absent, Remove if present)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide productId' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const existsIndex = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    let isAdded = false;
    if (existsIndex > -1) {
      wishlist.products.splice(existsIndex, 1);
      isAdded = false;
    } else {
      wishlist.products.push(productId);
      isAdded = true;
    }

    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price discountPrice images fabric color stock occasion isBridal isBestSeller ratings'
    });

    res.status(200).json({
      success: true,
      message: isAdded ? 'Added to your Wishlist' : 'Removed from your Wishlist',
      isAdded,
      wishlist: populated.products.filter(p => p != null),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
    }

    const populated = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name slug price discountPrice images fabric color stock occasion isBridal isBestSeller ratings'
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: populated ? populated.products.filter(p => p != null) : [],
    });
  } catch (error) {
    next(error);
  }
};

