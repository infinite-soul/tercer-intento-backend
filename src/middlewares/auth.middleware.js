import { UserModel } from '../dao/MongoDB/User.model.js';
import "dotenv/config";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export const isAuthenticated = (req, res, next) => {
    console.log('Is authenticated middleware. User:', req.user);
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/login');
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