import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { DEFAULT_STORES } from '../controllers/storeController.js';

dotenv.config({ path: './backend/.env' });

async function seedMultiIndustryStores() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    // 1. Seed or update all stores in the database
    for (const storeData of DEFAULT_STORES) {
      const existing = await Store.findOne({ slug: storeData.slug });
      if (existing) {
        await Store.updateOne({ slug: storeData.slug }, { $set: storeData });
        console.log(`[Store] Updated store: ${storeData.name} (${storeData.slug})`);
      } else {
        await Store.create(storeData);
        console.log(`[Store] Created store: ${storeData.name} (${storeData.slug})`);
      }
    }

    // 2. Fetch or create Jewellery & Hair categories
    let jewelleryCategory = await Category.findOne({ slug: 'jewellery' });
    if (!jewelleryCategory) {
      jewelleryCategory = await Category.create({
        name: 'Fine Jewellery & Diamonds',
        slug: 'jewellery',
        description: '22K Hallmarked Gold, Polki, Kundan & Solitaire Diamond Masterpieces',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      });
      console.log('Created Jewellery category');
    }

    let hairCategory = await Category.findOne({ slug: 'hair-care-extensions' });
    if (!hairCategory) {
      hairCategory = await Category.create({
        name: 'Hair Extensions & Luxury Care',
        slug: 'hair-care-extensions',
        description: '100% Virgin Remy Human Hair Extensions, Wigs & Salon Grade Formulas',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      });
      console.log('Created Hair category');
    }

    // 3. Seed Jewellery Products for Kundan Heritage Jewellers
    const jewelleryProducts = [
      {
        name: 'Royal Rajputana Kundan & Polki Bridal Choker Set',
        slug: 'royal-rajputana-kundan-polki-choker-set',
        sku: 'KHJ-CHK-01',
        description: 'Exquisite bridal choker set handcrafted with 22K gold foil kundan, uncut polki stones, and Zambian emerald beads. Includes matching heavy jhumkas and maang tikka.',
        category: jewelleryCategory._id,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 45999,
        discountPrice: 38999,
        storeType: 'jewellery',
        material: '22K Gold Foil Kundan, Polki & Emerald',
        occasion: 'Bridal',
        stock: 5,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        storeSlug: 'kundan-heritage-jewellers',
        storeName: 'Kundan Heritage Jewellers',
        status: 'active',
        specifications: {
          hallmark: 'BIS 916 Hallmarked 22K Gold',
          plating: 'Micron Antique Gold',
          clasp: 'Adjustable Zari Dori',
        },
      },
      {
        name: 'Kashi 22K Hallmarked Floral Gold Kada Pair',
        slug: 'kashi-22k-hallmarked-floral-gold-kada-pair',
        sku: 'KHJ-KAD-02',
        description: 'Traditional handcrafted floral filigree kadas sculpted in pure 22K hallmark gold finish with ruby stone accents. A timeless heirloom piece for weddings and festivals.',
        category: jewelleryCategory._id,
        images: [
          'https://images.unsplash.com/photo-1611591475837-775677dffad3?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 58500,
        discountPrice: 49999,
        storeType: 'jewellery',
        material: '22K Gold Filigree & Ruby Gemstones',
        occasion: 'Festive / Wedding',
        stock: 6,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        storeSlug: 'kundan-heritage-jewellers',
        storeName: 'Kundan Heritage Jewellers',
        status: 'active',
        specifications: {
          hallmark: 'BIS 916 Hallmarked',
          size: '2.6 / 2.8 Openable Screw',
        },
      },
      {
        name: 'Nawabi Nizam Basra Pearl & Emerald 5-Strand Haar',
        slug: 'nawabi-nizam-basra-pearl-emerald-haar',
        sku: 'KHJ-HAR-03',
        description: 'Nizam royal inspired multi-strand necklace strung with natural Basra-style lustrous pearls, carved Colombian emerald pendants, and polki motifs.',
        category: jewelleryCategory._id,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 28500,
        discountPrice: 24000,
        storeType: 'jewellery',
        material: 'Basra Pearls & Carved Emerald',
        occasion: 'Royal Gala / Wedding',
        stock: 8,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        storeSlug: 'kundan-heritage-jewellers',
        storeName: 'Kundan Heritage Jewellers',
        status: 'active',
        specifications: {
          strands: '5-Strand Layered',
          length: '24 Inches Royal Drop',
        },
      },
      {
        name: 'Solitaire Diamond Cut 18K Rose Gold Ring',
        slug: 'solitaire-diamond-cut-18k-rose-gold-ring',
        sku: 'KHJ-RNG-04',
        description: 'Elegance redefined with a brilliant 2-carat VVS diamond cut solitaire seated gracefully on an 18K hallmarked rose gold band. Certified authenticity card included.',
        category: jewelleryCategory._id,
        images: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 19999,
        discountPrice: 16499,
        storeType: 'jewellery',
        material: '18K Rose Gold & Certified Solitaire',
        occasion: 'Engagement / Everyday Luxury',
        stock: 12,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        storeSlug: 'kundan-heritage-jewellers',
        storeName: 'Kundan Heritage Jewellers',
        status: 'active',
        specifications: {
          stone: '2 Carat Ideal Cut VVS1 Solitaire',
          metal: '18K Hallmarked Rose Gold',
        },
      },
    ];

    for (const p of jewelleryProducts) {
      await Product.findOneAndUpdate({ slug: p.slug }, { $set: p }, { upsert: true, new: true });
      console.log(`[Product] Seeded jewellery: ${p.name}`);
    }

    // 4. Seed Hair Products for Crown Luxe Hair Studio
    const hairProducts = [
      {
        name: '100% Virgin Remy 7-Piece Clip-in Hair Extensions (24 Inch)',
        slug: 'crown-luxe-virgin-remy-clip-in-extensions-24in',
        sku: 'CLH-CLP-01',
        description: 'Ultra-luxurious 100% pure Indian Remy virgin hair extensions. Double drawn thick from root to tip. Seamless clips blend invisibly into natural hair and can be heat styled.',
        category: hairCategory._id,
        images: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 14999,
        discountPrice: 11999,
        storeType: 'hair',
        material: '100% Virgin Remy Human Hair',
        occasion: 'Bridal / Glam / Daily Volume',
        stock: 10,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        storeSlug: 'crown-luxe-hair',
        storeName: 'Crown Luxe Hair Studio',
        status: 'active',
        specifications: {
          length: '24 Inches (60 cm)',
          weight: '160 Grams (7 Clip Wefts)',
          texture: 'Natural Silky Straight / Heat Tolerant to 220°C',
        },
      },
      {
        name: 'HD Invisible Seamless Lace Front Human Hair Wig (22 Inch)',
        slug: 'crown-luxe-hd-lace-front-wig-22in',
        sku: 'CLH-WIG-02',
        description: 'Melt into your skin with ultra-thin Swiss HD lace. Hand-tied baby hair with pre-plucked bleached knots for an undetectable, breathtaking hairline.',
        category: hairCategory._id,
        images: [
          'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 26999,
        discountPrice: 21999,
        storeType: 'hair',
        material: '100% Raw Virgin Hair & Swiss HD Lace',
        occasion: 'Celebrity Glam / Everyday Transformation',
        stock: 6,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        storeSlug: 'crown-luxe-hair',
        storeName: 'Crown Luxe Hair Studio',
        status: 'active',
        specifications: {
          density: '180% Full Density',
          lace: '13x4 Swiss Undetectable HD Lace',
          capSize: 'Medium (Adjustable Straps)',
        },
      },
      {
        name: 'Luxe Moroccan Organic Cold-Pressed Argan Repair Serum (100ml)',
        slug: 'crown-luxe-moroccan-argan-repair-serum',
        sku: 'CLH-SRM-03',
        description: 'Infused with cold-pressed Moroccan Argan oil, liquid keratin, and Vitamin E. Instantly seals split ends, halts frizz, and infuses brilliant glass-hair shine without weight.',
        category: hairCategory._id,
        images: [
          'https://images.unsplash.com/photo-1608248597359-0a60ff9e03d9?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 1899,
        discountPrice: 1499,
        storeType: 'hair',
        material: 'Pure Cold-Pressed Moroccan Argan Oil',
        occasion: 'Daily Hair Ritual / Post Heat Styling',
        stock: 35,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        storeSlug: 'crown-luxe-hair',
        storeName: 'Crown Luxe Hair Studio',
        status: 'active',
        specifications: {
          volume: '100 ml (3.4 fl. oz.)',
          type: '100% Sulfate & Paraben Free Organic Formula',
        },
      },
      {
        name: 'Silk Press Nano-Titanium Pro Hair Styling Wand & Curler',
        slug: 'crown-luxe-nano-titanium-pro-styling-wand',
        sku: 'CLH-WND-04',
        description: 'Salon grade nano-titanium smooth glide plates with intelligent ionic heat control. Straighten in a single pass or sculpt effortless beach waves with mirror shine.',
        category: hairCategory._id,
        images: [
          'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
        ],
        price: 4999,
        discountPrice: 3899,
        storeType: 'hair',
        material: 'Nano Titanium Ceramic with Ionic Generator',
        occasion: 'Salon Styling & Curling',
        stock: 14,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        storeSlug: 'crown-luxe-hair',
        storeName: 'Crown Luxe Hair Studio',
        status: 'active',
        specifications: {
          temperature: 'Up to 230°C (450°F) Digital Display',
          cord: '360° Swivel Professional 2.5m Cord',
        },
      },
    ];

    for (const p of hairProducts) {
      await Product.findOneAndUpdate({ slug: p.slug }, { $set: p }, { upsert: true, new: true });
      console.log(`[Product] Seeded hair care: ${p.name}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedMultiIndustryStores();

