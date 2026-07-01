import User from '../models/User.js';

export const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'aliabdalla09zx@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!';
    const name = process.env.ADMIN_NAME || 'Ali Abdalla';

    const existing = await User.findOne({ email });

    if (existing) {
      existing.password = password;
      existing.name = name;
      existing.role = 'admin';
      await existing.save();
      console.log('Admin credentials updated');
      return;
    }

    await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    console.log('Default admin seeded');
  } catch (error) {
    console.error('Admin seed failed:', error);
  }
};
