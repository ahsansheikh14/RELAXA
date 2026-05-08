import User from '../models/user.model.js';
import Exercise from '../models/exercise.model.js';

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

    if (adminUser.passwordHash !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      data: {
        token: `admin-token-${adminUser._id}`,
        admin: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
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
      const exercise = await Exercise.create(payload);
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
      const exercise = await Exercise.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
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

export { adminLogin, getAllUsers, manageExercises };
