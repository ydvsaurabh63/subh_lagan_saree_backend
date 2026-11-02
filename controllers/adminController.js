import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Contact from '../models/Contact.js';
import Newsletter from '../models/Newsletter.js';

// @desc    Get dashboard metrics & aggregated statistics (Admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Order Counts & Revenue
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['Placed', 'Processing'] },
    });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    // Calculate revenue from non-cancelled orders
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 2. Product Counts & Low Stock
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });
    const totalCategories = await Category.countDocuments({ status: 'active' });

    // 3. Customers & Leads
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalEnquiries = await Contact.countDocuments();
    const newEnquiries = await Contact.countDocuments({ status: 'new' });
    const totalSubscribers = await Newsletter.countDocuments();

    // 4. Recent 8 Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(8);

    // 5. Orders by Status Breakdown
    const ordersByStatus = {
      Placed: await Order.countDocuments({ orderStatus: 'Placed' }),
      Processing: await Order.countDocuments({ orderStatus: 'Processing' }),
      Shipped: shippedOrders,
      Delivered: deliveredOrders,
      Cancelled: cancelledOrders,
    };

    // 6. Low stock products alert list
    const lowStockAlerts = await Product.find({ stock: { $lte: 5 } })
      .select('name sku stock price images')
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        shippedOrders,
        cancelledOrders,
        totalProducts,
        lowStockCount,
        totalCategories,
        totalCustomers,
        totalEnquiries,
        newEnquiries,
        totalSubscribers,
        ordersByStatus,
        recentOrders,
        lowStockAlerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

