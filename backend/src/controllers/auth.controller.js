import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.model.js';

const JWT_EXPIRES_IN = '7d';

const buildToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    const err = new Error('Server configuration error: JWT_SECRET is missing.');
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign({ userId: user._id.toString(), role: user.role }, jwtSecret, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const getMailTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required.' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters long.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = buildToken(user);

    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = buildToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'email is required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return a generic success response to avoid account enumeration.
    if (!user) {
      return res.status(200).json({
        message: 'If this email exists, a reset link has been sent.',
      });
    }

    const transporter = getMailTransporter();
    if (!transporter) {
      return res.status(503).json({
        message: 'Password reset email service is not configured yet.',
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendBaseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      normalizedEmail
    )}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: normalizedEmail,
      subject: 'Relaxa Password Reset',
      text: `Reset your password using this secure link (valid for 15 minutes): ${resetLink}`,
      html: `<p>Reset your password using this secure link (valid for 15 minutes):</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    return res.status(200).json({
      message: 'If this email exists, a reset link has been sent.',
    });
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'email, token and newPassword are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'newPassword must be at least 6 characters long.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    if (
      !user.passwordResetTokenHash ||
      user.passwordResetTokenHash !== tokenHash ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (err) {
    return next(err);
  }
};

const socialLogin = async (req, res, next) => {
  try {
    const { provider, email, name } = req.body;

    if (!provider || !['google', 'apple'].includes(provider)) {
      return res.status(400).json({ message: 'provider must be google or apple.' });
    }

    if (!email) {
      return res.status(400).json({ message: 'email is required for social login.' });
    }

    const providerEnabled =
      (provider === 'google' && process.env.GOOGLE_OAUTH_ENABLED === 'true') ||
      (provider === 'apple' && process.env.APPLE_OAUTH_ENABLED === 'true');

    if (!providerEnabled) {
      return res.status(501).json({
        message: `${provider} login is not configured yet.`,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomHash = await bcrypt.hash(`${provider}-${Date.now()}`, 10);
      user = await User.create({
        name: name?.trim() || `${provider} user`,
        email: normalizedEmail,
        passwordHash: randomHash,
      });
    }

    const token = buildToken(user);
    return res.status(200).json({
      message: `${provider} login successful.`,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'newPassword must be at least 6 characters long.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    return next(err);
  }
};

export { registerUser, loginUser, forgotPassword, resetPassword, socialLogin, changePassword };
