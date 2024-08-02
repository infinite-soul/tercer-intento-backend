import { UserModel } from '../dao/MongoDB/User.model.js';
import "dotenv/config";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && (req.user.email === adminEmail || req.user.role === 'admin')) {
        return next();
    } else {
        res.status(403).json({ error: 'Acceso denegado: No eres administrador' });
    }
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'usuario') {
        return next();
    } else {
        res.status(403).json({ error: 'Acceso denegado: Esta acción requiere ser usuario' });
    }
};