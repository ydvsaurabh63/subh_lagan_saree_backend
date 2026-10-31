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

    // 1. Keyword Search (Name, Description, Fabric, Color)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { fabric: { $regex: search.trim(), $options: 'i' } },
        { color: { $regex: search.trim(), $options: 'i' } },
        { occasion: { $regex: search.trim(), $options: 'i' } },
      ];
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

    const related = await Product.find({
      _id: { $ne: product._id },
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
    const fabrics = await Product.distinct('fabric');
    const colors = await Product.distinct('color');
    const occasions = await Product.distinct('occasion');
    
    const minProduct = await Product.findOne().sort({ price: 1 }).select('price');
    const maxProduct = await Product.findOne().sort({ price: -1 }).select('price');

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

