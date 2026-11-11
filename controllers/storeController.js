import Store from '../models/Store.js';
import User from '../models/User.js';

// Predefined seed data for immediate availability
export const DEFAULT_STORES = [
  {
    name: 'Subh Lagan Sarees',
    slug: 'subh-lagan',
    storeType: 'saree',
    customDomain: '',
    tagline: 'Authentic Banarasi, Kanjivaram & Pure Silk Heritage Since 1994',
    ownerName: 'Subh Lagan Flagship',
    ownerEmail: 'care@subhlagansarees.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 81475 40362',
    address: 'Near Maharaja Sweets, Sutapatti, Muzaffarpur, Bihar 842001',
    badge: 'Flagship Heritage Boutique',
    trustBadge: '100% Pure Silk Mark Certified Heritage',
    primaryColor: '#681B2C',
    secondaryColor: '#C6A15B',
    accentColor: '#8B0000',
    fontFamily: 'serif',
    themePreset: 'heritage',
    heroHeading: 'Royal Handcrafted Silk Sarees',
    heroSubheading: 'Authentic Banarasi & Kanjivaram Bridal Weaves direct to your doorstep.',
    promoCode: 'SUBHLAGAN30',
    promoDiscount: 'Flat 30% Off Bridal',
    status: 'active',
    isDefault: true,
  },
  {
    name: 'Arun Vastralay',
    slug: 'arun-vastralay',
    storeType: 'saree',
    customDomain: 'arunvastralay.com',
    tagline: 'Traditional Banarasi Brocades & Auspicious Bridal Vastra',
    ownerName: 'Arun Kumar Gupta',
    ownerEmail: 'arun@arunvastralay.com',
    phone: '+91 98390 12345',
    whatsapp: '+91 98390 12345',
    address: 'Main Chowk Market, Godowlia, Varanasi, Uttar Pradesh 221001',
    badge: 'Verified Boutique Partner',
    trustBadge: '100% Varanasi Handloom Mark Certified',
    primaryColor: '#125454',
    secondaryColor: '#D4AF37',
    accentColor: '#0A3434',
    fontFamily: 'serif',
    themePreset: 'heritage',
    heroHeading: 'Auspicious Bridal Vastra & Brocades',
    heroSubheading: 'Handcrafted in the sacred ghats of Varanasi.',
    promoCode: 'ARUNVAST30',
    promoDiscount: 'Flat 30% Off Festive Brocades',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Veeraj Brand Seller',
    slug: 'veeraj-brand-seller',
    storeType: 'saree',
    customDomain: 'veerajbrandseller.com',
    tagline: 'Contemporary Royal Silks & Signature Designer Weaves',
    ownerName: 'Veeraj Singhania',
    ownerEmail: 'contact@veerajbrands.com',
    phone: '+91 98250 67890',
    whatsapp: '+91 98250 67890',
    address: 'Millennium Textile Market, Ring Road, Surat, Gujarat 395002',
    badge: 'Verified Boutique Partner',
    trustBadge: 'Surat Master Weavers Authenticated',
    primaryColor: '#1E3A8A',
    secondaryColor: '#E0A96D',
    accentColor: '#1D4ED8',
    fontFamily: 'luxury',
    themePreset: 'modern',
    heroHeading: 'Modern Royalty & Designer Silks',
    heroSubheading: 'Curated haute couture saree collections from Surat.',
    promoCode: 'VEERAJBR30',
    promoDiscount: 'Flat 25% Off Modern Silk & Organza',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Kundan Heritage Jewellers',
    slug: 'kundan-heritage-jewellers',
    storeType: 'jewellery',
    customDomain: 'kashijewels.com',
    tagline: '22K Hallmarked Gold, Polki & Solitaire Diamond Masterpieces',
    ownerName: 'Rameshwar Soni',
    ownerEmail: 'contact@kashijewels.com',
    phone: '+91 98390 55443',
    whatsapp: '+91 98390 55443',
    address: 'Thatheri Bazaar, Chowk, Varanasi, Uttar Pradesh 221001',
    badge: 'Certified Master Jeweller',
    trustBadge: '100% BIS Hallmarked • Certified Gold & Diamonds • Insured Shipping',
    primaryColor: '#064E3B',
    secondaryColor: '#D97706',
    accentColor: '#047857',
    fontFamily: 'serif',
    themePreset: 'heritage',
    heroHeading: 'Sacred Gold & Polki Jewellery',
    heroSubheading: 'Authentic 22K hallmarked bridal chokers, bangles & diamond solitaires.',
    promoCode: 'JEWELS20',
    promoDiscount: 'Flat 20% Off Making Charges',
    status: 'active',
    isDefault: false,
  },
  {
    name: 'Crown Luxe Hair Studio',
    slug: 'crown-luxe-hair',
    storeType: 'hair',
    customDomain: 'luxehair.com',
    tagline: '100% Virgin Remy Human Hair Extensions & Salon Grade Hair Care',
    ownerName: 'Priya Malhotra',
    ownerEmail: 'contact@luxehair.com',
    phone: '+91 98112 33445',
    whatsapp: '+91 98112 33445',
    address: 'Bandra West, Linking Road, Mumbai, Maharashtra 400050',
    badge: 'Salon Certified Hair Brand',
    trustBadge: '100% Virgin Remy Human Hair • Salon Grade & Toxin Free • Heat Resistant',
    primaryColor: '#831843',
    secondaryColor: '#F472B6',
    accentColor: '#9D174D',
    fontFamily: 'sans',
    themePreset: 'boutique',
    heroHeading: 'Flawless Remy Hair Extensions & Care',
    heroSubheading: 'Seamless clip-ins, lace front wigs & organic hair repair serums.',
    promoCode: 'LUXEHAIR25',
    promoDiscount: 'Flat 25% Off Premium Extensions',
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

// @desc    Get store branding details by slug or custom domain (Public)
// @route   GET /api/stores/by-slug/:slug
// @access  Public
export const getStoreBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cleanSlug = (slug || '').toLowerCase().trim();
    let store = await Store.findOne({
      $or: [
        { slug: cleanSlug },
        { customDomain: cleanSlug },
        { customDomain: cleanSlug.replace(/^www\./, '') },
      ],
      status: 'active',
    });

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

// @desc    Get store branding details by custom domain (Public)
// @route   GET /api/stores/by-domain/:domain
// @access  Public
export const getStoreByDomain = async (req, res, next) => {
  try {
    const rawDomain = (req.params.domain || '').toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
    let store = await Store.findOne({
      $or: [
        { customDomain: rawDomain },
        { customDomain: `www.${rawDomain}` },
        { slug: rawDomain },
      ],
      status: 'active',
    });

    if (!store) {
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
      storeType = 'saree',
      customDomain = '',
      primaryColor = '#681B2C',
      secondaryColor = '#D4AF37',
      accentColor = '#8B0000',
      fontFamily = 'serif',
      themePreset = 'heritage',
      heroBannerUrl = '',
      heroHeading = '',
      heroSubheading = '',
      promoCode = '',
      promoDiscount = '',
      trustBadge = '',
      instagramHandle = '',
      homeBanners = {},
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

    const cleanCustomDomain = (customDomain || '').toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');

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
      storeType,
      customDomain: cleanCustomDomain,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      themePreset,
      heroBannerUrl,
      heroHeading,
      heroSubheading,
      promoCode,
      promoDiscount,
      trustBadge,
      instagramHandle,
      homeBanners,
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
      storeType,
      customDomain,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      themePreset,
      heroBannerUrl,
      heroHeading,
      heroSubheading,
      promoCode,
      promoDiscount,
      trustBadge,
      instagramHandle,
      homeBanners,
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

    if (storeType !== undefined) store.storeType = storeType;
    if (customDomain !== undefined) {
      store.customDomain = customDomain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
    }
    if (primaryColor !== undefined) store.primaryColor = primaryColor;
    if (secondaryColor !== undefined) store.secondaryColor = secondaryColor;
    if (accentColor !== undefined) store.accentColor = accentColor;
    if (fontFamily !== undefined) store.fontFamily = fontFamily;
    if (themePreset !== undefined) store.themePreset = themePreset;
    if (heroBannerUrl !== undefined) store.heroBannerUrl = heroBannerUrl;
    if (heroHeading !== undefined) store.heroHeading = heroHeading;
    if (heroSubheading !== undefined) store.heroSubheading = heroSubheading;
    if (promoCode !== undefined) store.promoCode = promoCode;
    if (promoDiscount !== undefined) store.promoDiscount = promoDiscount;
    if (trustBadge !== undefined) store.trustBadge = trustBadge;
    if (instagramHandle !== undefined) store.instagramHandle = instagramHandle;
    if (homeBanners !== undefined) store.homeBanners = homeBanners;

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

