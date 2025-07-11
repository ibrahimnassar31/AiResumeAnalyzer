import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export async function registerUser({ username, email, password }) {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error('User already exists');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  return user;
}
