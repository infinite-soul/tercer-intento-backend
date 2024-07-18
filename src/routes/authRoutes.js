import express from 'express';
import passport from 'passport';
import { UserModel } from '../dao/MongoDB/User.model.js';
import bcrypt from 'bcrypt';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/login',
    failureRedirect: '/register'
}));

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

router.get('/profile', isAuthenticated, (req, res) => {
    const user = req.user || req.session.user;
    if (user) {
        res.json({
            name: user.name,
            email: user.email,
            githubId: user.githubId,
            role: user.role // Asumiendo que el rol del usuario también es importante
        });
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/users/profile-github', passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Redirigir al usuario a la página de completar registro si es necesario
        if (!req.user.name || !req.user.email) {
            return res.redirect('/complete-registration');
        }
        // Si no, redirigir a la página principal
        res.redirect('/api/productos');
    }
);

router.get('/complete-registration', (req, res) => {
    res.render('complete-registration', { user: req.user });
});


router.post('/complete-registration', async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await UserModel.findById(req.user.id);
        user.name = name;
        user.email = email;
        await user.save();
        res.redirect('/productos');
    } catch (err) {
        console.error('Error al completar el registro:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;