import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const user = await User.create({ name, email, password, role: 'admin' });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken } });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken } });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token is required' });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

    const accessToken = generateAccessToken(user);
    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
