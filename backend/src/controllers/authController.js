import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// @desc    Register a new user (self-signup)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  // Self-registration always creates a Cashier account. Any 'role' sent in the
  // request body is intentionally ignored — Admin/Manager accounts must be
  // created by an existing Admin via /api/users, never chosen by the signer-upper.
  const user = await User.create({ name, email, password, role: 'Cashier' });

  res.status(201).json({
    success: true,
    user: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    user: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Request a password reset token
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return the same generic response whether or not the account exists,
  // so this endpoint can't be used to discover which emails are registered.
  const genericResponse = {
    success: true,
    message: 'If an account exists for this email, reset instructions have been sent.',
  };

  if (!user) {
    res.status(200).json(genericResponse);
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: wire up a real email provider (Nodemailer + SMTP, SendGrid, Resend, etc.)
  // and send `resetToken` to the user's email instead of exposing it here.
  // Until that's connected, the token is logged server-side so the flow can be
  // tested end-to-end.
  console.log(`[password reset] token for ${user.email}: ${resetToken} (valid 15 minutes)`);

  res.status(200).json({
    ...genericResponse,
    // Remove this field once real email delivery is wired up — it's only
    // here so the reset flow is testable without an email provider configured.
    devResetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken,
  });
});

// @desc    Reset password using a valid token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    res.status(400);
    throw new Error('Email, reset token and new password are required');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    email: email.toLowerCase(),
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    res.status(400);
    throw new Error('Reset token is invalid or has expired');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully — please log in' });
});