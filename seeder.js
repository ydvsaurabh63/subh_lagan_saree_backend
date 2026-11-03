import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Contact from './models/Contact.js';
import Newsletter from './models/Newsletter.js';

dotenv.config();
if (!process.env.MONGO_URI) {
  dotenv.config({ path: './backend/.env' });
}
await connectDB();

const categoriesData = [
  {
    name: 'Banarasi Sarees',
    slug: 'banarasi-sarees',
    description: 'Timeless handwoven silk sarees with intricate gold and silver zari brocade from Varanasi.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Kanjivaram Sarees',
    slug: 'kanjivaram-sarees',
    description: 'Lustrous South Indian temple silk sarees adorned with heavy pure gold zari borders.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    description: 'Pure Mulberry, Tussar, and Raw Silk creations embodying supreme elegance and grace.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    description: 'Breathable, handloom Chanderi and pure cotton drapes for timeless everyday sophistication.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Chiffon Sarees',
    slug: 'chiffon-sarees',
    description: 'Feather-light, gracefully flowing drapes with delicate embellishments for evening glamour.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Georgette Sarees',
    slug: 'georgette-sarees',
    description: 'Contemporary textured drapes featuring chikankari, mirror work, and gota patti borders.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Organza Sarees',
    slug: 'organza-sarees',
    description: 'Sheer, crisp, pastel floral and scalloped-border artisanal sarees for festive celebrations.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    description: 'Modern silhouettes, pre-draped luxury, and sequins artistry for red-carpet moments.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Bridal Sarees',
    slug: 'bridal-sarees',
    description: 'Opulent heirloom bridal sarees woven in sacred red, maroon, and auspicious gold.',
    image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Party Wear Sarees',
    slug: 'party-wear-sarees',
    description: 'Glamorous cocktail drapes shimmering with metallic yarns, crystals, and modern pallus.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Wedding Sarees',
    slug: 'wedding-sarees',
    description: 'Grand festive sarees designed to elevate the bride, bridesmaids, and wedding guests.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    name: 'Printed Sarees',
    slug: 'printed-sarees',
    description: 'Hand-block kalamkari, bandhani, and digital botanical prints in natural hues.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
];

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Contact.deleteMany();
    await Newsletter.deleteMany();

    console.log('Seeding categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    console.log('Seeding demo users (Customer & Admin)...');
    const demoUser = await User.create({
      name: 'Priya Sharma',
      email: 'customer@subhlagansarees.com',
      phone: '+91 98765 43210',
      password: 'password123',
      role: 'customer',
      addresses: [
        {
          fullName: 'Priya Sharma',
          phone: '+91 98765 43210',
          houseNo: 'Flat 402, Royal Residency',
          street: 'Civil Lines Road, Near City Mall',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302001',
          isDefault: true,
        }
      ]
    });

    const adminUser = await User.create({
      name: 'Boutique Owner (Admin)',
      email: 'admin@subhlagansarees.com',
      phone: '+91 98765 00000',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Seeding saree products...');
    const productsData = [
      {
        name: 'Royal Crimson Banarasi Katan Silk Saree',
        slug: 'royal-crimson-banarasi-katan-silk-saree',
        sku: 'SLS-BAN-001',
        description: 'An auspicious heirloom weave crafted from pure Katan silk in a rich crimson hue. Embellished with kadhwa zari floral jaal, regal meenakari highlights, and an ornate zari pallu celebrating centuries of Banaras craftsmanship.',
        category: catMap['banarasi-sarees'],
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 24999,
        discountPrice: 19999,
        fabric: 'Pure Katan Silk',
        color: 'Royal Maroon',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Unstitched Brocade Silk Blouse Piece with Zari Border',
        occasion: 'Bridal',
        stock: 8,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: true,
        ratings: 4.9,
        numReviews: 18,
      },
      {
        name: 'Maharani Emerald Gold Kanjivaram Silk Saree',
        slug: 'maharani-emerald-gold-kanjivaram-silk-saree',
        sku: 'SLS-KAN-002',
        description: 'Handwoven in the temple city of Kanchipuram with pure mulberry silk and 2-ply golden zari. Features sacred Mayil (peacock) motifs, korvai contrasting border in deep maroon, and an intricate temple pallu.',
        category: catMap['kanjivaram-sarees'],
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 32999,
        discountPrice: 27499,
        fabric: 'Pure Kanchipuram Silk',
        color: 'Emerald Green',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Contrast Maroon Silk Blouse with Zari Sleeves',
        occasion: 'Wedding',
        stock: 5,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        isBridal: true,
        ratings: 5.0,
        numReviews: 24,
      },
      {
        name: 'Gulabi Rani Pure Paithani Silk Saree',
        slug: 'gulabi-rani-pure-paithani-silk-saree',
        sku: 'SLS-SLK-003',
        description: 'Woven with high-luster mulberry silk yarns, this signature Rani Pink Paithani features an obverse-reverse gold zari pallu with hand-painted peacock kaleidoscope and delicate butis.',
        category: catMap['silk-sarees'],
        images: [
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 18499,
        discountPrice: 14999,
        fabric: 'Paithani Silk',
        color: 'Rani Pink',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Unstitched Silk Blouse Included',
        occasion: 'Festive',
        stock: 12,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        ratings: 4.8,
        numReviews: 9,
      },
      {
        name: 'Heirloom Red Zardozi Bridal Saree',
        slug: 'heirloom-red-zardozi-bridal-saree',
        sku: 'SLS-BRI-004',
        description: 'The epitome of wedding splendor. Tailored in sumptuous crimson red silk with hand-embossed zardozi, dabka, resham threadwork, and cutdana borders designed for the quintessential Subh Lagan bride.',
        category: catMap['bridal-sarees'],
        images: [
          'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 45000,
        discountPrice: 38999,
        fabric: 'Raw Silk & Velvet Border',
        color: 'Bridal Red',
        sareeLength: '5.5 Meters',
        blouseDetails: '1.0 Meter Heavy Zardozi Hand-Embroidered Blouse Fabric',
        occasion: 'Bridal',
        stock: 4,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: true,
        ratings: 5.0,
        numReviews: 31,
      },
      {
        name: 'Mustard Gold Handloom Chanderi Saree',
        slug: 'mustard-gold-handloom-chanderi-saree',
        sku: 'SLS-COT-005',
        description: 'Lightweight and royal, this Chanderi cotton-silk drape features dainty golden zari booti hand-interwoven across a warm haldi-yellow body with an exquisite scalloped border.',
        category: catMap['cotton-sarees'],
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 6499,
        discountPrice: 4999,
        fabric: 'Chanderi Cotton Silk',
        color: 'Mustard Gold',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Running Cotton Silk Blouse',
        occasion: 'Festive',
        stock: 15,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        isBridal: false,
        ratings: 4.7,
        numReviews: 14,
      },
      {
        name: 'Blush Rose French Organza Saree',
        slug: 'blush-rose-french-organza-saree',
        sku: 'SLS-ORG-006',
        description: 'Ethereal sheer blush pink organza saree decorated with hand-painted pastel blossoms and fine silver pita work scallop borders. Airy, weightless, and modern.',
        category: catMap['organza-sarees'],
        images: [
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 11999,
        discountPrice: 9499,
        fabric: 'Pure Organza Silk',
        color: 'Blush Pink',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Embroidered Organza Silk Piece',
        occasion: 'Party Wear',
        stock: 10,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        ratings: 4.8,
        numReviews: 11,
      },
      {
        name: 'Midnight Navy Sequin Georgette Saree',
        slug: 'midnight-navy-sequin-georgette-saree',
        sku: 'SLS-DES-007',
        description: 'Shimmer under the evening lights in this designer pure Viscose Georgette saree adorned with midnight blue tone-on-tone micro-sequins and metallic piping.',
        category: catMap['designer-sarees'],
        images: [
          'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 13999,
        discountPrice: 10999,
        fabric: 'Viscose Georgette',
        color: 'Navy Blue',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Heavily Embellished Designer Blouse Piece',
        occasion: 'Party Wear',
        stock: 9,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: false,
        ratings: 4.9,
        numReviews: 22,
      },
      {
        name: 'Sunset Coral Pure Chiffon Leheriya Saree',
        slug: 'sunset-coral-pure-chiffon-leheriya-saree',
        sku: 'SLS-CHI-008',
        description: 'Authentic Rajasthani hand-dyed leheriya drape in coral peach and vermillion tones. Crafted from pure 60-gram chiffon with gota patti handwork along the edges.',
        category: catMap['chiffon-sarees'],
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 8999,
        discountPrice: 6999,
        fabric: 'Pure Chiffon',
        color: 'Coral Peach',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Raw Silk Contrast Blouse Piece',
        occasion: 'Festive',
        stock: 14,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        ratings: 4.6,
        numReviews: 8,
      },
      {
        name: 'Turquoise Blue Chikankari Georgette Saree',
        slug: 'turquoise-blue-chikankari-georgette-saree',
        sku: 'SLS-GEO-009',
        description: 'Lucknowi artisanal delicacy brought to life with intricate bakhiya and phanda stitches on fluid georgette, highlighted with subtle mukaish silver dots.',
        category: catMap['georgette-sarees'],
        images: [
          'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 15499,
        discountPrice: 12499,
        fabric: 'Pure Georgette',
        color: 'Turquoise Blue',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Georgette Blouse with Chikankari Sleeves',
        occasion: 'Wedding',
        stock: 7,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: false,
        ratings: 4.9,
        numReviews: 19,
      },
      {
        name: 'Regal Wine Velvet Border Party Saree',
        slug: 'regal-wine-velvet-border-party-saree',
        sku: 'SLS-PTY-010',
        description: 'A striking evening silhouette in deep wine drape bordered with royal micro-velvet and antique tilla threadwork. Designed for sangeet nights and reception celebrations.',
        category: catMap['party-wear-sarees'],
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 16999,
        discountPrice: 13499,
        fabric: 'Silk Georgette',
        color: 'Wine Purple',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Embroidered Velvet Blouse Fabric',
        occasion: 'Party Wear',
        stock: 11,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        ratings: 4.8,
        numReviews: 15,
      },
      {
        name: 'Vedic Gold Tissue Wedding Saree',
        slug: 'vedic-gold-tissue-wedding-saree',
        sku: 'SLS-WED-011',
        description: 'Woven with metallic gold tissue warp and fine mulberry silk weft. Gives an unmatched celestial glow under wedding chandeliers with antique temple borders.',
        category: catMap['wedding-sarees'],
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 29999,
        discountPrice: 24999,
        fabric: 'Silk Tissue',
        color: 'Antique Gold',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Pure Brocade Silk Blouse Piece',
        occasion: 'Wedding',
        stock: 6,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: true,
        ratings: 5.0,
        numReviews: 28,
      },
      {
        name: 'Indigo Kalamkari Hand-Painted Tussar Saree',
        slug: 'indigo-kalamkari-hand-painted-tussar-saree',
        sku: 'SLS-PRT-012',
        description: 'Eco-dyed wild tussar silk embellished with traditional Srikalahasti mythological motifs hand-drawn using organic bamboo pens and natural vegetable pigments.',
        category: catMap['printed-sarees'],
        images: [
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
        ],
        price: 10499,
        discountPrice: 8499,
        fabric: 'Wild Tussar Silk',
        color: 'Indigo Blue',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Plain Tussar Blouse with Printed Sleeves',
        occasion: 'Festive',
        stock: 13,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        ratings: 4.8,
        numReviews: 7,
      }
    ];

    const createdProducts = await Product.insertMany(productsData);

    console.log('Seeding sample customer reviews...');
    await Review.create({
      user: demoUser._id,
      product: createdProducts[0]._id,
      userName: 'Priya Sharma',
      rating: 5,
      comment: 'The Banarasi silk quality is breathtaking! The zari shines with authentic antique gold elegance. Wore it to my brother wedding and received countless compliments.',
    });

    console.log('Seeding sample orders for admin dashboard demonstration...');
    // Order 1: Placed
    await Order.create({
      orderNumber: 'SLS-202611-1001',
      user: demoUser._id,
      customerDetails: {
        name: 'Priya Sharma',
        email: 'customer@subhlagansarees.com',
        phone: '+91 98765 43210',
      },
      shippingAddress: {
        houseNo: 'Flat 402, Royal Residency',
        street: 'Civil Lines Road, Near City Mall',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        orderNotes: 'Please deliver after 2 PM if possible',
      },
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].discountPrice,
          quantity: 1,
        }
      ],
      subtotal: createdProducts[0].discountPrice,
      shippingCharges: 0,
      totalAmount: createdProducts[0].discountPrice,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Placed',
    });

    // Order 2: Processing
    await Order.create({
      orderNumber: 'SLS-202611-1002',
      user: demoUser._id,
      customerDetails: {
        name: 'Ananya Deshmukh',
        email: 'ananya.d@gmail.com',
        phone: '+91 98201 11223',
      },
      shippingAddress: {
        houseNo: 'Bungalow 18, Shanti Vihar',
        street: 'Prabhat Road, Deccan',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411004',
        orderNotes: 'Urgent wedding requirement',
      },
      items: [
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          image: createdProducts[1].images[0],
          price: createdProducts[1].discountPrice,
          quantity: 1,
        }
      ],
      subtotal: createdProducts[1].discountPrice,
      shippingCharges: 0,
      totalAmount: createdProducts[1].discountPrice,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
    });

    // Order 3: Shipped
    await Order.create({
      orderNumber: 'SLS-202611-1003',
      user: demoUser._id,
      customerDetails: {
        name: 'Ritu Sen',
        email: 'ritu.sen@rediffmail.com',
        phone: '+91 97112 88443',
      },
      shippingAddress: {
        houseNo: 'Plot 45, Salt Lake Sector 3',
        street: 'Near City Centre',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700098',
        orderNotes: 'Call before dispatch',
      },
      items: [
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          image: createdProducts[2].images[0],
          price: createdProducts[2].discountPrice,
          quantity: 1,
        }
      ],
      subtotal: createdProducts[2].discountPrice,
      shippingCharges: 0,
      totalAmount: createdProducts[2].discountPrice,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Shipped',
    });

    // Order 4: Delivered (Paid)
    await Order.create({
      orderNumber: 'SLS-202611-1004',
      user: demoUser._id,
      customerDetails: {
        name: 'Kavita Iyer',
        email: 'kavita.iyer@outlook.com',
        phone: '+91 94440 55667',
      },
      shippingAddress: {
        houseNo: 'Villa 7, Palm Meadows',
        street: 'Whitefield Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066',
        orderNotes: '',
      },
      items: [
        {
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          image: createdProducts[4].images[0],
          price: createdProducts[4].discountPrice,
          quantity: 1,
        }
      ],
      subtotal: createdProducts[4].discountPrice,
      shippingCharges: 0,
      totalAmount: createdProducts[4].discountPrice,
      paymentMethod: 'COD',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
    });

    console.log('Seeding customer enquiries & leads...');
    await Contact.create({
      name: 'Anita Verma',
      email: 'anita.verma@gmail.com',
      phone: '+91 98112 33445',
      subject: 'Custom Bridal Blouse & Fall Piko Service',
      message: 'Hello, I want to purchase the Royal Crimson Banarasi Katan Silk Saree for my upcoming wedding. Can you arrange custom padding and maggam embroidery on the blouse fabric?',
      status: 'new',
    });

    await Contact.create({
      name: 'Meera Chawla',
      email: 'meera.chawla@yahoo.co.in',
      phone: '+91 99234 56789',
      subject: 'Bulk Wedding Order for 12 Bridesmaids',
      message: 'We are planning 12 matching organza pastel sarees for our destination wedding in Udaipur. Do you offer custom color coordination and bulk packing?',
      status: 'read',
    });

    console.log('Seeding newsletter subscriptions...');
    await Newsletter.create({ email: 'sangeeta.kapoor@gmail.com' });
    await Newsletter.create({ email: 'rohit.mehta@heritagecrafts.in' });

    console.log('Data seeded successfully!');
    console.log('=============================================');
    console.log('Customer Login: customer@subhlagansarees.com / password123');
    console.log('Admin Dashboard: admin@subhlagansarees.com / admin123');
    console.log('=============================================');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

