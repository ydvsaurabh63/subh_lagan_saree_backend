import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Safe ID string extractor helper
const getIdString = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (val._id) return val._id.toString();
  if (typeof val.toString === 'function') return val.toString();
  return String(val);
};

// Helper to format cart response
const formatCartResponse = (cart) => {
  if (!cart) return { items: [], subtotal: 0, totalQuantity: 0 };
  let subtotal = 0;
  let totalQuantity = 0;

  const validItems = (cart.items || []).filter(item => item && item.product != null);
  validItems.forEach(item => {
    const price = item.product.discountPrice || item.product.price || 0;
    const qty = Number(item.quantity) || 1;
    subtotal += price * qty;
    totalQuantity += qty;
  });

  return {
    _id: cart._id,
    items: validItems,
    subtotal,
    totalQuantity,
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images fabric color stock isBridal'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cleanProductId = getIdString(productId);
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!cleanProductId) {
      return res.status(400).json({ success: false, message: 'Please provide valid productId' });
    }

    const product = await Product.findById(cleanProductId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Clean up any corrupt items
    cart.items = (cart.items || []).filter(item => item && item.product != null);

    const itemIndex = cart.items.findIndex(
      (item) => getIdString(item.product) === cleanProductId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ product: cleanProductId, quantity: qty });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images fabric color stock'
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item/:productId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const cleanProductId = getIdString(req.params.productId);
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = (cart.items || []).filter(item => item && item.product != null);

    const itemIndex = cart.items.findIndex(
      (item) => getIdString(item.product) === cleanProductId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images fabric color stock'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const cleanProductId = getIdString(req.params.productId);
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = (cart.items || []).filter(
      (item) => item && item.product != null && getIdString(item.product) !== cleanProductId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images fabric color stock'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync guest cart items with user account upon login
// @route   POST /api/cart/sync
// @access  Private
export const syncGuestCart = async (req, res, next) => {
  try {
    const { guestItems } = req.body; // array of { productId, quantity }
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      const currentCart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'name slug price discountPrice images fabric color stock'
      });
      return res.status(200).json({
        success: true,
        cart: formatCartResponse(currentCart),
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Filter out any corrupt null product items currently in cart
    cart.items = (cart.items || []).filter(item => item && item.product != null);

    for (const item of guestItems) {
      if (!item) continue;
      const targetId = getIdString(item.productId || item.product || item._id);
      if (!targetId) continue;

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      // Verify product exists in DB before adding
      const productExists = await Product.findById(targetId);
      if (!productExists) continue;

      const index = cart.items.findIndex(
        (ci) => getIdString(ci.product) === targetId
      );

      if (index > -1) {
        cart.items[index].quantity += qty;
      } else {
        cart.items.push({
          product: targetId,
          quantity: qty,
        });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images fabric color stock'
    });

    res.status(200).json({
      success: true,
      message: 'Cart synchronized successfully',
      cart: formatCartResponse(populatedCart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items in cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], subtotal: 0, totalQuantity: 0 },
    });
  } catch (error) {
    next(error);
  }
};


