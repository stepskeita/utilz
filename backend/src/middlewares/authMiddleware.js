import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import createError from 'http-errors';

export const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(createError(401, 'Access token is required'));
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user || !user.isActive) {
            return next(createError(401, 'User not found or inactive'));
        }

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(createError(401, 'Token expired'));
        }
        return next(createError(401, 'Invalid token'));
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        return next();
    }
    return next(createError(403, 'Access forbidden: Admin privileges required'));
};

export const authorizeSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        return next();
    }
    return next(createError(403, 'Access forbidden: Super Admin privileges required'));
};