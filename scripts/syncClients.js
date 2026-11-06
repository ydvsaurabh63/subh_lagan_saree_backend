import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Store from '../models/Store.js';

async function syncClients() {
  await connectDB();

  const clientAccounts = [
    {
      name: 'Arun Kumar Gupta',
      email: 'arun@arunvastralay.com',
      phone: '+91 98390 12345',
      password: 'password123',
      role: 'client',
      storeName: 'Arun Vastralay',
      accountStatus: 'active',
      credits: 250,
      notes: 'Premier Banarasi Silk Boutique - Varanasi',
    },
    {
      name: 'Veeraj Singhania',
      email: 'veeraj@veerajbrands.com',
      phone: '+91 98250 67890',
      password: 'password123',
      role: 'client',
      storeName: 'Veeraj Brand Seller',
      accountStatus: 'active',
      credits: 250,
      notes: 'Leading Designer Silk Brand Seller - Surat & Mumbai',
    },
  ];

  for (const acc of clientAccounts) {
    let user = await User.findOne({ email: acc.email });
    if (!user) {
      user = await User.create(acc);
      console.log(`Created client user: ${acc.name} (${acc.email})`);
    } else {
      user.storeName = acc.storeName;
      user.phone = acc.phone;
      user.role = 'client';
      user.accountStatus = 'active';
      await user.save();
      console.log(`Updated client user: ${acc.name} (${acc.email})`);
    }

    // Link user to corresponding store
    const storeSlug = acc.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    await Store.findOneAndUpdate({ slug: storeSlug }, { user: user._id, ownerName: user.name, ownerEmail: user.email });
  }

  console.log('Client sync complete.');
  process.exit(0);
}

syncClients().catch((err) => {
  console.error('Error syncing clients:', err);
  process.exit(1);
});
