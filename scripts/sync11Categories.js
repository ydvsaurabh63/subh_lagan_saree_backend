import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const TARGET_11_CATEGORIES = [
  { name: 'Banarasi', slug: 'banarasi', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Royal Banarasi Silk Sarees' },
  { name: 'Kanjivaram', slug: 'kanjivaram', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', description: 'Gold Zari Kanchipuram Silk Sarees' },
  { name: 'Bridal Couture', slug: 'bridal-couture', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Handcrafted Bridal & Wedding Sarees' },
  { name: 'Pure Silk', slug: 'pure-silk', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', description: '100% Pure Handloom Silk Sarees' },
  { name: 'Try the look', slug: 'try-the-look', image: '/models/model-1.png', description: '3D AI Virtual Fitting Room Looks' },
  { name: 'Shop by occasion', slug: 'shop-by-occasion', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Wedding, Festive, Party & Traditional Occasions' },
  { name: 'Best sellers', slug: 'best-sellers', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Most Loved Best Selling Sarees' },
  { name: 'Featured brands', slug: 'featured-brands', image: 'https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=600&q=80', description: 'Couture Handloom Weaving Houses' },
  { name: 'New arrival', slug: 'new-arrival', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', description: 'Latest Season Handloom Arrivals' },
  { name: 'Shop by fabric', slug: 'shop-by-fabric', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Katan, Kanchipuram, Organza & Georgette Fabrics' },
  { name: 'Trending', slug: 'trending', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Trending Masterpiece Saree Drapes' }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // 1. Upsert the 11 target categories
  const targetMap = {};
  for (const item of TARGET_11_CATEGORIES) {
    let cat = await Category.findOne({ slug: item.slug });
    if (!cat) {
      cat = await Category.findOne({ name: item.name });
    }
    if (!cat) {
      if (item.slug === 'banarasi') cat = await Category.findOne({ slug: 'banarasi-sarees' });
      else if (item.slug === 'kanjivaram') cat = await Category.findOne({ slug: 'kanjivaram-sarees' });
      else if (item.slug === 'bridal-couture') cat = await Category.findOne({ slug: 'bridal-sarees' });
      else if (item.slug === 'pure-silk') cat = await Category.findOne({ slug: 'silk-sarees' });
    }

    if (cat) {
      await Category.updateOne(
        { _id: cat._id },
        {
          $set: {
            name: item.name,
            slug: item.slug,
            description: item.description,
            image: cat.image || item.image,
          },
        }
      );
      cat = await Category.findById(cat._id);
      targetMap[item.slug] = cat;
      console.log('Updated category to exact name:', item.name, '-> ID:', cat._id);
    } else {
      cat = await Category.create(item);
      targetMap[item.slug] = cat;
      console.log('Created category:', item.name, '-> ID:', cat._id);
    }
  }

  const validIds = Object.values(targetMap).map(c => c._id.toString());
  const defaultFallbackId = targetMap['pure-silk']._id;

  // 2. Re-assign products that point to obsolete categories
  const allProducts = await Product.find({});
  let reassignedCount = 0;
  for (const prod of allProducts) {
    if (!prod.category || !validIds.includes(prod.category.toString())) {
      let targetId = defaultFallbackId;
      const f = (prod.fabric || '').toLowerCase();
      const n = (prod.name || '').toLowerCase();
      if (f.includes('banarasi') || n.includes('banarasi')) targetId = targetMap['banarasi']._id;
      else if (f.includes('kanjivaram') || f.includes('kanchi') || n.includes('kanjivaram')) targetId = targetMap['kanjivaram']._id;
      else if (prod.isBridal || n.includes('bridal') || n.includes('wedding')) targetId = targetMap['bridal-couture']._id;
      else if (prod.isBestSeller) targetId = targetMap['best-sellers']._id;
      else if (prod.isNewArrival) targetId = targetMap['new-arrival']._id;

      prod.category = targetId;
      await prod.save();
      reassignedCount++;
    }
  }
  console.log('Reassigned products pointing to obsolete categories:', reassignedCount);

  // 3. Delete all obsolete categories (anything outside the 11)
  const delFilter = { _id: { $nin: validIds.map(id => new mongoose.Types.ObjectId(id)) } };
  const deleteResult = await Category.deleteMany(delFilter);
  console.log('Deleted obsolete categories count:', deleteResult.deletedCount);

  // 4. Verify exact 11 categories in DB
  const finalCats = await Category.find({});
  console.log('Final categories count in DB:', finalCats.length);
  finalCats.forEach((c, i) => console.log(`${i + 1}. ${c.name} (${c.slug})`));

  process.exit(0);
}

run();
