import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { ADMIN_BOOTSTRAP } from '../constants/admin.constants.js';

const ensureBootstrapAdmin = async () => {
  const normalizedEmail = ADMIN_BOOTSTRAP.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(ADMIN_BOOTSTRAP.password, 10);

  const adminUser = await User.findOne({ email: normalizedEmail });

  if (!adminUser) {
    await User.create({
      name: ADMIN_BOOTSTRAP.name,
      email: normalizedEmail,
      passwordHash,
      role: 'admin',
    });
    return;
  }

  adminUser.name = ADMIN_BOOTSTRAP.name;
  adminUser.email = normalizedEmail;
  adminUser.passwordHash = passwordHash;
  adminUser.role = 'admin';
  await adminUser.save();
};

export { ensureBootstrapAdmin };
