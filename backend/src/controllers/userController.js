import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users: users.map((u) => u.toSafeObject()) });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, store } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (!['Admin', 'Manager', 'Cashier'].includes(role)) {
    res.status(400);
    throw new Error('Role must be Admin, Manager or Cashier');
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role, store: store || 'Central Flagship' });
  res.status(201).json({ success: true, user: user.toSafeObject() });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, role, store } = req.body;
  if (role && !['Admin', 'Manager', 'Cashier'].includes(role)) {
    res.status(400);
    throw new Error('Role must be Admin, Manager or Cashier');
  }
  if (user._id.equals(req.user._id) && role && role !== 'Admin') {
    res.status(400);
    throw new Error('You cannot change your own Admin role');
  }

  if (name) user.name = name;
  if (role) user.role = role;
  if (store) user.store = store;

  await user.save();
  res.status(200).json({ success: true, user: user.toSafeObject() });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user._id.equals(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User removed', id: req.params.id });
});