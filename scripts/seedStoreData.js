import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';

dotenv.config({ path: './backend/.env' });

async function seedStoreData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Tag all existing untagged products with subh-lagan
    const updateResult = await Product.updateMany(
      { $or: [{ storeSlug: null }, { storeSlug: { $exists: false } }] },
      { $set: { storeSlug: 'subh-lagan', storeName: 'Subh Lagan Sarees' } }
    );
    console.log(`Updated ${updateResult.modifiedCount} existing products to storeSlug: 'subh-lagan'`);

    // 2. Fetch or create a default category for products
    let silkCategory = await Category.findOne({ slug: 'silk-sarees' });
    if (!silkCategory) {
      silkCategory = await Category.findOne();
    }
    const catId = silkCategory ? silkCategory._id : new mongoose.Types.ObjectId();

    // 3. Find Arun and Veeraj users
    const arunUser = await User.findOne({ email: 'arun@arunvastralay.com' });
    const veerajUser = await User.findOne({ email: 'veeraj@veerajbrands.com' });

    // 4. Seed Arun Vastralay specific sarees (6 distinct luxury sarees)
    const arunSarees = [
      {
        name: 'Arun Heritage Kashi Katan Silk Saree',
        slug: 'arun-vastralay-kashi-katan-silk-101',
        sku: 'ARUN-KTN-01',
        description: 'Handwoven pure Kashi Katan silk saree with antique gold zari work crafted exclusively for Arun Vastralay Varanasi collection.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 18500,
        discountPrice: 14800,
        fabric: 'Pure Katan Silk',
        color: 'Crimson Red',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Silk Blouse Piece Included',
        occasion: 'Bridal',
        stock: 8,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        isBridal: true,
        storeSlug: 'arun-vastralay',
        storeName: 'Arun Vastralay',
        createdBy: arunUser ? arunUser._id : null,
      },
      {
        name: 'Arun Royal Banarasi Tanchoi Weave Saree',
        slug: 'arun-vastralay-banarasi-tanchoi-102',
        sku: 'ARUN-TNC-02',
        description: 'Exquisite Banarasi Tanchoi weave saree with floral motifs and radiant sheen.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 14200,
        discountPrice: 11999,
        fabric: 'Banarasi Tanchoi',
        color: 'Royal Emerald Green',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Contrast Blouse Piece Included',
        occasion: 'Festive',
        stock: 12,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        storeSlug: 'arun-vastralay',
        storeName: 'Arun Vastralay',
        createdBy: arunUser ? arunUser._id : null,
      },
      {
        name: 'Arun Kashi Shikargah Antique Brocade Saree',
        slug: 'arun-vastralay-shikargah-brocade-103',
        sku: 'ARUN-SHK-03',
        description: 'Masterpiece hunting motif Shikargah handloom weave with heavy real zari pallu.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 25000,
        discountPrice: 21500,
        fabric: 'Pure Silk Brocade',
        color: 'Deep Wine Plum',
        sareeLength: '5.5 Meters',
        blouseDetails: '1.0 Meter Brocade Blouse Piece Included',
        occasion: 'Bridal',
        stock: 5,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: true,
        storeSlug: 'arun-vastralay',
        storeName: 'Arun Vastralay',
        createdBy: arunUser ? arunUser._id : null,
      },
      {
        name: 'Arun Gulab Buti Handloom Kadwa Zari Saree',
        slug: 'arun-vastralay-gulab-buti-kadwa-104',
        sku: 'ARUN-KDW-04',
        description: 'Delicate rose motifs woven in traditional Kadwa technique with matte gold zari.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 19800,
        discountPrice: 16900,
        fabric: 'Pure Katan Silk',
        color: 'Haldi Mustard Yellow',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Matching Blouse Piece',
        occasion: 'Festive',
        stock: 9,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        isBridal: false,
        storeSlug: 'arun-vastralay',
        storeName: 'Arun Vastralay',
        createdBy: arunUser ? arunUser._id : null,
      },
      {
        name: 'Arun Ganga Jamuni Pure Silk Bridal Saree',
        slug: 'arun-vastralay-ganga-jamuni-bridal-105',
        sku: 'ARUN-BDL-05',
        description: 'Dual shade red & gold Ganga Jamuni border saree crafted for sacred wedding rituals.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 31000,
        discountPrice: 26500,
        fabric: 'Pure Mulberry Silk',
        color: 'Sindoor Scarlet',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Heavy Zari Blouse Included',
        occasion: 'Bridal',
        stock: 4,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: true,
        storeSlug: 'arun-vastralay',
        storeName: 'Arun Vastralay',
        createdBy: arunUser ? arunUser._id : null,
      },
      {
        name: 'Arun Jangla Floral Antique Gold Weave Saree',
        slug: 'arun-vastralay-jangla-floral-gold-106',
        sku: 'ARUN-JNG-06',
        description: 'All-over intricate Jangla foliage vines intricately woven in antique zari.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 22000,
        discountPrice: 18999,
        fabric: 'Banarasi Katan Silk',
        color: 'Royal Rani Pink',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Contrast Embroidered Blouse',
        occasion: 'Party Wear',
        stock: 7,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: false,
        storeSlug: 'arun-vastralay',
        storeName: 'Arun Vastralay',
        createdBy: arunUser ? arunUser._id : null,
      },
    ];

    for (const s of arunSarees) {
      await Product.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
    }
    console.log(`Seeded ${arunSarees.length} Arun Vastralay products.`);

    // 5. Seed Veeraj Brand Seller specific sarees (6 distinct contemporary silks)
    const veerajSarees = [
      {
        name: 'Veeraj Signature Pure Paithani Silk Saree',
        slug: 'veeraj-brand-seller-paithani-silk-201',
        sku: 'VRJ-PTH-01',
        description: 'Authentic pure Paithani silk saree featuring majestic peacock motifs and rich gold border.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 21000,
        discountPrice: 16999,
        fabric: 'Pure Paithani Silk',
        color: 'Mustard Gold & Peacock Blue',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Brocade Blouse Piece Included',
        occasion: 'Wedding',
        stock: 6,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        isBridal: true,
        storeSlug: 'veeraj-brand-seller',
        storeName: 'Veeraj Brand Seller',
        createdBy: veerajUser ? veerajUser._id : null,
      },
      {
        name: 'Veeraj Designer Handloom Organza Silk Saree',
        slug: 'veeraj-brand-seller-organza-silk-202',
        sku: 'VRJ-ORG-02',
        description: 'Featherlight sheer organza silk saree embellished with handcrafted cutdana and gota patti work.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 12500,
        discountPrice: 9999,
        fabric: 'Organza Silk',
        color: 'Pastel Peach',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Embroidered Blouse Piece',
        occasion: 'Party Wear',
        stock: 10,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        storeSlug: 'veeraj-brand-seller',
        storeName: 'Veeraj Brand Seller',
        createdBy: veerajUser ? veerajUser._id : null,
      },
      {
        name: 'Veeraj Surat Zari Dola Silk Saree',
        slug: 'veeraj-brand-seller-dola-silk-203',
        sku: 'VRJ-DLA-03',
        description: 'Lustrous Surat Dola silk saree draped in intricate foil zari border and modern meenakari work.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 16800,
        discountPrice: 13499,
        fabric: 'Dola Silk',
        color: 'Teal Turquoise',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Dola Silk Blouse',
        occasion: 'Festive',
        stock: 8,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: false,
        storeSlug: 'veeraj-brand-seller',
        storeName: 'Veeraj Brand Seller',
        createdBy: veerajUser ? veerajUser._id : null,
      },
      {
        name: 'Veeraj Royal Bandhani Gota Patti Silk Saree',
        slug: 'veeraj-brand-seller-bandhani-silk-204',
        sku: 'VRJ-BDN-04',
        description: 'Authentic handmade tie & dye Bandhani on pure georgette silk with heavy bridal gota patti.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 18900,
        discountPrice: 15800,
        fabric: 'Pure Georgette Silk',
        color: 'Ruby Red & Marigold',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Heavy Gota Blouse',
        occasion: 'Bridal',
        stock: 6,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        isBridal: true,
        storeSlug: 'veeraj-brand-seller',
        storeName: 'Veeraj Brand Seller',
        createdBy: veerajUser ? veerajUser._id : null,
      },
      {
        name: 'Veeraj Metallic Gold Tissue Chanderi Saree',
        slug: 'veeraj-brand-seller-tissue-chanderi-205',
        sku: 'VRJ-TIS-05',
        description: 'Ultra-modern metallic shimmer tissue silk saree with minimal resham border and contemporary drape.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 13900,
        discountPrice: 11200,
        fabric: 'Tissue Chanderi Silk',
        color: 'Champagne Gold',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Shimmer Blouse Included',
        occasion: 'Party Wear',
        stock: 11,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isBridal: false,
        storeSlug: 'veeraj-brand-seller',
        storeName: 'Veeraj Brand Seller',
        createdBy: veerajUser ? veerajUser._id : null,
      },
      {
        name: 'Veeraj Rose Gold Sequins Georgette Saree',
        slug: 'veeraj-brand-seller-sequins-georgette-206',
        sku: 'VRJ-GEO-06',
        description: 'Glamorous cocktail saree encrusted with delicate micro sequins and liquid satin drape.',
        category: catId,
        images: [
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 17500,
        discountPrice: 14500,
        fabric: 'Pure Georgette',
        color: 'Rose Gold Shimmer',
        sareeLength: '5.5 Meters',
        blouseDetails: '0.8 Meters Sequins Blouse Included',
        occasion: 'Party Wear',
        stock: 7,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        isBridal: false,
        storeSlug: 'veeraj-brand-seller',
        storeName: 'Veeraj Brand Seller',
        createdBy: veerajUser ? veerajUser._id : null,
      },
    ];

    for (const s of veerajSarees) {
      await Product.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
    }
    console.log(`Seeded ${veerajSarees.length} Veeraj Brand Seller products.`);

    // 6. Seed store-isolated sample enquiries
    await Contact.findOneAndUpdate(
      { email: 'customer1@varanasi.com', storeSlug: 'arun-vastralay' },
      {
        name: 'Pooja Tiwari',
        email: 'customer1@varanasi.com',
        phone: '+91 98391 11223',
        subject: 'Custom bridal saree stitching enquiry',
        message: 'Namaste Arun Vastralay team, I want to book 3 Katan silk bridal sarees for my wedding in December.',
        status: 'new',
        storeSlug: 'arun-vastralay',
        storeName: 'Arun Vastralay',
      },
      { upsert: true, new: true }
    );

    await Contact.findOneAndUpdate(
      { email: 'customer2@surat.com', storeSlug: 'veeraj-brand-seller' },
      {
        name: 'Sneha Patel',
        email: 'customer2@surat.com',
        phone: '+91 98251 44556',
        subject: 'Bulk order enquiry for Diwali function',
        message: 'Hello Veeraj Brand Seller, do you provide wholesale discounts on Paithani sarees for wedding return gifts?',
        status: 'new',
        storeSlug: 'veeraj-brand-seller',
        storeName: 'Veeraj Brand Seller',
      },
      { upsert: true, new: true }
    );

    console.log('Seeded store-isolated enquiries.');
    console.log('Setup successfully completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedStoreData();
