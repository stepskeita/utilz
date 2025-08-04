import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/User.js';

export const generateTokens = (user) => {
  // Add fallback values for secrets (for development only)
  const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_key';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key';

  if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET environment variable is not set. Using default value for development.');
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    console.warn('WARNING: JWT_REFRESH_SECRET environment variable is not set. Using default value for development.');
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    jwtSecret,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    refreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const registerUser = async (userData) => {
  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      email,
    }
  });

  if (existingUser) {
    throw createError(409, 'Email already exists');
  }

  // Create new user
  const newUser = await User.create({
    email,
    password,
    // By default, new users get 'user' role
  });

  return {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role
  };
};

export const authenticateUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user
  const user = await User.findOne({
    where: {
      email
    }
  });

  if (!user || !(await user.isValidPassword(password))) {
    throw createError(401, 'Invalid credentials');
  }

  if (!user.isActive) {
    throw createError(403, 'Account is disabled');
  }

  // Update last login timestamp
  await user.update({ lastLogin: new Date() });

  // Generate tokens
  const tokens = generateTokens(user);
  console.log(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    tokens
  };
};

export const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(400, 'Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      throw createError(401, 'Invalid refresh token');
    }

    // Generate new tokens
    return generateTokens(user);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createError(401, 'Refresh token expired, please login again');
    }
    throw error;
  }
};

export default {
  generateTokens,
  registerUser,
  authenticateUser,
  refreshUserToken
};