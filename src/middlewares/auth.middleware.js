import jwt from 'jsonwebtoken';
import { UserModel } from '../dao/MongoDB/User.model.js';
import "dotenv/config";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && (req.user.email === process.env.ADMIN_EMAIL || req.user.role === 'admin' || req.user.role === 'usuario' || req.user.role === 'premium')) {
        return next();
    } else {
        res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes' });
    }
};

export const isUser = (req, res, next) => {
    if (req.user && (req.user.role === 'usuario' || req.user.role === 'premium')) {
        return next();
    } else {
        res.status(403).json({ error: 'Acceso denegado: Esta acción requiere ser usuario' });
    }
};

export const isPremium = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next();
    } else {
        res.status(403).json({ error: 'Acceso denegado: Esta acción requiere ser usuario premium' });
    }
};