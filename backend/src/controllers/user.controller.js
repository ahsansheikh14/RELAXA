import User from '../models/user.model.js';

const toProfileResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user: toProfileResponse(user) });
  } catch (err) {
    return next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'name is required.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name: String(name).trim() },
      { new: true, runValidators: true, select: '-passwordHash' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res
      .status(200)
      .json({ message: 'Profile updated successfully.', user: toProfileResponse(updatedUser) });
  } catch (err) {
    return next(err);
  }
};

export { getUserProfile, updateUserProfile };
