import { UserModel } from '../dao/MongoDB/User.model.js';

const adminEmail = 'adminCoder@coder.com';
const adminPassword = 'adminCod3r123';

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
        res.status(403).send('Acceso denegado: No eres administrador');
    }
};