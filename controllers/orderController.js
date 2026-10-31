import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import generateOrderNumber from '../utils/generateOrderNumber.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new Cash on Delivery (COD) order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerDetails,
      shippingAddress,
      items,
      notes,
    } = req.body;

    // Validate inputs
    if (!customerDetails || !customerDetails.name || !customerDetails.phone || !customerDetails.email) {
      return res.status(400).json({ success: false, message: 'Please provide full customer contact details' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.houseNo ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery address' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    // Process order items & compute server-side prices for security
    const orderedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name || item.productId}` });
      }

      const effectivePrice = product.discountPrice || product.price;
      const quantity = Math.max(1, parseInt(item.quantity, 10));
      subtotal += effectivePrice * quantity;

      orderedItems.push({
        product: product._id,
        name: product.name,
        image: (product.images && product.images[0]) || '',
        price: effectivePrice,
        quantity,
      });

      // Optional: Reduce stock
      if (product.stock >= quantity) {
        product.stock -= quantity;
        await product.save();
      }
    }

    // Free delivery if subtotal > 1999, else 99
    const shippingCharges = subtotal >= 1999 ? 0 : 99;
    const totalAmount = subtotal + shippingCharges;
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
      shippingAddress: {
        houseNo: shippingAddress.houseNo,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        orderNotes: notes || shippingAddress.orderNotes || '',
      },
      items: orderedItems,
      subtotal,
      shippingCharges,
      totalAmount,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Placed',
    });

    // Clear user's cart in database
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Send Order Confirmation Email
    const itemsHtml = orderedItems
      .map(
        (it) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${it.name} (x${it.quantity})</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${(it.price * it.quantity).toLocaleString('en-IN')}</td>
        </tr>`
      )
      .join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #C6A15B; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #681B2C; margin: 0; font-size: 26px;">Subh Lagan Sarees</h2>
          <p style="color: #C6A15B; margin: 5px 0 0 0; font-weight: bold; letter-spacing: 1px;">ORDER CONFIRMATION</p>
        </div>

        <p>Dear <strong>${customerDetails.name}</strong>,</p>
        <p>Thank you for shopping with <strong>Subh Lagan Sarees</strong>! We have received your Cash on Delivery (COD) order. Our artisans are getting your handcrafted saree ready with utmost care.</p>

        <div style="background-color: #FFF8EF; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #681B2C; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Order ID:</strong> ${orderNumber}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
          <p style="margin: 4px 0 0 0; font-size: 14px;"><strong>Delivery Address:</strong> ${shippingAddress.houseNo}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #681B2C; color: #fff;">
              <th style="padding: 8px; text-align: left;">Saree Item</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td style="padding: 8px; font-weight: bold;">Subtotal</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">₹${subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666;">Delivery Fee</td>
              <td style="padding: 8px; text-align: right; color: #666;">${shippingCharges === 0 ? 'FREE' : `₹${shippingCharges}`}</td>
            </tr>
            <tr style="background-color: #FFF8EF;">
              <td style="padding: 10px; font-weight: bold; color: #681B2C; font-size: 16px;">Total Payable on Delivery</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #681B2C; font-size: 16px;">₹${totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <p style="margin-top: 25px; font-size: 13px; color: #666;">
          Please keep the exact cash of ₹${totalAmount.toLocaleString('en-IN')} ready at the time of delivery. If you have any questions, reply to this email or contact our customer care.
        </p>

        <hr style="border: none; border-top: 1px solid #C6A15B; margin: 25px 0;">
        <p style="text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Subh Lagan Sarees. Crafting timeless royal ethnic beauty.
        </p>
      </div>
    `;

    // Send email asynchronously
    sendEmail({
      to: customerDetails.email,
      subject: `Order Confirmed: ${orderNumber} - Subh Lagan Sarees`,
      html: emailHtml,
      text: `Your order ${orderNumber} for ₹${totalAmount} has been placed successfully via Cash on Delivery.`,
    }).catch(err => console.error('Email send failed:', err));

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery (COD)',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (if still Placed)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this order' });
    }

    if (order.orderStatus !== 'Placed') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus.toLowerCase()}`,
      });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order has been cancelled successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

