import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with full filtering, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      fabric,
      color,
      occasion,
      minPrice,
      maxPrice,
      sort,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isBridal,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};
    const andConditions = [];

    // Store-specific Isolation
    const rawStoreSlug = (req.query.storeSlug || req.query.store || req.headers['x-store-slug'] || '').toLowerCase().trim();
    const activeStoreSlug = (!rawStoreSlug || rawStoreSlug === 'default') ? 'subh-lagan' : rawStoreSlug;

    if (activeStoreSlug !== 'all') {
      if (activeStoreSlug === 'subh-lagan') {
        andConditions.push({
          $or: [
            { storeSlug: 'subh-lagan' },
            { storeSlug: null },
            { storeSlug: { $exists: false } },
          ],
        });
      } else {
        andConditions.push({ storeSlug: activeStoreSlug });
      }
    }

    // 1. Keyword Search (Name, Description, Fabric, Color)
    if (search && search.trim() !== '') {
      andConditions.push({
        $or: [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { fabric: { $regex: search.trim(), $options: 'i' } },
          { color: { $regex: search.trim(), $options: 'i' } },
          { occasion: { $regex: search.trim(), $options: 'i' } },
        ],
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // 2. Category Filter (by slug or ObjectId)
    if (category && category !== 'all') {
      let categoryDoc;
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        categoryDoc = await Category.findOne({ slug: category.toLowerCase() });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }
    }

    // 3. Fabric Filter
    if (fabric && fabric !== 'all') {
      const fabrics = fabric.split(',').map(f => new RegExp(f.trim(), 'i'));
      query.fabric = { $in: fabrics };
    }

    // 4. Color Filter
    if (color && color !== 'all') {
      const colors = color.split(',').map(c => new RegExp(c.trim(), 'i'));
      query.color = { $in: colors };
    }

    // 5. Occasion Filter
    if (occasion && occasion !== 'all') {
      const occasions = occasion.split(',').map(o => new RegExp(o.trim(), 'i'));
      query.occasion = { $in: occasions };
    }

    // 6. Price Range Filter (using effective price - discountPrice or price)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 7. Boolean flags
    if (isFeatured === 'true') query.isFeatured = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isBridal === 'true') query.isBridal = true;

    // 8. Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratings: -1 };
    else if (sort === 'best-seller') sortOption = { isBestSeller: -1, ratings: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    // 9. Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: pageNumber,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:identifier
// @access  Public
export const getProductByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: identifier.toLowerCase() }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const storeSlug = product.storeSlug || 'subh-lagan';
    const storeCondition = storeSlug === 'subh-lagan'
      ? { $or: [{ storeSlug: 'subh-lagan' }, { storeSlug: null }, { storeSlug: { $exists: false } }] }
      : { storeSlug };

    const related = await Product.find({
      _id: { $ne: product._id },
      ...storeCondition,
      $or: [
        { category: product.category },
        { fabric: product.fabric },
      ],
    })
      .populate('category', 'name slug')
      .limit(4);

    res.status(200).json({
      success: true,
      products: related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter options (fabrics, colors, occasions, price range)
// @route   GET /api/products/filters/options
// @access  Public
export const getFilterOptions = async (req, res, next) => {
  try {
    const rawStoreSlug = (req.query.storeSlug || req.query.store || req.headers['x-store-slug'] || '').toLowerCase().trim();
    const activeStoreSlug = (!rawStoreSlug || rawStoreSlug === 'default') ? 'subh-lagan' : rawStoreSlug;

    const filterQuery = {};
    if (activeStoreSlug !== 'all') {
      if (activeStoreSlug === 'subh-lagan') {
        filterQuery.$or = [
          { storeSlug: 'subh-lagan' },
          { storeSlug: null },
          { storeSlug: { $exists: false } },
        ];
      } else {
        filterQuery.storeSlug = activeStoreSlug;
      }
    }

    let fabrics = await Product.distinct('fabric', filterQuery);
    let colors = await Product.distinct('color', filterQuery);
    let occasions = await Product.distinct('occasion', filterQuery);

    // Filter out blank/null values
    fabrics = fabrics.filter((f) => f && typeof f === 'string' && f.trim() !== '');
    colors = colors.filter((c) => c && typeof c === 'string' && c.trim() !== '');
    occasions = occasions.filter((o) => o && typeof o === 'string' && o.trim() !== '');

    const minProduct = await Product.findOne(filterQuery).sort({ price: 1 }).select('price');
    const maxProduct = await Product.findOne(filterQuery).sort({ price: -1 }).select('price');

    res.status(200).json({
      success: true,
      fabrics,
      colors,
      occasions,
      priceRange: {
        min: minProduct ? minProduct.price : 0,
        max: maxProduct ? maxProduct.price : 50000,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      description,
      category,
      images,
      price,
      discountPrice,
      fabric,
      color,
      sareeLength,
      blouseDetails,
      occasion,
      stock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isBridal,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name, price, and category are required',
      });
    }

    // Auto-generate slug
    const cleanSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const uniqueSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    // Fallback SKU if not given
    const generatedSku = sku || `SLS-${Date.now().toString().slice(-6)}`;

    // Ensure images array has at least default placeholder if empty
    const productImages = Array.isArray(images) && images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'];

    // Determine store context for product
    let targetStoreSlug = 'subh-lagan';
    let targetStoreName = 'Subh Lagan Sarees';

    if (req.user && (req.user.role === 'client' || (req.user.role === 'admin' && req.user.storeName))) {
      targetStoreName = req.user.storeName;
      targetStoreSlug = req.user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    } else if (req.body.storeSlug) {
      targetStoreSlug = req.body.storeSlug.toLowerCase().trim();
      targetStoreName = req.body.storeName || targetStoreSlug;
    }

    const product = await Product.create({
      name,
      slug: uniqueSlug,
      sku: generatedSku,
      description: description || 'Handcrafted luxury saree from Subh Lagan Sarees.',
      category,
      images: productImages,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : Number(price),
      fabric: fabric || 'Pure Silk',
      color: color || 'Maroon',
      sareeLength: sareeLength || '5.5 Meters',
      blouseDetails: blouseDetails || '0.8 Meters Unstitched Blouse Piece',
      occasion: occasion || 'Wedding',
      stock: stock !== undefined ? Number(stock) : 10,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
      isBridal: Boolean(isBridal),
      storeSlug: targetStoreSlug,
      storeName: targetStoreName,
      createdBy: req.user?._id || null,
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Saree product created successfully',
      product: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Role check: client can only modify products from their own store
    if (req.user && req.user.role === 'client' && req.user.storeName) {
      const userStoreSlug = req.user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      if (product.storeSlug && product.storeSlug !== userStoreSlug) {
        return res.status(403).json({ success: false, message: 'You can only update your own boutique sarees' });
      }
    }

    const {
      name,
      sku,
      description,
      category,
      images,
      price,
      discountPrice,
      fabric,
      color,
      sareeLength,
      blouseDetails,
      occasion,
      stock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isBridal,
    } = req.body;

    if (name) product.name = name;
    if (sku) product.sku = sku;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (images && Array.isArray(images) && images.length > 0) product.images = images;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (fabric) product.fabric = fabric;
    if (color) product.color = color;
    if (sareeLength) product.sareeLength = sareeLength;
    if (blouseDetails) product.blouseDetails = blouseDetails;
    if (occasion) product.occasion = occasion;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isBestSeller !== undefined) product.isBestSeller = Boolean(isBestSeller);
    if (isNewArrival !== undefined) product.isNewArrival = Boolean(isNewArrival);
    if (isBridal !== undefined) product.isBridal = Boolean(isBridal);

    await product.save();
    const updated = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Saree product updated successfully',
      product: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Role check: client can only delete products from their own store
    if (req.user && req.user.role === 'client' && req.user.storeName) {
      const userStoreSlug = req.user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      if (product.storeSlug && product.storeSlug !== userStoreSlug) {
        return res.status(403).json({ success: false, message: 'You can only delete your own boutique sarees' });
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Saree product removed from catalog successfully',
    });
  } catch (error) {
    next(error);
  }
};


