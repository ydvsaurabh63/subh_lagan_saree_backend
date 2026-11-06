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

    // 4. Seed Arun Vastralay specific sarees
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
    ];

    for (const s of arunSarees) {
      await Product.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
    }
    console.log('Seeded Arun Vastralay products.');

    // 5. Seed Veeraj Brand Seller specific sarees
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
    ];

    for (const s of veerajSarees) {
      await Product.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
    }
    console.log('Seeded Veeraj Brand Seller products.');

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
