import User from '../models/User.js';

export const initDefaultUsers = async () => {
  try {
    // 1. Ensure SuperAdmin
    const superAdminExists = await User.findOne({ email: 'superadmin@subhlagansarees.com' });
    if (!superAdminExists) {
      await User.create({
        name: 'Chief SuperAdmin',
        email: 'superadmin@subhlagansarees.com',
        phone: '+91 99999 11111',
        password: 'superadmin123',
        role: 'superadmin',
        accountStatus: 'active',
        notes: 'Master Superadmin of the platform',
      });
      console.log('✓ Default SuperAdmin seeded: superadmin@subhlagansarees.com');
    } else {
      let needSave = false;
      if (superAdminExists.role !== 'superadmin') {
        superAdminExists.role = 'superadmin';
        needSave = true;
      }
      if (superAdminExists.accountStatus !== 'active') {
        superAdminExists.accountStatus = 'active';
        needSave = true;
      }
      if (needSave) await superAdminExists.save();
    }

    // 2. Ensure Admin
    const adminExists = await User.findOne({ email: 'admin@subhlagansarees.com' });
    if (!adminExists) {
      await User.create({
        name: 'Senior Admin Manager',
        email: 'admin@subhlagansarees.com',
        phone: '+91 98765 00000',
        password: 'admin123',
        role: 'admin',
        storeName: 'Subh Lagan Sarees',
        accountStatus: 'active',
        notes: 'Platform Administrator',
      });
      console.log('✓ Default Admin seeded: admin@subhlagansarees.com');
    } else {
      let needSave = false;
      if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        needSave = true;
      }
      if (adminExists.accountStatus !== 'active') {
        adminExists.accountStatus = 'active';
        needSave = true;
      }
      if (!adminExists.storeName) {
        adminExists.storeName = 'Subh Lagan Sarees';
        needSave = true;
      }
      if (needSave) await adminExists.save();
    }

    // 3. Ensure Client
    const clientExists = await User.findOne({ email: 'client@subhlagansarees.com' });
    if (!clientExists) {
      await User.create({
        name: 'Boutique Owner (Client)',
        email: 'client@subhlagansarees.com',
        phone: '+91 81475 40362',
        password: 'client123',
        role: 'client',
        storeName: 'Subh Lagan Sarees Flagship',
        credits: 250,
        accountStatus: 'active',
        notes: 'Primary Client Store',
      });
      console.log('✓ Default Client seeded: client@subhlagansarees.com');
    } else {
      let needSave = false;
      if (clientExists.role !== 'client') {
        clientExists.role = 'client';
        needSave = true;
      }
      if (clientExists.accountStatus !== 'active') {
        clientExists.accountStatus = 'active';
        needSave = true;
      }
      if (needSave) await clientExists.save();
    }
  } catch (err) {
    console.error('Warning in initDefaultUsers:', err.message);
  }
};

