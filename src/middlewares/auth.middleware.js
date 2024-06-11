import { UserModel } from '../dao/MongoDB/User.model.js';

// auth.middleware.js
const adminEmail = 'adminCoder@coder.com';
const adminPassword = 'adminCod3r123';

export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'administrador') {
        return next();
    } else {
        res.status(403).send('Acceso denegado: No eres administrador');
    }
};
