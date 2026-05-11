import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Exercise from '../models/exercise.model.js';
import Mood from '../models/mood.model.js';
import { ADMIN_BOOTSTRAP } from '../constants/admin.constants.js';

const JWT_EXPIRES_IN = '7d';

const buildAdminToken = (adminUser) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const err = new Error('Server configuration error: JWT_SECRET is missing.');
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign({ userId: adminUser._id.toString(), role: adminUser.role }, jwtSecret, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const sanitizeAdmin = (adminUser) => ({
  id: adminUser._id,
  name: adminUser.name,
  email: adminUser.email,
  role: adminUser.role,
});

const sanitizeExercisePayload = (payload) => {
  const mediaType = ['none', 'link', 'video'].includes(payload.mediaType) ? payload.mediaType : 'none';
  const mediaUrl = String(payload.mediaUrl || '').trim();

  if (mediaType !== 'none' && !mediaUrl) {
    const err = new Error('mediaUrl is required when mediaType is link or video.');
    err.statusCode = 400;
    throw err;
  }

  return {
    title: String(payload.title || '').trim(),
    category: String(payload.category || '').trim(),
    durationMinutes: Number(payload.durationMinutes),
    description: String(payload.description || '').trim(),
    mediaType,
    mediaUrl: mediaType === 'none' ? '' : mediaUrl,
  };
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const adminUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    const token = buildAdminToken(adminUser);

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      data: {
        token,
        admin: sanitizeAdmin(adminUser),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to log in admin.',
      error: error.message,
    });
  }
};

const forgotAdminPassword = async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Admin email is required.',
      });
    }

    if (email !== ADMIN_BOOTSTRAP.email) {
      return res.status(400).json({
        success: false,
        message: `Use the default admin email: ${ADMIN_BOOTSTRAP.email}`,
      });
    }

    const passwordHash = await bcrypt.hash(ADMIN_BOOTSTRAP.password, 10);
    const adminUser = await User.findOneAndUpdate(
      { email: ADMIN_BOOTSTRAP.email },
      {
        name: ADMIN_BOOTSTRAP.name,
        email: ADMIN_BOOTSTRAP.email,
        passwordHash,
        role: 'admin',
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin password has been restored to the default hardcoded password.',
      data: {
        email: ADMIN_BOOTSTRAP.email,
        password: ADMIN_BOOTSTRAP.password,
        admin: sanitizeAdmin(adminUser),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to restore admin credentials.',
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = (req.query.search || '').trim();

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully.',
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      filters: {
        search,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      error: error.message,
    });
  }
};

const manageExercises = async (req, res) => {
  try {
    const { action, id, ...payload } = req.body;

    if (!action || !['create', 'update', 'delete'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be one of: create, update, delete.',
      });
    }

    if (action === 'create') {
      const exercise = await Exercise.create(sanitizeExercisePayload(payload));
      return res.status(201).json({
        success: true,
        message: 'Exercise created successfully.',
        data: exercise,
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Exercise id is required for update/delete actions.',
      });
    }

    if (action === 'update') {
      const exercise = await Exercise.findByIdAndUpdate(id, sanitizeExercisePayload(payload), {
        new: true,
        runValidators: true,
      });
      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: 'Exercise not found.',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Exercise updated successfully.',
        data: exercise,
      });
    }

    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully.',
      data: { id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to manage exercise.',
      error: error.message,
    });
  }
};

const getAnalyticsSummary = async (req, res) => {
  try {
    const activeCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [totalUsers, activeUsersAgg, totalExercises, totalMoodEntries] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Mood.aggregate([
        { $match: { createdAt: { $gte: activeCutoff } } },
        { $group: { _id: '$userId' } },
        { $count: 'count' },
      ]),
      Exercise.countDocuments(),
      Mood.countDocuments(),
    ]);
    const activeUsers = activeUsersAgg[0]?.count || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalExercises,
        totalMoodEntries,
        platformHealth: 99.9,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary.',
      error: error.message,
    });
  }
};

const getActivityMix = async (req, res) => {
  try {
    const exercisesByCategory = await Exercise.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: exercisesByCategory.map((item) => ({
        category: item._id,
        count: item.count,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch activity mix.',
      error: error.message,
    });
  }
};

export { adminLogin, forgotAdminPassword, getAllUsers, manageExercises, getAnalyticsSummary, getActivityMix };
