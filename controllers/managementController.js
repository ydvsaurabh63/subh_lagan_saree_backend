import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import mongoose from 'mongoose';

// =========================================================================
// SUPERADMIN & ADMIN STATS CONTROLLERS
// =========================================================================

// @desc    Get complete superadmin system overview statistics
// @route   GET /api/management/superadmin/stats
// @access  Private (Superadmin)
export const getSuperAdminStats = async (req, res, next) => {
  try {
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeAdmins = await User.countDocuments({ role: 'admin', accountStatus: 'active' });

    const totalClients = await User.countDocuments({ role: { $in: ['client', 'admin'] } });
    const activeClients = await User.countDocuments({ role: { $in: ['client', 'admin'] }, accountStatus: 'active' });

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Total System Revenue from non-cancelled orders
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Recent 10 registered admins and clients
    const recentAdmins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentClients = await User.find({ role: { $in: ['client', 'admin'] } })
      .select('-password')
      .populate('assignedAdmin', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalAdmins,
        activeAdmins,
        totalClients,
        activeClients,
        totalCustomers,
        totalOrders,
        totalProducts,
        totalRevenue,
      },
      recentAdmins,
      recentClients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin portal overview statistics
// @route   GET /api/management/admin/stats
// @access  Private (Admin / Superadmin)
export const getAdminPortalStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin
      ? { role: { $in: ['client', 'admin'] }, assignedAdmin: req.user._id }
      : { role: { $in: ['client', 'admin'] } };

    // If no clients assigned directly to this admin, count all clients
    let assignedClientsCount = await User.countDocuments(filter);
    let clientsFilter = filter;
    if (isAdmin && assignedClientsCount === 0) {
      clientsFilter = { role: { $in: ['client', 'admin'] } };
      assignedClientsCount = await User.countDocuments(clientsFilter);
    }

    const activeClientsCount = await User.countDocuments({
      ...clientsFilter,
      accountStatus: 'active',
    });

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const recentClients = await User.find(clientsFilter)
      .select('-password')
      .populate('assignedAdmin', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        assignedClientsCount,
        activeClientsCount,
        totalOrders,
        totalProducts,
      },
      recentClients,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// ADMIN CRUD CONTROLLERS (SUPERADMIN ONLY)
// =========================================================================

// @desc    Get all admins with search & pagination
// @route   GET /api/management/admins
// @access  Private (Superadmin)
export const getAdmins = async (req, res, next) => {
  try {
    const { search = '', status = '', page = 1, limit = 50 } = req.query;

    const query = { role: 'admin' };

    if (status && status !== 'all') {
      query.accountStatus = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const total = await User.countDocuments(query);
    const admins = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Calculate managed clients count for each admin
    const adminsWithClientCount = await Promise.all(
      admins.map(async (adm) => {
        const clientCount = await User.countDocuments({ assignedAdmin: adm._id });
        return {
          ...adm.toObject(),
          managedClientsCount: clientCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: admins.length,
      total,
      admins: adminsWithClientCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new admin
// @route   POST /api/management/admins
// @access  Private (Superadmin)
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, phone, password, accountStatus = 'active', notes = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password,
      role: 'admin',
      accountStatus,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role,
        accountStatus: newAdmin.accountStatus,
        notes: newAdmin.notes,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin details
// @route   PUT /api/management/admins/:id
// @access  Private (Superadmin)
export const updateAdmin = async (req, res, next) => {
  try {
    const { name, email, phone, password, accountStatus, notes } = req.body;
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (email && email.toLowerCase().trim() !== admin.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: admin._id } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already used by another user' });
      }
      admin.email = email.toLowerCase().trim();
    }

    if (name) admin.name = name.trim();
    if (phone !== undefined) admin.phone = phone;
    if (accountStatus) admin.accountStatus = accountStatus;
    if (notes !== undefined) admin.notes = notes;
    if (password && password.trim().length >= 6) {
      admin.password = password; // pre('save') hook hashes this
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        accountStatus: admin.accountStatus,
        notes: admin.notes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admin
// @route   DELETE /api/management/admins/:id
// @access  Private (Superadmin)
export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (req.user._id.toString() === admin._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    // Unassign clients previously assigned to this admin
    await User.updateMany({ assignedAdmin: admin._id }, { $set: { assignedAdmin: null } });

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================================
// CLIENT CRUD CONTROLLERS (SUPERADMIN & ADMIN)
// =========================================================================

// @desc    Get all clients with search, filters & pagination
// @route   GET /api/management/clients
// @access  Private (Superadmin & Admin)
export const getClients = async (req, res, next) => {
  try {
    const { search = '', status = '', assignedAdmin = '', page = 1, limit = 50 } = req.query;

    const query = { role: { $in: ['client', 'admin'] } };

    // If caller is Admin (not Superadmin) and has specific assigned clients
    if (req.user.role === 'admin') {
      // By default show all clients or clients assigned to this admin
      if (assignedAdmin) {
        query.assignedAdmin = assignedAdmin;
      }
    } else if (assignedAdmin && assignedAdmin !== 'all') {
      query.assignedAdmin = assignedAdmin;
    }

    if (status && status !== 'all') {
      query.accountStatus = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { storeName: searchRegex },
      ];
    }

    const total = await User.countDocuments(query);
    const clients = await User.find(query)
      .select('-password')
      .populate('assignedAdmin', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: clients.length,
      total,
      clients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new client / boutique store owner
// @route   POST /api/management/clients
// @access  Private (Superadmin & Admin)
export const createClient = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      storeName,
      credits = 100,
      accountStatus = 'active',
      assignedAdmin,
      notes = '',
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // If an Admin creates this client, default assignedAdmin to req.user._id
    const finalAdminId =
      req.user.role === 'admin'
        ? req.user._id
        : assignedAdmin && mongoose.Types.ObjectId.isValid(assignedAdmin)
        ? assignedAdmin
        : null;

    const newClient = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password,
      role: 'client',
      storeName: storeName || 'Subh Lagan Boutique Store',
      credits: Number(credits) || 100,
      accountStatus,
      assignedAdmin: finalAdminId,
      notes,
    });

    // Sync store record
    if (storeName) {
      const storeSlug = storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      await Store.findOneAndUpdate(
        { user: newClient._id },
        {
          name: storeName.trim(),
          slug: storeSlug,
          ownerName: name.trim(),
          ownerEmail: email.toLowerCase().trim(),
          phone: phone || '',
          whatsapp: phone || '+91 81475 40362',
          status: accountStatus === 'active' ? 'active' : 'inactive',
          user: newClient._id,
        },
        { upsert: true, new: true }
      );
    }

    const populatedClient = await User.findById(newClient._id)
      .select('-password')
      .populate('assignedAdmin', 'name email');

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client: populatedClient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client details
// @route   PUT /api/management/clients/:id
// @access  Private (Superadmin & Admin)
export const updateClient = async (req, res, next) => {
  try {
    const { name, email, phone, password, storeName, credits, accountStatus, assignedAdmin, notes } = req.body;
    const client = await User.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    if (email && email.toLowerCase().trim() !== client.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: client._id } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already taken' });
      }
      client.email = email.toLowerCase().trim();
    }

    if (name) client.name = name.trim();
    if (phone !== undefined) client.phone = phone;
    if (storeName !== undefined) client.storeName = storeName;
    if (credits !== undefined) client.credits = Number(credits);
    if (accountStatus) client.accountStatus = accountStatus;
    if (notes !== undefined) client.notes = notes;
    if (assignedAdmin !== undefined) {
      client.assignedAdmin = assignedAdmin && mongoose.Types.ObjectId.isValid(assignedAdmin) ? assignedAdmin : null;
    }

    if (password && password.trim().length >= 6) {
      client.password = password;
    }

    await client.save();

    // Sync store record
    if (client.storeName) {
      const storeSlug = client.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      await Store.findOneAndUpdate(
        { user: client._id },
        {
          name: client.storeName.trim(),
          slug: storeSlug,
          ownerName: client.name,
          ownerEmail: client.email,
          phone: client.phone || '',
          whatsapp: client.phone || '+91 81475 40362',
          status: client.accountStatus === 'active' ? 'active' : 'inactive',
          user: client._id,
        },
        { upsert: true, new: true }
      );
    }

    const populatedClient = await User.findById(client._id)
      .select('-password')
      .populate('assignedAdmin', 'name email');

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      client: populatedClient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/management/clients/:id
// @access  Private (Superadmin & Admin)
export const deleteClient = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    if (req.user._id.toString() === client._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle account status (active <-> suspended)
// @route   PUT /api/management/users/:id/toggle-status
// @access  Private (Superadmin & Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const userToToggle = await User.findById(req.params.id);
    if (!userToToggle) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user._id.toString() === userToToggle._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot modify your own status' });
    }

    userToToggle.accountStatus = userToToggle.accountStatus === 'active' ? 'suspended' : 'active';
    await userToToggle.save();

    res.status(200).json({
      success: true,
      message: `Account status updated to ${userToToggle.accountStatus}`,
      accountStatus: userToToggle.accountStatus,
    });
  } catch (error) {
    next(error);
  }
};

