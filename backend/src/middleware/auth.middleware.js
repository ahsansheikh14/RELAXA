import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET is missing.' });
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Invalid token payload.' });
    }

    // Keep req.user minimal and stable for role checks and ownership.
    const user = await User.findById(decoded.userId).select('_id role');
    if (!user) {
      return res.status(401).json({ message: 'User linked to token no longer exists.' });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    return next(err);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  return next();
};

export { protect, adminOnly };
