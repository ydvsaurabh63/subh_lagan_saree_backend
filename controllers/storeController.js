import Store from '../models/Store.js';
import User from '../models/User.js';

// Predefined seed data for immediate availability
export const DEFAULT_STORES = [
  {
    name: 'Subh Lagan Sarees',
    slug: 'subh-lagan',
    tagline: 'Authentic Banarasi, Kanjivaram & Pure Silk Heritage Since 1994',
    ownerName: 'Subh Lagan Flagship',
    ownerEmail: 'care@subhlagansarees.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 81475 40362',
    address: 'Near Maharaja Sweets, Sutapatti, Muzaffarpur, Bihar 842001',
    badge: 'Flagship Heritage Boutique',
    status: 'active',
    isDefault: true,
  },
  {
    name: 'Arun Vastralay',
    slug: 'arun-vastralay',
    tagline: 'Traditional Banarasi Brocades & Auspicious Bridal Vastra',
    ownerName: 'Arun Kumar Gupta',
    ownerEmail: 'arun@arunvastralay.com',
    phone: '+91 98390 12345',
    whatsapp: '+91 98390 12345',
    address: 'Main Chowk Market, Godowlia, Varanasi, Uttar Pradesh 221001',
    badge: 'Verified Boutique Partner',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Veeraj Brand Seller',
    slug: 'veeraj-brand-seller',
    tagline: 'Contemporary Royal Silks & Signature Designer Weaves',
    ownerName: 'Veeraj Singhania',
    ownerEmail: 'contact@veerajbrands.com',
    phone: '+91 98250 67890',
    whatsapp: '+91 98250 67890',
    address: 'Millennium Textile Market, Ring Road, Surat, Gujarat 395002',
    badge: 'Verified Boutique Partner',
    status: 'active',
    isDefault: false,
  },
];

// Seed default stores if none exist
export const seedDefaultStores = async () => {
  try {
    for (const storeData of DEFAULT_STORES) {
      const exists = await Store.findOne({ slug: storeData.slug });
      if (!exists) {
        await Store.create(storeData);
        console.log(`[Store] Seeded store: ${storeData.name} (${storeData.slug})`);
      }
    }
  } catch (err) {
    console.error('[Store] Error seeding stores:', err.message);
  }
};

// @desc    Get store branding details by slug (Public)
// @route   GET /api/stores/by-slug/:slug
// @access  Public
export const getStoreBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let store = await Store.findOne({ slug: slug.toLowerCase().trim(), status: 'active' });

    if (!store) {
      // If store not found, fallback to default store
      store = await Store.findOne({ isDefault: true, status: 'active' });
    }

    if (!store) {
      store = DEFAULT_STORES[0];
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get default store branding (Public)
// @route   GET /api/stores/default
// @access  Public
export const getDefaultStore = async (req, res, next) => {
  try {
    let store = await Store.findOne({ isDefault: true, status: 'active' });
    if (!store) {
      store = DEFAULT_STORES[0];
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stores (Public/Management)
// @route   GET /api/stores
// @access  Public
export const getAllStores = async (req, res, next) => {
  try {
    const stores = await Store.find({}).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new store (SuperAdmin)
// @route   POST /api/stores
// @access  Private (SuperAdmin/Admin)
export const createStore = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      tagline,
      ownerName,
      ownerEmail,
      phone,
      whatsapp,
      address,
      logo,
      badge,
      status = 'active',
      isDefault = false,
      notes = '',
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Store name is required' });
    }

    const finalSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const existingStore = await Store.findOne({ slug: finalSlug });
    if (existingStore) {
      return res.status(400).json({ success: false, message: `Store slug "${finalSlug}" is already taken` });
    }

    if (isDefault) {
      await Store.updateMany({}, { $set: { isDefault: false } });
    }

    const store = await Store.create({
      name: name.trim(),
      slug: finalSlug,
      tagline,
      ownerName,
      ownerEmail,
      phone,
      whatsapp: whatsapp || phone || '+91 81475 40362',
      address,
      logo,
      badge: badge || 'Verified Boutique Partner',
      status,
      isDefault: Boolean(isDefault),
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      store,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store details
// @route   PUT /api/stores/:id
// @access  Private (SuperAdmin/Admin)
export const updateStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    const {
      name,
      slug,
      tagline,
      ownerName,
      ownerEmail,
      phone,
      whatsapp,
      address,
      logo,
      badge,
      status,
      isDefault,
      notes,
    } = req.body;

    if (name) store.name = name.trim();
    if (slug) {
      const finalSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const conflict = await Store.findOne({ slug: finalSlug, _id: { $ne: store._id } });
      if (conflict) {
        return res.status(400).json({ success: false, message: `Store slug "${finalSlug}" is already in use` });
      }
      store.slug = finalSlug;
    }

    if (tagline !== undefined) store.tagline = tagline;
    if (ownerName !== undefined) store.ownerName = ownerName;
    if (ownerEmail !== undefined) store.ownerEmail = ownerEmail;
    if (phone !== undefined) store.phone = phone;
    if (whatsapp !== undefined) store.whatsapp = whatsapp;
    if (address !== undefined) store.address = address;
    if (logo !== undefined) store.logo = logo;
    if (badge !== undefined) store.badge = badge;
    if (status !== undefined) store.status = status;
    if (notes !== undefined) store.notes = notes;

    if (isDefault) {
      await Store.updateMany({ _id: { $ne: store._id } }, { $set: { isDefault: false } });
      store.isDefault = true;
    }

    await store.save();

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      store,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private (SuperAdmin)
export const deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    if (store.isDefault) {
      return res.status(400).json({ success: false, message: 'Cannot delete the default flagship store' });
    }

    await Store.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

