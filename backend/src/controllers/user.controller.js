import { registerUser, loginUser } from '../services/user.service.js';
import { generateToken } from '../utils/jwt.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  const token = generateToken(user._id);
  res.status(201).json({ user: { username: user.username, email: user.email, _id: user._id }, token });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const token = generateToken(user._id);
  res.status(200).json({ user: { username: user.username, email: user.email, _id: user._id }, token });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});
